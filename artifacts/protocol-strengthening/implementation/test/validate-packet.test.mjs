#!/usr/bin/env node
// Test suite for bin/validate-packet.py.
//
// Runs the validator against synthetic packets that exercise each branch.
// Pass = all branches covered + Python validator exits with the right code.
//
// This file is the executable form of the "packet-validation-test-suite"
// roadmap item. It must grow in step with new validator checks; today it
// covers the branches that exist as of 2026-06.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..');
const VALIDATOR = path.join(ROOT, 'bin', 'validate-packet.py');
const TMP_ROOT = fs.mkdtempSync(path.join('/tmp', 'mcf-test-validate-'));

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}\n`);
}

function writePacket(name, files) {
  const dir = path.join(TMP_ROOT, name);
  fs.mkdirSync(dir, { recursive: true });
  for (const [rel, content] of Object.entries(files)) {
    const target = path.join(dir, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return dir;
}

function runValidator(packetDir) {
  return spawnSync('python3', [VALIDATOR, packetDir], { encoding: 'utf8' });
}

const manifest = JSON.stringify({
  task_id: 'sample',
  title: 'Sample',
  problem: 'problem.md',
  assumptions: 'assumptions.yaml',
  artifacts: {
    problem: 'problem.md',
    assumptions: 'assumptions.yaml',
    spec: 'Model.tla',
    verification: 'verification.json',
    refinement: 'refinement.md',
    traceability: 'traceability.json',
    implementation: 'implementation',
  },
}, null, 2);

const minimalPacket = {
  'packet.json': manifest,
  'problem.md': '# problem\n',
  'assumptions.yaml': 'task_id: sample\nassumptions: []\n',
  'Model.tla': '---- MODULE Sample ----\n====\n',
  'Model.cfg': 'INIT Init\n',
  'verification.json': JSON.stringify({ verdict: 'VERIFIED', task_id: 'sample' }),
  'refinement.md': '# refinement\n',
  'traceability.json': JSON.stringify({
    task_id: 'sample',
    mappings: [
      { source: 'Init', kind: 'action', target: 'implementation/init.ts' },
    ],
  }),
  'implementation/.keep': '',
};

// ── 1. Valid packet ─────────────────────────────────────────────────
{
  const dir = writePacket('valid', minimalPacket);
  const r = runValidator(dir);
  check('valid.packet', r.status === 0 && r.stdout.includes('Packet valid'), `exit=${r.status} stdout=${r.stdout.slice(0, 80)}`);
}

// ── 2. Missing packet.json ──────────────────────────────────────────
{
  const dir = path.join(TMP_ROOT, 'no-manifest');
  fs.mkdirSync(dir, { recursive: true });
  const r = runValidator(dir);
  check('missing_manifest', r.status === 2 && (r.stdout + r.stderr).includes('Missing manifest'), `exit=${r.status}`);
}

// ── 3. Missing required file ────────────────────────────────────────
{
  const files = { ...minimalPacket };
  delete files['refinement.md'];
  const dir = writePacket('missing-refinement', files);
  const r = runValidator(dir);
  check('missing_required_file', r.status === 2 && r.stdout.includes('refinement'), `exit=${r.status}`);
}

// ── 4. Traceability task_id mismatch ────────────────────────────────
{
  const files = {
    ...minimalPacket,
    'traceability.json': JSON.stringify({ task_id: 'wrong', mappings: [] }),
  };
  const dir = writePacket('traceability-mismatch', files);
  const r = runValidator(dir);
  check('traceability_task_id_mismatch', r.status === 4 && r.stdout.includes('task_id'), `exit=${r.status}`);
}

// ── 5. Invalid verdict ─────────────────────────────────────────────
{
  const files = {
    ...minimalPacket,
    'verification.json': JSON.stringify({ verdict: 'PROBABLY_OK', task_id: 'sample' }),
  };
  const dir = writePacket('bad-verdict', files);
  const r = runValidator(dir);
  check('invalid_verdict', r.status === 5 && r.stdout.includes('invalid verdict'), `exit=${r.status}`);
}

// ── 6. UNVERIFIABLE subtype verdict (must be accepted after 1.2) ───
{
  // 1.2 broadened the verdict enum to include the three UNVERIFIABLE:*
  // subtypes. The packet must also carry a populated human_review block
  // or the validator returns 7.
  const files = {
    ...minimalPacket,
    'verification.json': JSON.stringify({
      verdict: 'UNVERIFIABLE:OUT_OF_SCOPE',
      task_id: 'sample',
      human_review: {
        by: 'project lead',
        process: 'read artifact, sign off',
        trigger: 'before-merge',
      },
    }),
  };
  const dir = writePacket('unverifiable-subtype', files);
  const r = runValidator(dir);
  check(
    'unverifiable_subtype_accepted',
    r.status === 0,
    `exit=${r.status} — Detail: ${r.stdout.slice(0, 120)}`
  );
}

// ── 6b. UNVERIFIABLE without human_review → exit 7 ────────────────
{
  const files = {
    ...minimalPacket,
    'verification.json': JSON.stringify({ verdict: 'UNVERIFIABLE:OUT_OF_SCOPE', task_id: 'sample' }),
  };
  const dir = writePacket('unverifiable-no-review', files);
  const r = runValidator(dir);
  check(
    'unverifiable_requires_human_review',
    r.status === 7 && r.stdout.includes('human_review'),
    `exit=${r.status}`
  );
}

// ── 7. Traceability gap (TODO target) ──────────────────────────────
{
  const files = {
    ...minimalPacket,
    'traceability.json': JSON.stringify({
      task_id: 'sample',
      mappings: [{ source: 'X', kind: 'action', target: 'TODO' }],
    }),
  };
  const dir = writePacket('trace-todo', files);
  const r = runValidator(dir);
  check('traceability_todo_flagged', r.status === 6 && r.stdout.includes('Traceability gaps'), `exit=${r.status}`);
}

// ── 8. Wrong argv count ─────────────────────────────────────────────
{
  const r = spawnSync('python3', [VALIDATOR], { encoding: 'utf8' });
  check('wrong_argv', r.status === 1 && r.stderr.includes('Usage'), `exit=${r.status}`);
}

// ── Cleanup ─────────────────────────────────────────────────────────
fs.rmSync(TMP_ROOT, { recursive: true, force: true });

const failed = results.filter(r => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} check(s) failed:`);
  for (const f of failed) console.error(`  - ${f.name}: ${f.detail}`);
  process.exit(1);
}
console.log(`\nAll ${results.length} validator checks passed.`);
process.exit(0);