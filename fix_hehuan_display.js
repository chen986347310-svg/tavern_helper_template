var WebSocket = require('./node_modules/.pnpm/ws@8.18.3/node_modules/ws');
var client = new WebSocket('ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66');
client.on('open', function() {
  var expr = "(async()=>{try{var m=await import('/scripts/extensions/regex/engine.js');var l=m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);var s=l[3];var nl=String.fromCharCode(10);var d=String.fromCharCode(36);var sq=String.fromCharCode(39);s.replaceString=['<div id=\"hehuan-interface\" style=\"padding:8px;margin:8px 0;border:1px solid rgba(212,160,23,0.3);border-radius:6px;background:linear-gradient(180deg,rgba(42,31,20,0.9),rgba(30,21,13,0.95));color:#d4a017;\">','<div style=\"text-align:center;padding:12px;font-family:serif;\">','<div style=\"font-size:13px;color:rgba(180,150,100,0.6);letter-spacing:0.05em;\">合欢宗·宗门面板</div>','<div style=\"font-size:11px;color:rgba(180,150,100,0.4);margin-top:4px;\">正在加载...</div>','</div>','</div>'].join(nl);await m.saveScriptsByType(l,m.SCRIPT_TYPES.SCOPED);return JSON.stringify({ok:true,val:s.replaceString});}catch(e){return JSON.stringify({err:e.message});}})()";
  client.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression: expr, returnByValue: true, awaitPromise: true}}));
});
client.on('message', function(data) {
  var msg = JSON.parse(data.toString());
  console.log(msg.result?.result?.value);
  client.close();
});
client.on('error', function(e) { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(function() { console.log('Timeout'); process.exit(1); }, 10000);
