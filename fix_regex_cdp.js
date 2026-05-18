const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

// Change [界面]状态栏 regex: match end of string instead of placeholder tag
// This fires on every AI message regardless of placeholder presence
const script = `(async()=>{
  var m = await import('/scripts/extensions/regex/engine.js');
  var scripts = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);

  // Find and update [界面]状态栏
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].scriptName === '[界面]状态栏') {
      scripts[i].findRegex = '/$/g';
      // Use static HTML status bar (no iframe - survives DOMPurify)
      scripts[i].replaceString = '<div style="padding:12px;margin:8px 0;border:1px solid rgba(212,160,23,0.3);border-radius:6px;background:linear-gradient(180deg,rgba(42,31,20,0.9),rgba(30,21,13,0.95));color:#d4a017;text-align:center;font-family:serif;"><div style="font-size:14px;letter-spacing:0.1em;">合欢宗·宗门面板</div><div style="font-size:12px;color:rgba(180,150,100,0.6);margin-top:6px;">识灵幕已激活</div></div>';
      scripts[i].substituteRegex = 0;
      break;
    }
  }

  await m.saveScriptsByType(scripts, m.SCRIPT_TYPES.SCOPED);

  // Verify
  var after = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
  var bar = after.find(function(s){ return s.scriptName === '[界面]状态栏'; });
  return JSON.stringify({
    updated: bar ? bar.findRegex : 'not found',
    count: after.length,
    names: after.map(function(s){return s.scriptName;}),
  });
})()`;

client.on('open', () => {
  client.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: script, returnByValue: true, awaitPromise: true }
  }));
});

client.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id === 1) {
    console.log('Result:', JSON.stringify(msg.result?.result?.value));
    client.close();
    process.exit(0);
  }
});

client.on('error', (e) => { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 15000);
