const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Check the actual replacement string stored in regex engine
  results.push('--- Regex Replacement String ---');
  var m = await import('/scripts/extensions/regex/engine.js');
  var scripts = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
  var bar = scripts.find(function(s){ return s.scriptName === '[界面]状态栏'; });
  if (bar) {
    results.push('replaceString: ' + JSON.stringify(bar.replaceString));
    results.push('findRegex: ' + bar.findRegex);
  }

  // 2. Check the raw message text (before markdown) for the placeholder
  results.push('--- Chat Messages ---');
  if (typeof chat !== 'undefined') {
    var lastMsg = chat[chat.length - 1];
    var secondLast = chat[chat.length - 2];
    if (lastMsg) {
      var text = lastMsg.mes || '';
      var searchText = text.length > 200 ? text.substring(text.length - 200) : text;
      results.push('last msg [' + (chat.length-1) + '] role=' + lastMsg.name + ' len=' + text.length);
      results.push('last msg has StatusPlaceHolderImpl: ' + text.includes('StatusPlaceHolderImpl'));
      results.push('last msg has 合欢界面: ' + text.includes('合欢界面'));
      results.push('last msg tail: ' + JSON.stringify(searchText));
    }
    if (secondLast) {
      var text2 = secondLast.mes || '';
      results.push('2nd last msg [' + (chat.length-2) + '] role=' + secondLast.name + ' len=' + text2.length);
      results.push('2nd last has StatusPlaceHolderImpl: ' + text2.includes('StatusPlaceHolderImpl'));
      results.push('2nd last has 合欢界面: ' + text2.includes('合欢界面'));
    }
  } else {
    results.push('chat is undefined');
  }

  // 3. Check DOMPurify config
  results.push('--- DOMPurify ---');
  try {
    if (typeof DOMPurify !== 'undefined') {
      results.push('DOMPurify available');
      // Test if our iframe HTML would be sanitized
      var testHTML = '<iframe src="http://localhost:5500/dist/%E9%9B%8C%E5%A0%95%E5%90%88%E6%AC%A2%E5%AE%97/index.html" style="width:100%;height:400px;border:none;"></iframe>';
      var sanitized = DOMPurify.sanitize(testHTML);
      results.push('Original: ' + testHTML);
      results.push('Sanitized: ' + sanitized);
      results.push('Iframe preserved: ' + sanitized.includes('iframe'));
      results.push('Src preserved: ' + sanitized.includes('localhost'));
    } else {
      results.push('DOMPurify not found on window');
    }
  } catch(e) { results.push('DOMPurify error: ' + e.message); }

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
