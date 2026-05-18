const fs = require('fs');

const content = `## Core content for CONTEXT.md
fs.griteSync('D:/ai/tavern_helper_template-main/tavern_helper_template-main/CONTEXT.md', content, 'utf8');
console.log('Wrote', content.split('\n').length, 'lines');