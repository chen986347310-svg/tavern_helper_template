const CDP_PORT = process.env.CDP_PORT ?? '9223';

async function json(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

async function main() {
  const targets = await json(`http://localhost:${CDP_PORT}/json`);
  const target = targets.find(t => /SillyTavern/i.test(t.title ?? '') || /SillyTavern/i.test(t.url ?? ''));
  if (!target?.webSocketDebuggerUrl) throw new Error('未找到 SillyTavern CDP target，请确认 Chrome 以 --remote-debugging-port 启动');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();

  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });

  await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));

  function send(method, params = {}) {
    const callId = ++id;
    ws.send(JSON.stringify({ id: callId, method, params }));
    return new Promise(resolve => pending.set(callId, resolve));
  }

  const expression = `(() => {
    const data = Mvu.getMvuData({ type: 'message', message_id: 'latest' })?.stat_data;
    return data?.系统?.待处理交互 ?? null;
  })()`;
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  const queue = result.result?.result?.value;

  if (!Array.isArray(queue)) throw new Error('无法读取 系统.待处理交互');
  if (queue.length > 0) {
    console.error(JSON.stringify(queue, null, 2));
    throw new Error('待处理交互仍非空：AI 承接后必须清空队列。本脚本只验收，不自动清空。');
  }

  console.log('PASS: 系统.待处理交互 已清空');
  ws.close();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
