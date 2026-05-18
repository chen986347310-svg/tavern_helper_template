const WebSocket = require("d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws");
const WS_URL = "ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66";
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];
  var m = await import("/scripts/extensions/regex/engine.js");
  var scoped = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
  scoped.forEach(function(s) {
    if (s.scriptName.indexOf("状态栏") !== -1) {
      results.push("=== " + s.scriptName + " ===");
      results.push("placement: " + JSON.stringify(s.placement));
      results.push("findRegex: " + s.findRegex);
      results.push("replaceString: " + s.replaceString);
    }
    if (s.scriptName.indexOf("占位符") !== -1) {
      results.push("=== " + s.scriptName + " ===");
      results.push("placement: " + JSON.stringify(s.placement));
      results.push("findRegex: " + s.findRegex);
    }
  });

  // Check chat variable
  results.push("=== Chat Data ===");
  if (window.chat) {
    results.push("chat type: " + typeof chat);
    if (Array.isArray(chat) || chat.length !== undefined) {
      results.push("chat length: " + chat.length);
      for (var i = 0; i < chat.length && i < 10; i++) {
        var msg = chat[i];
        var mes = (msg && msg.mes) ? msg.mes : "";
        if (mes.includes("StatusPlaceHolder") || mes.includes("iframe")) {
          results.push("chat[" + i + "] role=" + (msg && msg.name) + " hasPlace=" + mes.includes("StatusPlaceHolder") + " hasIframe=" + mes.includes("iframe") + " len=" + mes.length);
        }
      }
    } else {
      results.push("chat is: " + chat);
    }
  } else {
    results.push("window.chat is undefined");
  }

  // Check globalThis context
  results.push("=== DOM State ===");
  var allMes = document.querySelectorAll(".mes");
  results.push("total .mes: " + allMes.length);
  allMes.forEach(function(el, i) {
    var inner = el.innerHTML;
    if (inner.includes("iframe")) {
      results.push("mes[" + i + "]: has iframe");
    } else if (inner.includes("StatusPlaceHolder")) {
      results.push("mes[" + i + "]: has Placeholder (NOT replaced!)");
    } else {
      results.push("mes[" + i + "]: no iframe/placeholder");
    }
  });

  return results.join("\\n");
})()`;

client.on("open", () => {
  client.send(JSON.stringify({
    id: 1,
    method: "Runtime.evaluate",
    params: { expression: script, returnByValue: true, awaitPromise: true }
  }));
});

client.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id === 1) {
    console.log(msg.result?.result?.value);
    client.close();
    process.exit(0);
  }
});

client.on("error", (e) => { console.error("WS Error:", e.message); process.exit(1); });
setTimeout(() => { process.exit(1); }, 15000);
