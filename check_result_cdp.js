const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // Check if status bars were added
  var bars = document.querySelectorAll('.th-statusbar');
  results.push('Status bars found: ' + bars.length);

  // Check the last message card details
  var cards = document.querySelectorAll('.mes');
  results.push('Total mes cards: ' + cards.length);
  for (var i = 0; i < cards.length; i++) {
    var hasBar = !!cards[i].querySelector('.th-statusbar');
    var classes = cards[i].className;
    var textPreview = (cards[i].textContent || '').slice(-50);
    results.push('card[' + i + '] class=' + classes + ' hasBar=' + hasBar + ' text=' + JSON.stringify(textPreview));
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
