const WebSocket = require('d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws');
const WS_URL = 'ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66';
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  try {
    // 1. Define the status bar HTML
    var BAR_HTML = '<div class="th-statusbar" style="padding:12px;margin:8px 0;border:1px solid rgba(212,160,23,0.3);border-radius:6px;background:linear-gradient(180deg,rgba(42,31,20,0.9),rgba(30,21,13,0.95));color:#d4a017;text-align:center;font-family:serif;">' +
      '<div style="font-size:14px;letter-spacing:0.1em;">合欢宗·宗门面板</div>' +
      '<div style="font-size:12px;color:rgba(180,150,100,0.6);margin-top:6px;">识灵幕已激活</div>' +
      '</div>';

    // 2. Process all existing non-user messages
    function addBarToCard(card) {
      if (!card || card.querySelector('.th-statusbar')) return;
      var container = card.querySelector('.mes_text') || card.querySelector('.message') || card;
      container.insertAdjacentHTML('beforeend', BAR_HTML);
    }

    document.querySelectorAll('.mes:not(.user)').forEach(addBarToCard);

    // 3. Watch for new messages
    var target = document.getElementById('chat') ||
      document.querySelector('.chat-container') ||
      document.querySelector('.messages') ||
      document.querySelector('#message-chat') ||
      document.body;

    var obs = new MutationObserver(function(muts) {
      for (var i = 0; i < muts.length; i++) {
        var nodes = muts[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType === 1) {
            if (n.classList && n.classList.contains('mes') && !n.classList.contains('user')) {
              addBarToCard(n);
            }
            n.querySelectorAll && n.querySelectorAll('.mes:not(.user)').forEach(addBarToCard);
          }
        }
      }
    });

    obs.observe(target, { childList: true, subtree: true });

    return 'OK: injected into ' + document.querySelectorAll('.mes:not(.user)').length + ' existing messages, observer active';
  } catch(e) { return 'Error: ' + e.message; }
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
    console.log('Result:', msg.result?.result?.value || JSON.stringify(msg.result));
    client.close();
    process.exit(0);
  }
});

client.on('error', (e) => { console.error('WS Error:', e.message); process.exit(1); });
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 15000);
