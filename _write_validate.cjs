const fs = require("fs");
const p = "D:/ai/tavern_helper_template-main/tavern_helper_template-main/src/雌堕合欢宗/脚本/后端校验/validate.ts";
const content = fs.readFileSync(p, "utf8");
console.log("Current lines:", content.split("\n").length);
console.log("Ends with:", content.slice(-50));

