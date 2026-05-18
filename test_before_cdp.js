const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

// Register listener, store firing results in window for later retrieval
const script = `(async()=>{
  if (typeof Mvu === 'undefined') {
    await new Promise(function(resolve) {
      var check = setInterval(function() {
        if (typeof Mvu !== 'undefined') { clearInterval(check); resolve(); }
      }, 100);
    });
  }

  window.__th_debug = window.__th_debug || { count: 0, events: [] };

  eventOn(Mvu.events.BEFORE_MESSAGE_UPDATE, function(data) {
    window.__th_debug.count++;
    window.__th_debug.events.push({
      time: Date.now(),
      msgType: typeof data.message_content,
      msgLen: (data.message_content || '').length,
      hasPlaceholder: (data.message_content || '').includes('StatusPlaceHolderImpl'),
    });
    // Append placeholder
    if (data.message_content && typeof data.message_content === 'string' && !data.message_content.includes('StatusPlaceHolderImpl')) {
      data.message_content += '\\n<StatusPlaceHolderImpl/>';
    }
  });

  return 'Listener registered. Now send a message in tavern. After done, run the check script.';
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
