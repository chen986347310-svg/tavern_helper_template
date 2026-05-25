#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const targetRepo = process.env.HEHUAN_CLOUD_REPO || 'chen986347310-svg/hehuan-cloud-assets';
const targetBranch = process.env.HEHUAN_CLOUD_BRANCH || 'main';
const token = process.env.HEHUAN_CLOUD_TOKEN || '';
const dryRun = process.env.HEHUAN_CLOUD_DRY_RUN === '1';

const allowList = [
  ['public/hehuan', 'public/hehuan'],
  ['src/雌堕合欢宗', 'src/雌堕合欢宗'],
];

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd || root,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
  });
}

function copyDirectory(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing publish source: ${path.relative(root, source)}`);
  }
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function listFiles(directory) {
  const files = [];
  const visit = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile()) {
        files.push(path.relative(directory, fullPath).replaceAll(path.sep, '/'));
      }
    }
  };
  visit(directory);
  return files;
}

const publishDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hehuan-cloud-assets-'));

try {
  for (const [source, target] of allowList) {
    copyDirectory(path.join(root, source), path.join(publishDir, target));
  }

  fs.writeFileSync(
    path.join(publishDir, 'README.md'),
    [
      '# hehuan-cloud-assets',
      '',
      'Public runtime assets for 雌堕合欢宗.',
      '',
      'This repository intentionally contains only `src/雌堕合欢宗` and `public/hehuan`.',
      '',
    ].join('\n'),
    'utf8',
  );

  const files = listFiles(publishDir);
  const forbidden = files.filter(file => file === 'docs' || file.startsWith('docs/'));
  if (forbidden.length > 0) {
    throw new Error(`Refusing to publish forbidden docs paths:\n${forbidden.join('\n')}`);
  }

  console.log(`publish_dir=${publishDir}`);
  console.log(`file_count=${files.length}`);
  console.log(`target=${targetRepo}#${targetBranch}`);

  if (dryRun) {
    console.log('dry_run=1, skipped git push');
    process.exit(0);
  }

  const remoteUrl = token
    ? `https://x-access-token:${token}@github.com/${targetRepo}.git`
    : `https://github.com/${targetRepo}.git`;

  run('git', ['init', '-b', targetBranch], { cwd: publishDir });
  run('git', ['config', 'user.name', 'github-actions[bot]'], { cwd: publishDir });
  run('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'], { cwd: publishDir });
  run('git', ['add', '--all'], { cwd: publishDir });
  run('git', ['commit', '-m', 'publish hehuan runtime assets'], { cwd: publishDir });
  run('git', ['remote', 'add', 'origin', remoteUrl], { cwd: publishDir });
  run('git', ['push', '--force', 'origin', `${targetBranch}:${targetBranch}`], {
    cwd: publishDir,
    stdio: 'inherit',
  });
} finally {
  if (process.env.HEHUAN_CLOUD_KEEP_TMP !== '1') {
    fs.rmSync(publishDir, { recursive: true, force: true });
  }
}
