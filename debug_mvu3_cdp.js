const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Search for anything related to StatusPlaceHolder in the loaded modules
  results.push('--- Bundle Search ---');
  try {
    // Check if any script tag references StatusPlaceHolder
    var allScripts = document.querySelectorAll('script');
    for (var i = 0; i < allScripts.length; i++) {
      var src = allScripts[i].src || '';
      var content = allScripts[i].textContent || '';
      if (content.includes('StatusPlaceHolder') || content.includes('PlaceHolderImpl')) {
        results.push('Found in script[' + i + ']: ' + src.substring(0, 100));
      }
    }

    // Check all iframe contents
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      try {
        var fDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (fDoc) {
          var fScripts = fDoc.querySelectorAll('script');
          for (var j = 0; j < fScripts.length; j++) {
            var c = fScripts[j].textContent || '';
            if (c.includes('StatusPlaceHolder')) {
              results.push('Found in iframe[' + i + '] script[' + j + ']');
            }
          }
        }
      } catch(e) {}
    }

    results.push('Script search complete');
  } catch(e) { results.push('search error: ' + e.message); }

  // 2. Check the MagVarUpdate bundle for placeholders
  results.push('--- MagVarUpdate ---');
  try {
    // Try to find the bundle's exports
    var bundles = [];
    for (var k in window) {
      if (k.includes('Mvu') || k.includes('MVU') || k.includes('MagVar')) {
        bundles.push(k);
      }
    }
    results.push('Window globals matching: ' + (bundles.length ? bundles.join(', ') : 'none'));

    // Check if there's a pending status bar config
    if (typeof Mvu !== 'undefined') {
      // Check for methods that aren't in the standard list
      var allMethods = [];
      for (var k in Mvu) {
        allMethods.push(k);
      }
      results.push('All Mvu keys: ' + allMethods.join(', '));
    }
  } catch(e) { results.push('Mvu error: ' + e.message); }

  // 3. Let's test: manually write StatusPlaceHolderImpl to a chat message and see if regex fires
  // We can do this by inserting a test message or by checking what the regex runs on
  results.push('--- Manual Test ---');
  try {
    // Check the last AI message in the DOM
    var mesCards = document.querySelectorAll('.mes');
    results.push('mes cards: ' + mesCards.length);
    for (var i = 0; i < mesCards.length; i++) {
      var isUser = mesCards[i].classList.contains('user');
      var isLast = i === mesCards.length - 1;
      var hasIframe = !!mesCards[i].querySelector('iframe');
      var text = mesCards[i].textContent || '';
      results.push('card[' + i + '] user=' + isUser + ' last=' + isLast + ' iframe=' + hasIframe + ' text_100=' + JSON.stringify(text.slice(-100)));
    }
  } catch(e) { results.push('test error: ' + e.message); }

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
