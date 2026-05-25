#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const assets = [
  ['src/雌堕合欢宗/入口主页/entry-home.html', 'public/hehuan/entry-home.html'],
  ['dist/雌堕合欢宗/index.html', 'public/hehuan/status/index.html'],
  ['dist/var_structure.js', 'public/hehuan/scripts/var_structure.js'],
  ['dist/backend_validate.js', 'public/hehuan/scripts/backend_validate.js'],
];

for (const [source, target] of assets) {
  const sourcePath = path.join(root, source);
  const targetPath = path.join(root, target);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source asset: ${source}`);
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

const mvuLoaderPath = path.join(root, 'public/hehuan/scripts/mvu.js');
if (!fs.existsSync(mvuLoaderPath)) {
  fs.writeFileSync(
    mvuLoaderPath,
    "import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js';\n",
  );
}

console.log('hehuan cloud assets synced');
