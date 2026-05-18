var WebSocket = require('./node_modules/.pnpm/ws@8.18.3/node_modules/ws');
var client = new WebSocket('ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66');
client.on('open', function() {
  var expr = "(async()=>{try{var m=await import('/scripts/extensions/regex/engine.js');var l=m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);var r=l.map(function(s){return{name:s.scriptName,find:s.findRegex,replace:(s.replaceString||'').substring(0,300),markdown:s.markdownOnly,prompt:s.promptOnly,placement:s.placement};});return JSON.stringify(r);}catch(e){return JSON.stringify({err:e.message});}})()";
  client.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression: expr, returnByValue: true, awaitPromise: true}}));
});
client.on('message', function(data) {
  var msg = JSON.parse(data.toString());
  console.log(msg.result?.result?.value);
  client.close();
});
client.on('error', function(e) { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(function() { console.log('Timeout'); process.exit(1); }, 10000);
