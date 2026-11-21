#!/usr/bin/env node
// Sha Design Studio brand book. One command builds both editions:
//
//   node brand-book/build.mjs            both PDFs + contact sheets
//   node brand-book/build.mjs --screens  also re-capture the website screenshots
//   node brand-book/build.mjs --only=essentials
//   node brand-book/build.mjs --a4       trial print at A4 landscape, into .build/ only
//
// Steps: copy assets in from the kit and the site (never moved, never edited),
// render each edition to one HTML file, print it with Chromium, write PDF
// metadata + bookmarks, run the page checks, rasterize and tile contact sheets.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument, PDFName, PDFHexString } from 'pdf-lib';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const KIT = path.join(REPO, 'Sha-Brand-Kit');
const SITE = path.join(REPO, 'src/assets');
const SRC = path.join(HERE, 'src');
const ASSETS = path.join(SRC, 'assets');
const BUILD = path.join(HERE, '.build');
const OUT = path.join(HERE, 'out');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const only = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1];

const log = (...m) => console.log(...m);
const sh = (cmd, a, opts = {}) => execFileSync(cmd, a, { stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString();
const mkdir = (d) => fs.mkdirSync(d, { recursive: true });
const newer = (src, dest) => !fs.existsSync(dest) || fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;

/* ------------------------------------------------------------------------ */
/* 1. Assets: copied in from the kit and the site                           */
/* ------------------------------------------------------------------------ */

const PRODUCTS = 'images/projects/products';
const OCEAN = 'images/case-studies/treasure-the-ocean-gymini';

// Photos are converted to JPEG so the PDF stores them as JPEG instead of raw
// pixels. `max` is the long edge in px; nothing is ever enlarged.
const PHOTOS = {
  'gymini-hero': [`${PRODUCTS}/2-in-1-musical-mobile-gymini/01-GYMINI-OCEAN-13.webp`, 910],
  'gymini-life': [`${PRODUCTS}/2-in-1-musical-mobile-gymini/02-GYMINIOCEAN7.webp`, 910],
  sorter: [`${PRODUCTS}/shape-sorter/16-Tiny-Rockers-Shape-Sorter-14.webp`, 910],
  'wooden-cover': [`${PRODUCTS}/wooden-collection-cover.webp`, 1800],
  'garden-cover': [`${PRODUCTS}/garden-collection-cover.webp`, 1800],
  party: [`${PRODUCTS}/born-to-party-collection-3-in-1-take-along-mobile/04-WEBSITEB2PTAM2048pix6.webp`, 1200],
  portrait: ['images/Shiran-bar.png', 1529],
  atwork: ['images/shiran-in-photoshooting.png', 1261],
};

// Prototype cut-outs keep their transparency, so they stay PNG.
const CUTOUTS = {
  'model-ringed-planet': `${OCEAN}/model-01-ringed-planet.webp`,
  'model-dotted-disc': `${OCEAN}/model-01-dotted-disc.webp`,
  'model-star-white-dome': `${OCEAN}/model-02-star-white-dome.webp`,
  'model-dome-character': `${OCEAN}/model-02-dome-character.webp`,
  'model-starfish-dotted': `${OCEAN}/model-03-starfish-dotted.webp`,
  'model-starfish-final': `${OCEAN}/model-03-starfish-final.webp`,
};

function copy(src, dest) {
  mkdir(path.dirname(dest));
  if (newer(src, dest)) fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir, filter = () => true) {
  for (const f of fs.readdirSync(srcDir)) {
    if (f.startsWith('.') || !filter(f)) continue;
    copy(path.join(srcDir, f), path.join(destDir, f));
  }
}

function syncAssets() {
  // Kit: same folder shape as the kit, so tokens.css finds its fonts unchanged.
  copy(path.join(KIT, 'tokens/tokens.css'), path.join(ASSETS, 'kit/tokens/tokens.css'));
  copyDir(path.join(KIT, 'fonts/web'), path.join(ASSETS, 'kit/fonts/web'));
  copy(path.join(KIT, 'fonts/OFL.txt'), path.join(ASSETS, 'kit/fonts/OFL.txt'));
  copyDir(path.join(KIT, 'logos/svg'), path.join(ASSETS, 'kit/logos/svg'), (f) => f.endsWith('.svg'));
  copyDir(path.join(KIT, 'motifs/svg'), path.join(ASSETS, 'kit/motifs/svg'), (f) => f.endsWith('.svg'));
  copyDir(path.join(KIT, 'icons'), path.join(ASSETS, 'kit/icons'));

  // Site: sketches, client logos, the live share image.
  for (const f of ['sketch-01-form-studies.svg', 'sketch-02-characters.svg', 'sketch-03-starfish.svg']) {
    copy(path.join(SITE, OCEAN, f), path.join(ASSETS, 'sketches', f));
  }
  copyDir(path.join(SITE, 'images/social-proof'), path.join(ASSETS, 'clients'), (f) => f.endsWith('.png'));
  copy(path.join(REPO, 'public/sha-og-image.jpg'), path.join(ASSETS, 'social/sha-og-image.jpg'));

  mkdir(path.join(ASSETS, 'photos'));
  for (const [key, [rel, max]] of Object.entries(PHOTOS)) {
    const src = path.join(SITE, rel);
    const dest = path.join(ASSETS, 'photos', `${key}.jpg`);
    if (!newer(src, dest)) continue;
    const dims = sh('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', src]);
    const long = Math.max(...[...dims.matchAll(/pixel(?:Width|Height): (\d+)/g)].map((m) => +m[1]));
    const a = ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88'];
    if (long > max) a.push('-Z', String(max));
    sh('sips', [...a, src, '--out', dest]);
  }
  for (const [key, rel] of Object.entries(CUTOUTS)) {
    const src = path.join(SITE, rel);
    const dest = path.join(ASSETS, 'photos', `${key}.png`);
    if (!newer(src, dest)) continue;
    const tmp = path.join(BUILD, `${key}.png`);
    sh('dwebp', [src, '-o', tmp]);
    sh('sips', ['-Z', '640', tmp, '--out', dest]);
  }
}

// Client logos are painted ink, the way the site paints them with a CSS mask.
// The site's PNGs are one flat orange on transparent, so each is recolored here
// through a canvas (source-in), using the ink value read from the kit tokens.
async function inkClientLogos(browser) {
  const dir = path.join(ASSETS, 'clients');
  const css = fs.readFileSync(path.join(ASSETS, 'kit/tokens/tokens.css'), 'utf8');
  const ink = css.match(/--ink:\s*(#[0-9a-fA-F]{6})/)[1];
  const page = await browser.newPage();
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.png') && !n.endsWith('-ink.png'))) {
    const dest = path.join(dir, f.replace('.png', '-ink.png'));
    if (!newer(path.join(dir, f), dest)) continue;
    const src = `data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}`;
    const out = await page.evaluate(async ({ src, ink }) => {
      const im = new Image();
      im.src = src;
      await im.decode();
      const c = document.createElement('canvas');
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      const g = c.getContext('2d');
      g.drawImage(im, 0, 0);
      g.globalCompositeOperation = 'source-in';
      g.fillStyle = ink;
      g.fillRect(0, 0, c.width, c.height);
      return c.toDataURL('image/png');
    }, { src, ink });
    fs.writeFileSync(dest, Buffer.from(out.split(',')[1], 'base64'));
  }
  await page.close();
}

/* ------------------------------------------------------------------------ */
/* 2. Website screenshots, from the local dev server                        */
/* ------------------------------------------------------------------------ */

const SCREENS = { home: '/', projects: '/projects', services: '/services', about: '/about', inquire: '/inquire' };
const PORT = 5179;

async function waitFor(url, ms = 60000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Dev server did not answer at ${url}`);
}

async function captureScreens(browser) {
  const dir = path.join(ASSETS, 'screens');
  mkdir(dir);
  const missing = Object.keys(SCREENS).some((k) => !fs.existsSync(path.join(dir, `${k}.jpg`)));
  if (!missing && !flag('screens')) return;
  log('  capturing website screenshots from the dev server…');
  const vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: REPO, stdio: 'ignore', detached: true,
  });
  try {
    await waitFor(`http://127.0.0.1:${PORT}/`);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    for (const [key, route] of Object.entries(SCREENS)) {
      await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(4500); // let the entrance motion come to rest
      await page.screenshot({ path: path.join(dir, `${key}.jpg`), type: 'jpeg', quality: 86 });
    }
    await ctx.close();
  } finally {
    try { process.kill(-vite.pid); } catch {}
  }
}

/* ------------------------------------------------------------------------ */
/* 3. Render: one HTML file per edition                                     */
/* ------------------------------------------------------------------------ */

// A4 landscape at 96 dpi. The same two numbers go in book.css to make it the default.
const A4 = { w: 1122.52, h: 793.7 };

function pageSize() {
  if (flag('a4')) return A4;
  const css = fs.readFileSync(path.join(SRC, 'book.css'), 'utf8');
  const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  const num = (name) => parseFloat(root.match(new RegExp(`--${name}:\\s*([\\d.]+)`))[1]);
  return { w: num('page-w-n'), h: num('page-h-n') };
}

async function renderEdition(key) {
  const { editions } = await import(path.join(SRC, 'editions.js'));
  const { renderPage } = await import(path.join(SRC, 'lib.js'));
  const ed = editions[key];
  const pages = ed.pages();
  const { w, h } = pageSize();
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${ed.title}</title>
<link rel="stylesheet" href="../src/assets/kit/tokens/tokens.css">
<link rel="stylesheet" href="../src/book.css">
<style>@page { size: ${w}px ${h}px; margin: 0 }${flag('a4') ? ` :root { --page-w-n: ${w}; --page-h-n: ${h}; }` : ''}</style>
</head>
<body class="ed-${key}">
${pages.map((p, i) => renderPage(p, { n: i + 1, total: pages.length, edition: ed.label })).join('\n')}
</body>
</html>`;
  mkdir(BUILD);
  const file = path.join(BUILD, `${key}.html`);
  fs.writeFileSync(file, html);
  return { ed, pages, file, w, h };
}

/* ------------------------------------------------------------------------ */
/* 4. Checks on the stylesheet and on the rendered pages                    */
/* ------------------------------------------------------------------------ */

function checkStylesheet() {
  const css = fs.readFileSync(path.join(SRC, 'book.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const problems = [];
  if (/#[0-9a-fA-F]{3,8}\b/.test(css)) problems.push('book.css contains a hardcoded hex color');
  if (/!important/.test(css)) problems.push('book.css uses !important');
  if (/box-shadow|drop-shadow|text-shadow/.test(css)) problems.push('book.css uses a shadow');
  if (/gradient\(/.test(css)) problems.push('book.css uses a gradient');
  return problems;
}

// The two kit WOFF2 files cover these ranges (from the kit's tokens.css).
const RANGES = `0000-00FF,0131,0152-0153,02BB-02BC,02C6,02DA,02DC,0304,0308,0329,2000-206F,20AC,2122,2191,2193,2212,2215,FEFF,FFFD,
0100-02BA,02BD-02C5,02C7-02CC,02CE-02D7,02DD-02FF,1D00-1DBF,1E00-1E9F,1EF2-1EFF,2020,20A0-20AB,20AD-20C0,2113,2C60-2C7F,A720-A7FF`
  .split(',').map((r) => r.trim().split('-').map((x) => parseInt(x, 16))).map(([a, b]) => [a, b ?? a]);
const covered = (cp) => RANGES.some(([a, b]) => cp >= a && cp <= b);

// Runs inside the page. Returns overflow, contrast and glyph findings.
function inPageChecks() {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p[3] === undefined ? 1 : p[3] };
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const bgOf = (el) => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (n.classList.contains('hl')) {
        const c = parse(getComputedStyle(n, '::before').backgroundColor);
        if (c && c.a > 0.5) return c.rgb;
      }
      if (n.dataset.on) {
        const hex = getComputedStyle(document.documentElement).getPropertyValue(`--${n.dataset.on}`).trim().replace('#', '');
        return [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
      }
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.5) return c.rgb;
    }
    return [248, 245, 236];
  };
  const out = { overflow: [], contrast: [], chars: new Set() };
  const zoom = parseFloat(getComputedStyle(document.querySelector('.page')).zoom) || 1;
  document.querySelectorAll('.page').forEach((pg, i) => {
    const panel = pg.querySelector('.panel');
    const pr = panel.getBoundingClientRect();
    panel.querySelectorAll('*').forEach((el) => {
      if (el.closest('[data-bleed]') || el.closest('svg')) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > pr.right + 1 || r.bottom > pr.bottom + 1 || r.left < pr.left - 1 || r.top < pr.top - 1) {
        out.overflow.push({ page: i + 1, el: el.className || el.tagName, text: (el.textContent || '').trim().slice(0, 40) });
      }
    });
    // text clipped inside its own box
    panel.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflow === 'hidden' && !el.closest('[data-bleed]') && !el.hasAttribute('data-clip')
        && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) && el !== panel) {
        out.overflow.push({ page: i + 1, el: `clipped: ${el.className}`, text: (el.textContent || '').trim().slice(0, 40) });
      }
    });
    if (panel.scrollHeight > panel.clientHeight + 2) out.overflow.push({ page: i + 1, el: 'panel content taller than panel', text: '' });
    const walker = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT);
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      const text = t.nodeValue.trim(); if (!text) continue;
      for (const ch of text) out.chars.add(ch.codePointAt(0));
      const el = t.parentElement;
      if (el.closest('[data-contrast-demo]') || el.closest('svg')) continue;
      const cs = getComputedStyle(el);
      const fg = parse(cs.color); if (!fg) continue;
      const size = parseFloat(cs.fontSize);
      const r = ratio(fg.rgb, bgOf(el));
      const need = size >= 24 ? 3 : 4.5;
      if (r < need - 0.005) out.contrast.push({ page: i + 1, text: text.slice(0, 40), ratio: +r.toFixed(2), size, need });
    }
  });
  return { overflow: out.overflow, contrast: out.contrast, chars: [...out.chars], zoom };
}

/* ------------------------------------------------------------------------ */
/* 5. PDF: print, then metadata and bookmarks                               */
/* ------------------------------------------------------------------------ */

async function finishPdf(file, { ed, pages }) {
  const doc = await PDFDocument.load(fs.readFileSync(file));
  doc.setTitle(ed.title);
  doc.setAuthor('Sha Design Studio');
  doc.setSubject(ed.subject);
  doc.setKeywords(['Sha Design Studio', 'Shiran Bar', 'brand guidelines', 'brand kit v3']);
  doc.setCreator('Sha Design Studio brand book (brand-book/build.mjs)');
  doc.setProducer('Chromium + pdf-lib');
  doc.setLanguage('en');

  // Bookmarks: one entry per section, its pages underneath.
  const ctx = doc.context;
  const pdfPages = doc.getPages();
  const groups = [];
  pages.forEach((p, i) => {
    const last = groups[groups.length - 1];
    if (last && last.title === p.section) last.kids.push({ title: p.name, i });
    else groups.push({ title: p.section, i, kids: [{ title: p.name, i }] });
  });
  const rootRef = ctx.nextRef();
  const dest = (i) => ctx.obj([pdfPages[i].ref, PDFName.of('Fit')]);
  const refs = groups.map(() => ctx.nextRef());
  groups.forEach((g, gi) => {
    const kidRefs = g.kids.map(() => ctx.nextRef());
    g.kids.forEach((k, ki) => {
      const d = ctx.obj({ Title: PDFHexString.fromText(k.title), Parent: refs[gi], Dest: dest(k.i) });
      if (ki > 0) d.set(PDFName.of('Prev'), kidRefs[ki - 1]);
      if (ki < kidRefs.length - 1) d.set(PDFName.of('Next'), kidRefs[ki + 1]);
      ctx.assign(kidRefs[ki], d);
    });
    const d = ctx.obj({
      Title: PDFHexString.fromText(g.title), Parent: rootRef, Dest: dest(g.i),
      First: kidRefs[0], Last: kidRefs[kidRefs.length - 1], Count: -kidRefs.length,
    });
    if (gi > 0) d.set(PDFName.of('Prev'), refs[gi - 1]);
    if (gi < refs.length - 1) d.set(PDFName.of('Next'), refs[gi + 1]);
    ctx.assign(refs[gi], d);
  });
  ctx.assign(rootRef, ctx.obj({ Type: 'Outlines', First: refs[0], Last: refs[refs.length - 1], Count: refs.length }));
  doc.catalog.set(PDFName.of('Outlines'), rootRef);
  doc.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
  fs.writeFileSync(file, await doc.save());
}

/* ------------------------------------------------------------------------ */
/* 6. Contact sheet                                                         */
/* ------------------------------------------------------------------------ */

async function contactSheet(browser, pdf, key, name) {
  const dir = path.join(BUILD, 'pages', key);
  fs.rmSync(dir, { recursive: true, force: true });
  mkdir(dir);
  sh('pdftoppm', ['-r', '60', '-png', pdf, path.join(dir, 'p')]);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
  const cols = files.length > 12 ? 6 : 4;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:24px;background:white;font:14px/1 sans-serif;color:gray}
    .g{display:grid;grid-template-columns:repeat(${cols},400px);gap:16px}
    figure{margin:0} img{display:block;width:400px;border:1px solid lightgray} figcaption{padding:6px 0 0}
  </style><div class="g">${files.map((f, i) => `<figure><img src="pages/${key}/${f}"><figcaption>${i + 1}</figcaption></figure>`).join('')}</div>`;
  const file = path.join(BUILD, `sheet-${key}.html`);
  fs.writeFileSync(file, html);
  const page = await browser.newPage({ viewport: { width: cols * 416 + 48, height: 800 } });
  await page.goto(`file://${file}`);
  await page.screenshot({ path: path.join(OUT, `${name}-contact-sheet.png`), fullPage: true });
  await page.close();
  return files.length;
}

/* ------------------------------------------------------------------------ */
/* Run                                                                      */
/* ------------------------------------------------------------------------ */

const NAMES = { full: 'Sha-Brand-Book-Full', essentials: 'Sha-Brand-Book-Essentials' };

async function main() {
  mkdir(BUILD); mkdir(OUT);
  log('1. assets');
  syncAssets();
  const cssProblems = checkStylesheet();
  const browser = await chromium.launch();
  await inkClientLogos(browser);
  await captureScreens(browser);

  let failed = cssProblems.length > 0;
  cssProblems.forEach((p) => log(`  ! ${p}`));

  for (const key of Object.keys(NAMES)) {
    if (only && only !== key) continue;
    log(`\n2. ${key}: render`);
    const r = await renderEdition(key);
    const page = await browser.newPage({ viewport: { width: Math.round(r.w), height: Math.round(r.h) } });
    await page.goto(`file://${r.file}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')));
    broken.forEach((b) => { failed = true; log(`  ! image did not load: ${b}`); });

    const qa = await page.evaluate(inPageChecks);
    const badChars = qa.chars.filter((cp) => cp > 0x7e && !covered(cp)).map((cp) => `U+${cp.toString(16).toUpperCase()} ${String.fromCodePoint(cp)}`);
    fs.writeFileSync(path.join(BUILD, `qa-${key}.json`), JSON.stringify({ ...qa, chars: undefined, badChars }, null, 2));
    log(`   overflow: ${qa.overflow.length}  contrast fails: ${qa.contrast.length}  glyphs outside Inter Tight: ${badChars.length}`);
    qa.overflow.slice(0, 40).forEach((o) => log(`   overflow p${o.page}: ${o.el} "${o.text}"`));
    qa.contrast.slice(0, 40).forEach((c) => log(`   contrast p${c.page}: ${c.ratio} (needs ${c.need}, ${c.size}px) "${c.text}"`));
    badChars.forEach((c) => log(`   glyph: ${c}`));
    if (badChars.length) failed = true;

    log(`3. ${key}: print`);
    const pdf = flag('a4') ? path.join(BUILD, `${NAMES[key]}-A4.pdf`) : path.join(OUT, `${NAMES[key]}.pdf`);
    await page.pdf({ path: pdf, width: `${r.w}px`, height: `${r.h}px`, printBackground: true });
    await page.close();
    await finishPdf(pdf, r);

    if (!flag('no-sheets') && !flag('a4')) {
      const n = await contactSheet(browser, pdf, key, NAMES[key]);
      log(`4. ${key}: contact sheet (${n} pages)`);
    }
    const info = sh('pdfinfo', [pdf]);
    const pagesN = +info.match(/Pages:\s+(\d+)/)[1];
    const fonts = [...new Set(sh('pdffonts', [pdf]).split('\n').slice(2).map((l) => l.trim().split(/\s+/)[0]).filter(Boolean).map((n) => n.replace(/^[A-Z]{6}\+/, '')))];
    const mb = (fs.statSync(pdf).size / 1048576).toFixed(1);
    log(`   ${path.relative(REPO, pdf)}: ${pagesN} pages (rendered ${r.pages.length}), ${mb} MB, fonts: ${fonts.join(', ')}`);
    if (pagesN !== r.pages.length) { failed = true; log('  ! page count does not match the page list'); }
    if (fonts.some((f) => !/^InterTight/.test(f))) { failed = true; log('  ! a fallback font is embedded'); }
  }
  await browser.close();
  if (failed) { log('\nBuild finished with problems (see lines marked !).'); process.exitCode = 1; }
  else log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
