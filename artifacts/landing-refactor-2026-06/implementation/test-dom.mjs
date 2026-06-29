#!/usr/bin/env node
// Runs the page in headless Chromium and asserts DOM-level invariants.
// Uses a tiny static file server that strips the production prefix
// /math-coding/ so localhost serves the right assets.

import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');
const LANDING_DIR = path.join(ROOT, 'Landing');
const IMG_DIR = path.join(ROOT, 'landing', 'img');

function mime(p) {
  const ext = path.extname(p).toLowerCase();
  return { '.html': 'text/html', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.css': 'text/css' }[ext] || 'application/octet-stream';
}

function firstExisting(...candidates) {
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return null;
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  if (url.startsWith('/math-coding/')) url = '/' + url.slice('/math-coding/'.length);
  let file = null;
  if (url === '/' || url === '/index.html') file = path.join(LANDING_DIR, 'index.html');
  else if (url.startsWith('/img/')) file = firstExisting(path.join(IMG_DIR, url.slice(5)), path.join(LANDING_DIR, url));
  else file = firstExisting(path.join(LANDING_DIR, url), path.join(ROOT, url.slice(1)));

  if (!file || !fs.existsSync(file)) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'content-type': mime(file) });
  fs.createReadStream(file).pipe(res);
});

const port = await new Promise((resolve, reject) => {
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => resolve(server.address().port));
});
const URL_BASE = `http://127.0.0.1:${port}`;

const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

const browser = await chromium.launch({
  executablePath: '/run/current-system/sw/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

try {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  await page.goto(URL_BASE + '/index.html');
  await page.waitForFunction(() => document.querySelectorAll('.lang-switch a').length >= 3, null, { timeout: 10000 });

  // Switch to RU via the lang-switch anchor.
  await page.locator('.lang-switch a[data-switch="ru"]').click({ force: true });
  await page.waitForTimeout(150);

  // -- HeroBadgeFitsText --
  {
    const badge = page.locator('.hero-badge[data-lang="ru"]').first();
    const box = await badge.boundingBox();
    const innerWidth = await badge.evaluate(el => {
      const r = document.createRange();
      r.selectNodeContents(el);
      return r.getBoundingClientRect().width;
    });
    const oversize = (box ? box.width : 0) - innerWidth;
    check('HeroBadgeFitsText', oversize <= 30, `oversize=${oversize.toFixed(1)}px (inner=${innerWidth.toFixed(0)}, box=${(box ? box.width : 0).toFixed(0)})`);
  }

  // -- StageHasAllFields --
  {
    const stageCount = await page.locator('.stage-card').count();
    check('StageHasAllFields.count', stageCount === 7, `got ${stageCount} stage cards`);
    if (stageCount === 7) {
      let bad = 0;
      for (let i = 0; i < 7; i++) {
        const c = page.locator('.stage-card').nth(i);
        const ok = await c.evaluate(el => {
          const has = sel => !!el.querySelector(sel);
          return has('.stage-num')
            && has('.stage-icon')
            && has('.stage-name[data-lang="en"]')
            && has('.stage-name[data-lang="ru"]')
            && has('.stage-name[data-lang="zh"]')
            && has('.stage-file')
            && has('.stage-detail');
        });
        if (!ok) bad++;
      }
      check('StageHasAllFields.fields', bad === 0, `${bad} stages missing fields`);
    }
  }

  // -- PrincipleHasAllFields --
  {
    const principleCount = await page.locator('.principle').count();
    check('PrincipleHasAllFields.count', principleCount >= 1, `got ${principleCount}`);
    if (principleCount >= 1) {
      let bad = 0;
      for (let i = 0; i < principleCount; i++) {
        const p = page.locator('.principle').nth(i);
        const ok = await p.evaluate(el => {
          const has = sel => !!el.querySelector(sel);
          return has('img')
            && has('h3[data-lang="en"]')
            && has('h3[data-lang="ru"]')
            && has('h3[data-lang="zh"]')
            && has('p[data-lang="en"]')
            && has('p[data-lang="ru"]')
            && has('p[data-lang="zh"]');
        });
        if (!ok) bad++;
      }
      check('PrincipleHasAllFields.fields', bad === 0, `${bad} principles missing fields`);
    }
  }

  // -- NoVerifiedEvidenceSection --
  {
    const evidenceCount = await page.locator('.proof-grid, .proof-card').count();
    check('NoVerifiedEvidenceSection', evidenceCount === 0, `found ${evidenceCount} elements`);
  }

  // -- HoverRevealsDetail --
  {
    const stageCount = await page.locator('.stage-card').count();
    if (stageCount === 7) {
      let hoverFail = 0;
      for (let i = 0; i < 7; i++) {
        const c = page.locator('.stage-card').nth(i);
        await c.hover({ force: true });
        await page.waitForTimeout(60);
        // Each card has three .stage-detail blocks (en/ru/zh). The active
        // one is the one with display != none. We check whether ANY detail
        // block in the opened card is visible — that's the contract.
        const visible = await c.evaluate(el => {
          const details = el.querySelectorAll('.stage-detail');
          for (const d of details) {
            const s = getComputedStyle(d);
            if (s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0) {
              return true;
            }
          }
          return false;
        });
        if (!visible) hoverFail++;
      }
      check('HoverRevealsDetail', hoverFail === 0, `${hoverFail} stages did not reveal detail on hover`);
    }
  }

  // -- Locale switch updates the active language --
  await page.locator('.lang-switch a[data-switch="zh"]').click({ force: true });
  await page.waitForTimeout(60);
  const zhActive = await page.locator('.lang-switch a[data-switch="zh"]').evaluate(el => el.classList.contains('active'));
  check('LocaleSwitch.zh', !!zhActive);

  await page.locator('.lang-switch a[data-switch="en"]').click({ force: true });
  await page.waitForTimeout(60);
  const enActive = await page.locator('.lang-switch a[data-switch="en"]').evaluate(el => el.classList.contains('active'));
  check('LocaleSwitch.en', !!enActive);

  // -- No console errors (only JS errors count, not 404 — those are expected in dev) --
  const realErrors = consoleErrors.filter(e =>
    !e.includes('Failed to load resource') &&
    !e.includes('404') &&
    !e.includes('favicon')
  );
  check('NoJSConsoleErrors', realErrors.length === 0, realErrors.length ? realErrors.join('; ').slice(0, 200) : '');

} finally {
  await browser.close();
  server.close();
}

const failed = results.filter(r => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} DOM checks passed.`);
process.exit(0);