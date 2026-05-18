const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];

  // 1. Check MVU state
  results.push('--- MVU State ---');
  try {
    if (typeof Mvu !== 'undefined') {
      results.push('Mvu version: ' + (Mvu.version || 'unknown'));
      results.push('Mvu methods: ' + Object.getOwnPropertyNames(Mvu).filter(function(k){return typeof Mvu[k]==='function';}).join(', '));
      // Check if there's a setting for auto-append
      if (Mvu.config) results.push('Mvu.config: ' + JSON.stringify(Mvu.config));
    } else {
      results.push('Mvu NOT defined');
    }
  } catch(e) { results.push('Mvu error: ' + e.message); }

  // 2. Check tavern_helper extension data
  results.push('--- Character Extensions ---');
  try {
    // Try to get character data via the regex engine's internal reference
    var m = await import('/scripts/extensions/regex/engine.js');
    var scoped = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
    results.push('Scoped regex count: ' + scoped.length);

    // Check if the character card has tavern_helper config
    // Try to find it in the DOM or via SillyTavern globals
    var tavernHelper = document.querySelector('[data-tavern-helper]');
    results.push('TH DOM element: ' + (tavernHelper ? 'found' : 'not found'));
  } catch(e) { results.push('regex error: ' + e.message); }

  // 3. Check for any console errors related to MVU or scripts
  results.push('--- Console Errors ---');
  try {
    // Use performance API or just list recent errors
    if (window.__TAVERN_HELPER) {
      results.push('tavern_helper global exists');
      results.push('scripts: ' + JSON.stringify(window.__TAVERN_HELPER.scripts || {}));
    } else {
      results.push('tavern_helper NOT on window');
    }
  } catch(e) { results.push('TH error: ' + e.message); }

  // 4. Check if the scripts are loaded in the iframe
  results.push('--- Script Loading ---');
  try {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      var f = iframes[i];
      if (f.name && f.name.startsWith('TH-message--')) {
        results.push('TH iframe found: ' + f.name);
        try {
          var fDoc = f.contentDocument || f.contentWindow.document;
          if (fDoc) {
            var scripts = fDoc.querySelectorAll('script[type="module"]');
            results.push('  module scripts: ' + scripts.length);
            for (var j = 0; j < scripts.length; j++) {
              var src = scripts[j].src || 'inline';
              results.push('    [' + j + '] ' + src.substring(0, 100));
            }
          }
        } catch(e) {
          results.push('  cross-origin: ' + e.message);
        }
      }
    }
  } catch(e) { results.push('iframe scripts error: ' + e.message); }

  // 5. Check the chat messages raw text
  results.push('--- Chat Raw Messages ---');
  try {
    if (typeof chat !== 'undefined') {
      for (var i = Math.max(0, chat.length - 3); i < chat.length; i++) {
        var msg = chat[i];
        var mes = msg.mes || '';
        results.push('msg[' + i + '] role=' + (msg.name || '?') + ' len=' + mes.length);
        results.push('  has StatusPlaceHolderImpl: ' + mes.includes('StatusPlaceHolderImpl'));
        results.push('  has 合欢界面: ' + mes.includes('合欢界面'));
        results.push('  last 100: ' + JSON.stringify(mes.slice(-100)));
      }
    } else {
      results.push('chat not found');
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
