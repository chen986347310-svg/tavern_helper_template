const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Check if MVU is initialized
  results.push('--- MVU Status ---');
  try {
    var mvuReady = typeof Mvu !== 'undefined';
    results.push('Mvu global: ' + mvuReady);
    if (mvuReady) {
      results.push('Mvu events: ' + Object.keys(Mvu.events).join(', '));
    }
  } catch(e) { results.push('Mvu error: ' + e.message); }

  // 2. Check chat messages for StatusPlaceHolderImpl
  results.push('--- Messages ---');
  try {
    // Try different ways to access messages
    if (typeof chat !== 'undefined') {
      results.push('chat.length=' + chat.length);
      // Check last 2 messages for the placeholder tag
      for (var i = Math.max(0, chat.length - 3); i < chat.length; i++) {
        var msg = chat[i];
        var text = msg.mes || '';
        var hasPlaceholder = text.includes('StatusPlaceHolderImpl');
        var hasHehuan = text.includes('合欢界面');
        results.push('msg[' + i + '] role=' + msg.name + ' hasPlaceholder=' + hasPlaceholder + ' hasHehuan=' + hasHehuan + ' len=' + text.length);
        if (hasPlaceholder || hasHehuan) {
          results.push('  context: ...' + text.slice(-100));
        }
      }
    } else {
      results.push('chat not found on window');
    }
  } catch(e) { results.push('chat error: ' + e.message); }

  // 3. Check displayed messages in DOM
  results.push('--- DOM ---');
  try {
    var mesCards = document.querySelectorAll('.mes');
    results.push('mes cards: ' + mesCards.length);
    var lastCard = mesCards[mesCards.length - 1];
    if (lastCard) {
      var html = lastCard.innerHTML;
      results.push('last mes has Placeholder: ' + html.includes('StatusPlaceHolderImpl'));
      results.push('last mes has iframe: ' + html.includes('iframe'));
      results.push('last mes has hehuan-interface: ' + html.includes('hehuan-interface'));
    }
  } catch(e) { results.push('DOM error: ' + e.message); }

  // 4. Check regex engine state
  results.push('--- Regex Engine ---');
  try {
    var m = await import('/scripts/extensions/regex/engine.js');
    var scoped = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
    results.push('scoped count: ' + scoped.length);
    scoped.forEach(function(s) {
      results.push('  ' + s.scriptName + ' enabled=' + !s.disabled + ' mdOnly=' + s.markdownOnly + ' promptOnly=' + s.promptOnly);
    });
  } catch(e) { results.push('regex error: ' + e.message); }

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
