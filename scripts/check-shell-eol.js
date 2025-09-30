#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { readFileSync } = require('fs');

function listShellScripts() {
  const output = execSync("git ls-files '*.sh'", { encoding: 'utf8' });
  return output
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean);
}

function hasCrLf(buffer) {
  return buffer.includes(Buffer.from('\r\n'));
}

const shellScripts = listShellScripts();
const violations = shellScripts.filter((file) => hasCrLf(readFileSync(file)));

if (violations.length > 0) {
  console.error('Shell scripts must use LF line endings. The following files contain CRLF:');
  violations.forEach((file) => console.error(`  - ${file}`));
  process.exitCode = 1;
} else {
  console.log('All shell scripts use LF line endings.');
}
