const WebSocket = require("d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws");
const WS_URL = "ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66";
const client = new WebSocket(WS_URL);

const script = `(async()=>{
  var results = [];
  
  // Check iframes in DOM - get first iframe details
  var iframes = document.querySelectorAll(".mes iframe");
  results.push("Found iframes: " + iframes.length);
  
  if (iframes.length > 0) {
    var iframe = iframes[0];
    results.push("First iframe src: " + iframe.src);
    results.push("First iframe width: " + iframe.width);
    results.push("First iframe height: " + iframe.height);
    results.push("First iframe displayed: " + (iframe.offsetHeight > 0));
    results.push("First iframe rect: " + JSON.stringify(iframe.getBoundingClientRect()));
    
    // Check all iframes visibility
    var totalInvisible = 0;
    iframes.forEach(function(f, i) {
      var rect = f.getBoundingClientRect();
      var visible = rect.height > 10 && rect.width > 10;
      if (!visible) totalInvisible++;
      if (i < 3) results.push("iframe[" + i + "] h=" + rect.height + " w=" + rect.width + " visible=" + visible);
    });
    results.push("Total invisible iframes: " + totalInvisible + "/" + iframes.length);
  }

  // Check console errors (can't directly, but check if the page has error flag)
  results.push("--- Regex check ---");
  var m = await import("/scripts/extensions/regex/engine.js");
  var scoped = m.getScriptsByType(m.SCRIPT_TYPES.SCOPED);
  var statusBarScript = scoped.find(function(s) { return s.scriptName.indexOf("状态栏") !== -1; });
  if (statusBarScript) {
    results.push("Status bar placement: " + JSON.stringify(statusBarScript.placement));
    results.push("Status bar findRegex: " + statusBarScript.findRegex);
    results.push("Status bar enabled: " + !statusBarScript.disabled);
    
    // Test regex matching
    var testStr = "<StatusPlaceHolderImpl/>";
    try {
      var regexParts = statusBarScript.findRegex.match(/^\/(.+)\/([gimsu]*)$/);
      if (regexParts) {
        var rg = new RegExp(regexParts[1], regexParts[2]);
        var match = rg.test(testStr);
        results.push("Regex matches placeholder: " + match);
      } else {
        results.push("Could not parse regex");
      }
    } catch(e) {
      results.push("Regex error: " + e.message);
    }
    
    // Test the full replacement
    var replaced = m.getRegexedString(testStr, 1, {isMarkdown: false});
    results.push("replaced at placement 1: " + replaced.substring(0, 200));
    var replaced2 = m.getRegexedString(testStr, 2, {isMarkdown: false});
    results.push("replaced at placement 2: " + replaced2.substring(0, 200));
    
    // Test on actual markdown
    var replacedMd = m.getRegexedString(testStr, 1, {isMarkdown: true});
    results.push("replaced at placement 1 (md): " + replacedMd.substring(0, 200));
  }

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
