const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  if (typeof Mvu === 'undefined') {
    await new Promise(function(resolve) {
      var check = setInterval(function() {
        if (typeof Mvu !== 'undefined') { clearInterval(check); resolve(); }
      }, 100);
    });
  }

  var firedCount = 0;

  eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, function(data) {
    firedCount++;
    console.log('[TH_DEBUG] BEFORE_MESSAGE_UPDATE fired #' + firedCount);
    console.log('[TH_DEBUG] message_content type:', typeof data.message_content);
    console.log('[TH_DEBUG] message_content (100):', JSON.stringify((data.message_content || '').slice(-100)));
    console.log('[TH_DEBUG] has keys:', Object.keys(data).join(','));
    // Try modifying
    if (data.message_content && typeof data.message_content === 'string') {
      data.message_content += '<!-- TH_STATUS_BAR_PLACEHOLDER -->';
      console.log('[TH_DEBUG] APPENDED placeholder');
    }
  });

  return 'Listener registered. Waiting for next message...';
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
    console.log('Listener is active. Send a message in the tavern and then run the check script.');
    client.close();
    process.exit(0);
  }
});

client.on('error', (e) => { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 15000);
