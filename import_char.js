const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const fs = require('fs');
const path = require('path');

const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

// 读取完整角色卡数据
const charData = JSON.parse(fs.readFileSync(path.resolve('dist/雌堕合欢宗.png'), 'utf8'));
const inner = charData.data || charData;

// 构建 extensions 数据
const extensions = {
  world: '雌堕合欢宗',
  regex_scripts: inner.extensions?.regex_scripts || [],
  tavern_helper: inner.extensions?.tavern_helper || {},
};
const extB64 = Buffer.from(JSON.stringify(extensions), 'utf8').toString('base64');

client.on('open', () => {
  // 尝试访问酒馆的内部变量
  const script = `
(async () => {
  try {
    // 1. 检查当前选中的角色 ID
    // 2. 检查 characters 数组
    // 3. 尝试直接修改并保存

    // 检查是否有 __characters 或类似变量
    const globalVars = [];
    for (const k of Object.getOwnPropertyNames(self)) {
      const v = self[k];
      if (v && typeof v === 'object' && Array.isArray(v) && v.length > 0 && v[0]?.name) {
        globalVars.push(k + '[' + v.length + ']: ' + v.map(c=>c.name).slice(0,5).join(','));
      }
    }

    // 也检查 top
    for (const k of Object.getOwnPropertyNames(top)) {
      try {
        const v = top[k];
        if (v && typeof v === 'object' && Array.isArray(v) && v.length > 0 && v[0]?.name && v[0]?.description) {
          globalVars.push('top.' + k + '[' + v.length + ']: ' + v.map(c=>c.name).slice(0,5).join(','));
        }
      } catch(e) {}
    }

    return globalVars.length > 0 ? JSON.stringify(globalVars) : 'No character arrays found';
  } catch(e) { return 'Error: ' + e.message; }
})()
  `.trim();

  client.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: script, returnByValue: true, awaitPromise: true }
  }));
});

client.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id === 1) {
    console.log('Result:', msg.result?.result?.value);
    client.close();
    process.exit(0);
  }
});

client.on('error', (e) => { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 15000);
