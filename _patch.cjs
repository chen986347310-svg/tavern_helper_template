const fs = require('fs');
const p = 'D:/ai/tavern_helper_template-main/tavern_helper_template-main/dist/backend_validate.js';
let c = fs.readFileSync(p, 'utf8');

// Replace imports with window globals
c = c.replace(/^import\b\s+\w+\bs\from\\s*['"][^'\"][^;\l/gm, 'const _2 = window._;');

// Remove remaining import lines
c = c.replace(/^import\b.*;\$n/gm, '');

fs.writeFileSync(p, c, 'utf8');
console.log('Patched imports');