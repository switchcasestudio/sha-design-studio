// Shared helpers for the brand-book pages: inline SVG loaders, small HTML
// builders and the page wrapper. Pages are plain template strings.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SRC = path.dirname(fileURLToPath(import.meta.url));
export const ASSETS = path.join(SRC, 'assets');

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cache = new Map();
const read = (p) => {
  if (!cache.has(p)) cache.set(p, fs.readFileSync(p, 'utf8'));
  return cache.get(p);
};

/** A kit logo as inline SVG (vector in the PDF). `name` = file name without .svg */
export function logo(name, { cls = '', label = 'Sha Design Studio', mutate } = {}) {
  let svg = read(path.join(ASSETS, 'kit/logos/svg', `${name}.svg`));
  svg = svg
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<svg([^>]*)>/, (m, attrs) => {
      const a = attrs.replace(/\s(width|height|role)="[^"]*"/g, '');
      return `<svg${a} class="logo ${cls}" role="img" aria-label="${esc(label)}">`;
    });
  return mutate ? mutate(svg) : svg;
}

/** A kit motif as inline SVG, colour-agnostic: the baked fill is stripped and
 *  the shape takes `currentColor`, so CSS `color` tints it. */
export function motif(name, { cls = '', style = '' } = {}) {
  let svg = read(path.join(ASSETS, 'kit/motifs/svg', `${name}.svg`));
  svg = svg
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<defs>[\s\S]*?<\/defs>/g, '')
    .replace(/\s(id|data-name|class)="[^"]*"/g, '')
    .replace(/<svg([^>]*)>/, `<svg$1 class="motif ${cls}" fill="currentColor" aria-hidden="true"${style ? ` style="${style}"` : ''}>`);
  return svg.trim();
}

/** The favicon (kit icon) inline. */
export function favicon(cls = '') {
  return read(path.join(ASSETS, 'kit/icons/favicon.svg'))
    .replace(/<title>[^<]*<\/title>/g, '')
    .replace(/<svg([^>]*)>/, (m, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} class="${cls}" aria-hidden="true">`);
}

// Six Lucide icons (ISC licence), the ones the kit guide shows. 2px stroke.
const LUCIDE = {
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
};
export const icon = (name, size = 22) =>
  `<svg class="icon" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LUCIDE[name]}</svg>`;

/** Headline with exactly one phrase in a solid block: [before, block, after]. */
export const hl = ([a = '', b = '', c = '']) =>
  `${esc(a)}${b ? `<span class="hl">${esc(b)}</span>` : ''}${esc(c)}`;

/** Raster or SVG image by path relative to src/assets. */
export const img = (rel, alt = '', cls = '') =>
  `<img src="../src/assets/${rel}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}>`;

/** Title row: coloured headline on the left, a short note on the right. */
export const head = (title, note = '', cls = 'h2') => `
  <header class="head">
    <h2 class="${cls} title">${hl(title)}</h2>
    ${note ? `<p class="body note">${note}</p>` : ''}
  </header>`;

/** Page record. `ground` picks the panel colour recipe; `name` is the bookmark title. */
export const page = ({ id, section, name, ground = 'cream', cls = '', body }) => ({
  id, section, name, ground, cls, body,
});

/** Wrap a page record into its final HTML, with the footer. */
export function renderPage(p, { n, total, edition }) {
  return `
<section class="page" id="${p.id}" data-section="${esc(p.section)}" data-name="${esc(p.name)}">
  <div class="panel g-${p.ground} p-${p.id} ${p.cls}">
${p.body}
  </div>
  <footer class="pagefoot label">
    <span>${esc(p.section)}</span>
    <span>Sha Design Studio brand book, ${esc(edition)}</span>
    <span>${n} / ${total}</span>
  </footer>
</section>`;
}

/* ----- Token values, read from the kit file so nothing is retyped ----- */
let _tokens;
export function tokens() {
  if (_tokens) return _tokens;
  const css = read(path.join(ASSETS, 'kit/tokens/tokens.css'));
  const root = css.slice(css.indexOf(':root'), css.indexOf('}', css.indexOf(':root')));
  _tokens = {};
  for (const m of root.matchAll(/--([\w-]+):\s*([^;]+);/g)) _tokens[m[1]] = m[2].trim();
  return _tokens;
}

export const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Plain sRGB to CMYK. Not colour-managed: printed as "approximate". */
export function cmykOf(hex) {
  const [r, g, b] = rgbOf(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return [0, 0, 0, 100];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100));
}

const lum = (hex) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = rgbOf(hex);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

/** WCAG 2 contrast ratio between two token names. */
export function contrast(a, b) {
  const t = tokens();
  const [x, y] = [lum(t[a]), lum(t[b])].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
