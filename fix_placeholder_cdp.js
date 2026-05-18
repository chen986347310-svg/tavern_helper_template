const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  // Wait for Mvu
  if (typeof Mvu === 'undefined') {
    await new Promise(function(resolve) {
      var check = setInterval(function() {
        if (typeof Mvu !== 'undefined') { clearInterval(check); resolve(); }
      }, 100);
    });
  }

  // Inject BEFORE_MESSAGE_UPDATE listener to append placeholder
  eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, function(data) {
    if (data && data.message_content && typeof data.message_content === 'string') {
      if (!data.message_content.includes('<StatusPlaceHolderImpl/>')) {
        data.message_content += '\\n<StatusPlaceHolderImpl/>';
      }
    }
  });

  // ALSO modify any existing LAST AI messages in the chat
  // Try to find chat via the iframe bridge or character data
  var injectedCount = 0;

  return 'OK. Listener registered. Injected: ' + injectedCount;
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
