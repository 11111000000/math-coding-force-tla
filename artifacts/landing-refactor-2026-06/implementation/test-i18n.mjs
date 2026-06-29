#!/usr/bin/env node
// Test 1: i18n anglicism check.
// Walks the Landing/index.html AST and asserts that no banned anglicism
// appears inside any data-lang="ru" block. This is the runtime check
// for the L1 invariant NoAnglicismInRu declared in Model.tla.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');
const LANDING = path.join(ROOT, 'Landing', 'index.html');

const html = fs.readFileSync(LANDING, 'utf8');

// Anglicisms banned inside data-lang="ru" content, with rationale.
// Each is either a precise English term that has a Russian equivalent
// in this methodology context, or a misspelled/non-standard Russian word.
const BANNED = [
  { token: 'Evidence',       reason: 'Use "Свидетельства" or "Доказательства"' },
  { token: 'Verified',       reason: 'Use "верифицирован/подтверждён" by context' },
  { token: 'пайплайн',       reason: 'Use "конвейер" or "цикл"' },
  { token: 'Рефинемент',     reason: 'Spelling: "Уточнение" / refinement → уточнение/конкретизация' },
  { token: 'Карта трассировки', reason: 'Use "карта трассируемости"' },
];

function extractLangBlocks(html, lang) {
  // Find every element with data-lang="lang" and return its inner text.
  // We use a simple regex because the file uses inline elements too.
  const re = new RegExp(
    `<([a-z0-9]+)[^>]*data-lang="${lang}"[^>]*>([\\s\\S]*?)</\\1>`,
    'gi'
  );
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ tag: m[1], inner: m[2] });
  }
  return out;
}

const failures = [];
for (const { token, reason } of BANNED) {
  const blocks = extractLangBlocks(html, 'ru');
  for (const { inner } of blocks) {
    if (inner.includes(token)) {
      failures.push({ token, reason, snippet: inner.trim().slice(0, 120) });
    }
  }
}

if (failures.length > 0) {
  console.error('i18n FAIL: banned anglicism(s) found in Russian locale:');
  for (const f of failures) {
    console.error(`  - "${f.token}": ${f.reason}`);
    console.error(`    in: ${f.snippet}`);
  }
  process.exit(1);
}

console.log('i18n OK: no banned anglicisms in data-lang="ru" blocks.');
process.exit(0);