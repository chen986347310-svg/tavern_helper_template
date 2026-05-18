var WebSocket = require('./node_modules/.pnpm/ws@8.18.3/node_modules/ws');
var client = new WebSocket('ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66');
client.on('open', function() {
  client.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression: "(async function() { try { var mod = await import('/scripts/extensions/regex/engine.js'); var list = mod.getScriptsByType(mod.SCRIPT_TYPES.SCOPED); var t = list.find(function(s){return s.scriptName === '[界面]合欢界面';}); if (!t) return JSON.stringify({err:'not found'}); var d = String.fromCharCode(36); t.replaceString = '```\n<body>\n<script>\n' + d + \"('body').load('http://localhost:5500/dist/雌堕合欢宗/index.html')\n</script>\n</body>\n```\"; await mod.saveScriptsByType(list, mod.SCRIPT_TYPES.SCOPED); var c = mod.getScriptsByType(mod.SCRIPT_TYPES.SCOPED).find(function(s){return s.scriptName === '[界面]合欢界面';}); return JSON.stringify({ok:true, val: c ? c.replaceString.substring(0,100) : '?'}); } catch(e) { return JSON.stringify({err: e.message, stack: (e.stack||'').substring(0,200)}); } })()", returnByValue: true, awaitPromise: true}}));
});
client.on('message', function(data) {
  var msg = JSON.parse(data.toString());
  if (msg.id === 1) console.log(msg.result && msg.result.result && msg.result.result.value);
  client.close();
});
client.on('error', function(e) { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(function() { console.log('Timeout'); process.exit(1); }, 15000);
