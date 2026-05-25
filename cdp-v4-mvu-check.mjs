#!/usr/bin/env node
// v4 MVU CDP acceptance checker
// Usage:
//   node cdp-v4-mvu-check.mjs
//   node cdp-v4-mvu-check.mjs --port 9222
//   node cdp-v4-mvu-check.mjs --apply-empty-validation

const DEFAULT_PORTS = [9222, 9223];
const CORE_NPCS = ['白芷', '苏芸', '纪兰', '沈月秋', '柳素衣'];
const REQUIRED_SYSTEM_KEYS = ['时辰', '当前场景', '待处理交互', '场景上下文', '风声列表', '当前追查风声ID'];
const REQUIRED_SCENE_CONTEXT_KEYS = ['地点', '子区域', '场景来源', '公开度', '在场NPC', 'NPC活动', '氛围', '故事钩子', '特殊事件'];
const CLOUD_BASE =
  'https://testingcf.jsdelivr.net/gh/chen986347310-svg/tavern_helper_template@main/public/hehuan';
const CLOUD_ENDPOINTS = [
  `${CLOUD_BASE}/scripts/var_structure.js`,
  `${CLOUD_BASE}/scripts/backend_validate.js`,
  `${CLOUD_BASE}/status/index.html`,
];

const args = new Set(process.argv.slice(2));
const getArg = name => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const requestedPort = getArg('--port');
const PORTS = requestedPort ? [Number(requestedPort)] : DEFAULT_PORTS;
const APPLY_EMPTY_VALIDATION = args.has('--apply-empty-validation');
const JSON_ONLY = args.has('--json');

const checks = [];
const add = (name, pass, details = '', severity = 'fail') => checks.push({ name, pass: Boolean(pass), details, severity });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchJson(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function headOk(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    return { ok: response.ok, status: response.status };
  } catch (error) {
    return { ok: false, status: String(error?.message ?? error) };
  } finally {
    clearTimeout(timer);
  }
}

async function discoverPage() {
  const errors = [];
  for (const port of PORTS) {
    try {
      const pages = await fetchJson(`http://127.0.0.1:${port}/json`);
      const page = pages.find(item => (item.title ?? '').includes('SillyTavern'))
        ?? pages.find(item => (item.url ?? '').includes('localhost:8000'))
        ?? pages[0];
      if (page?.webSocketDebuggerUrl) return { port, page };
      errors.push(`port ${port}: no debuggable page`);
    } catch (error) {
      errors.push(`port ${port}: ${error?.message ?? error}`);
    }
  }
  throw new Error(`Cannot find SillyTavern CDP page. ${errors.join('; ')}`);
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl.replace('localhost', '127.0.0.1');
    this.id = 0;
    this.pending = new Map();
    this.contexts = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.method === 'Runtime.executionContextCreated') this.contexts.push(message.params.context);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject, timer } = this.pending.get(message.id);
        clearTimeout(timer);
        this.pending.delete(message.id);
        message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
      }
    };
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = () => reject(new Error('WebSocket connection failed'));
      setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
    });
    await this.send('Runtime.enable');
    await sleep(1000);
  }

  send(method, params = {}, timeoutMs = 15000) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timeout`));
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
    });
  }

  async eval(expression, contextId) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      contextId,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      const text = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
      throw new Error(text);
    }
    return result.result?.value;
  }

  close() {
    try { this.ws?.close(); } catch {}
  }
}

async function findHookContext(client) {
  for (const context of client.contexts) {
    try {
      const hasHook = await client.eval(`typeof window.__TEST_applyValidatedUpdate === 'function'`, context.id);
      if (hasHook) return context;
    } catch {}
  }
  return null;
}

function validateLatest(latest, hookContext, endpointResults, emptyValidation) {
  const stat = latest?.stat_data;
  const system = stat?.系统 ?? {};
  const sceneContext = system?.场景上下文 ?? {};

  for (const endpoint of endpointResults) {
    add(`local endpoint: ${endpoint.url}`, endpoint.ok, `status=${endpoint.status}`);
  }

  add('Mvu latest stat_data exists', Boolean(stat), stat ? 'found' : 'missing');
  for (const key of REQUIRED_SYSTEM_KEYS) {
    add(`system key: ${key}`, Object.prototype.hasOwnProperty.call(system, key), JSON.stringify(Object.keys(system)));
  }

  add('open current scene string', typeof system.当前场景 === 'string' && system.当前场景.length > 0, String(system.当前场景 ?? ''));
  add('pending interactions array', Array.isArray(system.待处理交互), JSON.stringify(system.待处理交互 ?? null));
  add('rumor list array', Array.isArray(system.风声列表), JSON.stringify(system.风声列表 ?? null));
  add('rumor list <= 3', Array.isArray(system.风声列表) && system.风声列表.length <= 3, `count=${system.风声列表?.length ?? 'n/a'}`);

  for (const key of REQUIRED_SCENE_CONTEXT_KEYS) {
    add(`scene context key: ${key}`, Object.prototype.hasOwnProperty.call(sceneContext, key), JSON.stringify(Object.keys(sceneContext ?? {})));
  }
  add('scene context present NPC array', Array.isArray(sceneContext.在场NPC), JSON.stringify(sceneContext.在场NPC ?? null));
  add(
    'scene context NPC names are core names',
    Array.isArray(sceneContext.在场NPC) && sceneContext.在场NPC.every(name => CORE_NPCS.includes(name)),
    JSON.stringify(sceneContext.在场NPC ?? null),
    'warn',
  );

  add('backend validate hook in script iframe', Boolean(hookContext), hookContext ? `contextId=${hookContext.id}` : 'missing');
  if (emptyValidation) {
    add('empty validation returned v4 system', Boolean(emptyValidation.systemKeys?.includes('场景上下文')), JSON.stringify(emptyValidation.systemKeys ?? []));
  }
}

function summarize(discovery, latest, hookContext, emptyValidation) {
  const system = latest?.stat_data?.系统 ?? {};
  const sceneContext = system.场景上下文 ?? {};
  const failures = checks.filter(item => !item.pass && item.severity !== 'warn');
  const warnings = checks.filter(item => !item.pass && item.severity === 'warn');
  return {
    pass: failures.length === 0,
    failureCount: failures.length,
    warningCount: warnings.length,
    cdp: {
      port: discovery.port,
      title: discovery.page.title,
      url: discovery.page.url,
    },
    latest: {
      currentScene: system.当前场景 ?? null,
      time: system.时辰 ?? null,
      pendingCount: Array.isArray(system.待处理交互) ? system.待处理交互.length : null,
      presentNpcs: Array.isArray(sceneContext.在场NPC) ? sceneContext.在场NPC : null,
      rumorCount: Array.isArray(system.风声列表) ? system.风声列表.length : null,
      sceneContext,
    },
    hook: hookContext ? { contextId: hookContext.id, frameId: hookContext.auxData?.frameId ?? null } : null,
    emptyValidation: emptyValidation ?? null,
    checks,
  };
}

function printHuman(summary) {
  const icon = item => item.pass ? '[PASS]' : item.severity === 'warn' ? '[WARN]' : '[FAIL]';
  console.log('\n=== v4 MVU CDP Check ===\n');
  console.log(`CDP: port=${summary.cdp.port} title=${summary.cdp.title} url=${summary.cdp.url}`);
  console.log(`Scene: ${summary.latest.currentScene} / ${summary.latest.time}`);
  console.log(`Present NPCs: ${(summary.latest.presentNpcs ?? []).join(', ') || '(none)'}`);
  console.log(`Rumors: ${summary.latest.rumorCount ?? 'n/a'} | Pending: ${summary.latest.pendingCount ?? 'n/a'}`);
  console.log(`Hook: ${summary.hook ? `context ${summary.hook.contextId}` : 'missing'}`);
  console.log('');
  for (const item of summary.checks) console.log(`${icon(item)} ${item.name}${item.details ? ` — ${item.details}` : ''}`);
  console.log(`\nResult: ${summary.pass ? 'PASS' : 'FAIL'} (${summary.failureCount} failures, ${summary.warningCount} warnings)\n`);
}

async function main() {
  const endpointResults = await Promise.all(CLOUD_ENDPOINTS.map(async url => ({ url, ...(await headOk(url)) })));
  const discovery = await discoverPage();
  const client = new CdpClient(discovery.page.webSocketDebuggerUrl);
  let summary;
  try {
    await client.connect();
    const latest = await client.eval(`(() => {
      try { return window.Mvu?.getMvuData?.({ type: 'message', message_id: 'latest' }) ?? null; }
      catch (error) { return { error: String(error) }; }
    })()`);
    const hookContext = await findHookContext(client);
    let emptyValidation = null;
    if (APPLY_EMPTY_VALIDATION && hookContext) {
      emptyValidation = await client.eval(`(async () => {
        const result = await window.__TEST_applyValidatedUpdate([]);
        const system = result.stat_data?.系统 ?? {};
        return {
          trace: result.trace,
          systemKeys: Object.keys(system),
          currentScene: system.当前场景,
          sceneContext: system.场景上下文,
        };
      })()`, hookContext.id);
    }
    validateLatest(latest, hookContext, endpointResults, emptyValidation);
    summary = summarize(discovery, latest, hookContext, emptyValidation);
  } finally {
    client.close();
  }

  if (JSON_ONLY) console.log(JSON.stringify(summary, null, 2));
  else printHuman(summary);
  process.exit(summary.pass ? 0 : 1);
}

main().catch(error => {
  const summary = {
    pass: false,
    failureCount: 1,
    warningCount: 0,
    error: String(error?.message ?? error),
    checks,
  };
  if (JSON_ONLY) console.log(JSON.stringify(summary, null, 2));
  else {
    console.error('\n=== v4 MVU CDP Check ===\n');
    console.error(`[FAIL] ${summary.error}\n`);
  }
  process.exit(1);
});
