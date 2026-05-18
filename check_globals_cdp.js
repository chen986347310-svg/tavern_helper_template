const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];
  var globals = ['eventOn', 'eventWait', 'waitGlobalInitialized', 'getCurrentMessageId', 'populateCharacterData', 'getAllVariables'];
  for (var i = 0; i < globals.length; i++) {
    try {
      var v = eval(globals[i]);
      results.push(globals[i] + ': ' + (typeof v));
    } catch(e) {
      results.push(globals[i] + ': ERROR ' + e.message);
    }
  }
  return results.join('\\n');
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
    console.log('Result:');
    console.log(msg.result?.result?.value);
    client.close();
    process.exit(0);
  }
});

client.on('error', (e) => { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 15000);
