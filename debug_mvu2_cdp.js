const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Check registerMvuSchema function source
  results.push('--- registerMvuSchema ---');
  try {
    // Check what registerMvuSchema does
    var fn = registerMvuSchema;
    if (fn) {
      results.push('function exists');
      // Try to find where StatusPlaceHolderImpl is generated
      var fnStr = fn.toString();
      results.push('Has StatusPlaceHolder: ' + fnStr.includes('StatusPlaceHolder'));
      results.push('Has PlaceHolderImpl: ' + fnStr.includes('PlaceHolderImpl'));
      // Show first 500 chars of function
      results.push('Source (500): ' + fnStr.substring(0, 500));
    } else {
      results.push('registerMvuSchema NOT FOUND');
    }
  } catch(e) { results.push('error: ' + e.message); }

  // 2. Check the Mvu global more thoroughly
  results.push('--- Mvu Global ---');
  try {
    if (typeof Mvu !== 'undefined') {
      for (var k in Mvu) {
        var v = Mvu[k];
        results.push(k + ': ' + (typeof v === 'function' ? 'fn' : typeof v));
      }
    } else {
      results.push('Mvu not found');
    }
  } catch(e) { results.push('error: ' + e.message); }

  // 3. Check if StatusPlaceHolderImpl was ever in any message
  results.push('--- Chat Search ---');
  try {
    if (typeof chat !== 'undefined') {
      results.push('chat length: ' + chat.length);
      for (var i = 0; i < chat.length; i++) {
        var mes = chat[i].mes || '';
        if (mes.includes('StatusPlaceHolderImpl') || mes.includes('合欢界面') || mes.includes('PlaceHolder')) {
          results.push('msg[' + i + '] has relevant tag');
          results.push('  last 200: ' + JSON.stringify(mes.slice(-200)));
        }
      }
    } else {
      // Try another way to access chat
      for (var k in window) {
        try {
          var v = window[k];
          if (v && typeof v === 'object' && v.length > 0 && v[0] && v[0].mes) {
            results.push('chat-like var found: window.' + k + ' (len=' + v.length + ')');
          }
        } catch(e) {}
      }
    }
  } catch(e) { results.push('chat error: ' + e.message); }

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
