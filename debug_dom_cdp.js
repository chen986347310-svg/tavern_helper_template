const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // Check the actual HTML of the message that has the iframe
  var cards = document.querySelectorAll('.mes');
  for (var i = 0; i < cards.length; i++) {
    var iframe = cards[i].querySelector('iframe');
    if (iframe) {
      results.push('iframe found in card ' + i);
      results.push('outerHTML: ' + iframe.outerHTML);
      results.push('parent HTML snippet: ' + iframe.parentElement.innerHTML.substring(0, 500));
      // Check if there's text content before the iframe
      results.push('parent text before: ' + JSON.stringify(iframe.parentElement.textContent.substring(0, 200)));
      break;
    }
  }

  // Also check: does the StatusPlaceHolderImpl text appear anywhere in the raw text?
  // Search entire document body
  var bodyText = document.body.innerText;
  results.push('Body contains StatusPlaceHolderImpl: ' + bodyText.includes('StatusPlaceHolderImpl'));
  results.push('Body contains 合欢界面: ' + bodyText.includes('合欢界面'));
  results.push('Body contains iframe: ' + bodyText.includes('iframe'));

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
