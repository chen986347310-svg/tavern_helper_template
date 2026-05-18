const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Check iframe details in last mes
  results.push('--- Iframe in last mes ---');
  try {
    var cards = document.querySelectorAll('.mes');
    var lastCard = cards[cards.length - 1];
    var iframe = lastCard ? lastCard.querySelector('iframe') : null;
    if (iframe) {
      results.push('src: ' + iframe.src);
      results.push('width: ' + iframe.style.width);
      results.push('height: ' + iframe.style.height);
      results.push('display: ' + getComputedStyle(iframe).display);
      results.push('visibility: ' + getComputedStyle(iframe).visibility);
    } else {
      results.push('No iframe found in last mes');
      // Check other cards
      for (var i = 0; i < cards.length; i++) {
        var f = cards[i].querySelector('iframe');
        if (f) results.push('iframe found in card ' + i + ': ' + f.src);
      }
      if (!results.some(r => r.includes('iframe found'))) {
        results.push('No iframe in any card');
        // Show last card HTML snippet
        results.push('Last card HTML (500 chars): ' + (lastCard ? lastCard.innerHTML.substring(0, 500) : 'no card'));
      }
    }
  } catch(e) { results.push('iframe error: ' + e.message); }

  // 2. Check if the iframe loaded successfully
  if (iframe) {
    try {
      var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      results.push('iframe doc ready: ' + (iframeDoc ? 'yes' : 'no'));
      if (iframeDoc) {
        var bodyHTML = iframeDoc.body ? iframeDoc.body.innerHTML.substring(0, 300) : 'no body';
        results.push('iframe body: ' + bodyHTML);
      }
    } catch(e) {
      results.push('iframe cross-origin: ' + e.message);
    }
  }

  // 3. Try to find chat through other means
  results.push('--- Chat Data ---');
  try {
    // Check tavern globals
    var tavernGlobals = ['this_chid', 'characters', 'chat', 'messageFormatting', 'main_api', 'saveChat'];
    for (var g of tavernGlobals) {
      try {
        results.push(g + ': ' + (eval(g) !== undefined ? 'defined' : 'undefined'));
      } catch(e) {
        results.push(g + ': access error');
      }
    }
  } catch(e) { results.push('globals error: ' + e.message); }

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
