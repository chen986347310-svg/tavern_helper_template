const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

// Inject a persistent script into the page that appends the status bar
const script = `(async()=>{
  var statusBarHTML = '<div style="padding:12px;margin:8px 0;border:1px solid rgba(212,160,23,0.3);border-radius:6px;background:linear-gradient(180deg,rgba(42,31,20,0.9),rgba(30,21,13,0.95));color:#d4a017;text-align:center;font-family:serif;">' +
    '<div style="font-size:14px;letter-spacing:0.1em;">合欢宗·宗门面板</div>' +
    '<div style="font-size:12px;color:rgba(180,150,100,0.6);margin-top:6px;">识灵幕已激活</div>' +
    '</div>';

  function appendStatusBar(mesElement) {
    if (!mesElement || mesElement.querySelector('.th-status-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'th-status-bar';
    bar.innerHTML = statusBarHTML;
    mesElement.appendChild(bar);
  }

  // Process existing messages
  document.querySelectorAll('.mes:not(.user)').forEach(appendStatusBar);

  // Monitor for new messages
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.nodeType === 1 && n.classList && n.classList.contains('mes') && !n.classList.contains('user')) {
          appendStatusBar(n);
        }
      });
    });
  });

  var chatContainer = document.getElementById('chat') || document.querySelector('.chat-container') || document.querySelector('.messages');
  if (chatContainer) {
    observer.observe(chatContainer, { childList: true, subtree: true });
    return 'OK: observer active on chat container, processed existing messages';
  }

  // Fallback: observe the entire main area
  observer.observe(document.body, { childList: true, subtree: true });
  return 'OK: observer active on body fallback';
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
