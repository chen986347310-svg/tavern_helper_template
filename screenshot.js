const WebSocket = require("d:/ai/tavern_helper_template-main/tavern_helper_template-main/node_modules/.pnpm/ws@8.18.3/node_modules/ws");
const WS_URL = "ws://127.0.0.1:9222/devtools/page/9FBA8A5F73CCBF498CE951C321C11E66";
const client = new WebSocket(WS_URL);

client.on("open", () => {
  client.send(JSON.stringify({
    id: 1,
    method: "Page.captureScreenshot",
    params: { format: "png" }
  }));
});

client.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id === 1) {
    const base64 = msg.result?.data;
    if (base64) {
      require("fs").writeFileSync("d:/ai/tavern_helper_template-main/tavern_helper_template-main/screenshot.png", base64, "base64");
      console.log("Screenshot saved");
    }
    client.close();
    process.exit(0);
  }
});

client.on("error", (e) => { console.error("WS Error:", e.message); process.exit(1); });
setTimeout(() => { process.exit(1); }, 15000);
