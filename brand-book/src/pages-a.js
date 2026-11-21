// Full edition, pages 1 to 13: welcome, brand, voice, logo.
import * as C from './content.js';
import { esc, hl, head, logo, motif, img, page } from './lib.js';

const shape = (name, color, x, y, w) =>
  `<span class="shape c-${color}" style="--x:${x}px;--y:${y}px;--w:${w}px">${motif(name)}</span>`;

/* 1 ---------------------------------------------------------------------- */
export const cover = ({ id = 'cover', ground = 'yolk', markFile = 'sha-mark-on-yolk', kind = 'Brand book', edition = 'Full edition', shapes } = {}) =>
  page({
    id, section: 'Welcome', name: 'Cover', ground,
    body: `
    <div class="cover__shapes" data-bleed>${shapes}</div>
    <div class="cover__top">
      ${logo(markFile)}
      <span class="lead">${esc(kind)}</span>
    </div>
    <div>
      <h1 class="hero cover__name">Sha Design<br><span class="hl">Studio</span></h1>
      <div class="cover__meta">
        <p class="h3 cover__tagline">${esc(C.brand.taglinePlain)}</p>
        <p class="label">${esc(edition)}  /  ${esc(C.brand.version)}  /  ${esc(C.brand.date)}</p>
      </div>
    </div>`,
  });

export const fullCover = () =>
  cover({
    shapes: [
      shape('blob-blue', 'pool', 905, -70, 300),
      shape('heart-red', 'tomato', 770, 196, 150),
      shape('clover-blue', 'pool', 1010, 262, 128),
      shape('splat-red', 'tomato', 1075, 430, 260),
      shape('star-blue', 'pool', 880, 420, 92),
    ].join(''),
  });

/* 2 ---------------------------------------------------------------------- */
export const contents = (pages) => {
  const colors = ['pool', 'tomato', 'yolk'];
  const firsts = [];
  pages.forEach((p, i) => {
    if (!firsts.find((f) => f.section === p.section)) firsts.push({ section: p.section, n: i + 1 });
  });
  return page({
    id: 'contents', section: 'Welcome', name: 'Contents', ground: 'cream',
    body: `
    ${head(["What’s ", 'inside', ''])}
    <ol class="contents">
      ${firsts.map((f, i) => `
      <li>
        <span class="dot c-${colors[i % 3]}"></span>
        <span class="lead">${esc(f.section)}</span>
        <span class="caption">${esc(C.sections[f.section] || '')}</span>
        <span class="lead num">${f.n}</span>
      </li>`).join('')}
    </ol>`,
  });
};

/* 3 ---------------------------------------------------------------------- */
export const hello = () =>
  page({
    id: 'hello', section: 'Welcome', name: 'How to use this book', ground: 'paper',
    body: `
    <div class="hello__side g-tomato">
      <h2 class="h2 title">${hl(C.hello.title)}</h2>
      <div class="hello__flower" data-on="yolk">${motif('flower-yellow')}<span class="h2">Hello</span></div>
    </div>
    <div class="hello__main">
      <p class="lead">${esc(C.hello.intro)}</p>
      <div>
        <h3 class="ui blockhead">${esc(C.hello.rulesTitle)}</h3>
        <ol class="hello__rules">
          ${C.hello.rules.map((r, i) => `<li><span class="lead n">${i + 1}</span><span class="body">${esc(r)}</span></li>`).join('')}
        </ol>
      </div>
      <div class="hello__editions">
        ${C.hello.editions.map(([a, b]) => `<div class="card card--cream"><p class="lead">${esc(a)}</p><p class="caption soft">${esc(b)}</p></div>`).join('')}
      </div>
    </div>`,
  });

/* 4 ---------------------------------------------------------------------- */
export const who = () =>
  page({
    id: 'who', section: 'Brand', name: 'Who Sha is', ground: 'pool',
    body: `
    <div class="who">
      <div class="who__copy">
        <h2 class="h2 title">${hl(C.who.title)}</h2>
        <p class="lead">${esc(C.who.lead)}</p>
        ${C.who.bio.map((p) => `<p class="body">${esc(p)}</p>`).join('')}
        <blockquote class="who__quote"><p class="h3">“${esc(C.who.quote)}”</p><p class="caption">${esc(C.who.quoteBy)}</p></blockquote>
        <div class="card who__road">
          ${C.who.road.map(([m, c, a, b]) => `
          <div class="who__stop"><span class="c-${c}">${motif(m)}</span><div><p class="ui strong">${esc(a)}</p><p class="caption soft" style="margin-top:5px">${esc(b)}</p></div></div>`).join('')}
        </div>
      </div>
      <div class="who__photo">
        <div class="frame">${img('photos/portrait.jpg', 'Shiran Bar')}</div>
        <div class="who__hello" data-on="yolk">${motif('flower-yellow')}<span class="lead">Hello</span></div>
      </div>
    </div>`,
  });

/* 5 ---------------------------------------------------------------------- */
// Shapes placed the way the home hero places them: big in the corners, small
// in between, the middle left clear. x / y are % of the hero, w is px.
const IDEA_SHAPES = [
  ['blob-blue', 'pool', 3, 6, 104], ['flower-yellow', 'yolk', 89, 4, 100],
  ['splat-red', 'tomato', 88, 66, 104], ['heart-red', 'yolk', 3, 62, 96],
  ['daisy-yellow', 'tomato', 9, 38, 54], ['clover-blue', 'pool', 88, 40, 56],
  ['star-blue', 'pool', 70, 4, 46], ['tulip-yellow', 'tomato', 26, 78, 48],
  ['ring-blue', 'pool', 24, 2, 42], ['blob-yellow', 'yolk', 71, 80, 50],
];

export const idea = () =>
  page({
    id: 'idea', section: 'Brand', name: 'Brand idea', ground: 'cream',
    body: `
    <div class="idea__hero">
      ${IDEA_SHAPES.map(([m, c, x, y, w]) => `<span class="shape c-${c}" style="--x:${x}%;--y:${y}%;--w:${w}px">${motif(m)}</span>`).join('')}
      <div>
        <h2 class="display">Designing <span class="hl">thoughtful</span><br>products</h2>
        <p class="lead">${esc(C.brand.promise)}</p>
      </div>
    </div>
    <div class="idea__cols">
      <div><h3 class="ui blockhead">${esc(C.idea.doesLabel)}</h3><p class="body">${esc(C.idea.does)}</p></div>
      <div><h3 class="ui blockhead">${esc(C.idea.forLabel)}</h3><ul class="body">${C.idea.for.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
      <div><h3 class="ui blockhead">${esc(C.idea.testLabel)}</h3><p class="body">${esc(C.idea.test)}</p></div>
    </div>`,
  });

/* 6 ---------------------------------------------------------------------- */
export const personality = () =>
  page({
    id: 'pers', section: 'Brand', name: 'Personality and values', ground: 'sand',
    body: `
    ${head(C.personality.title)}
    <div class="pers">
      <ul class="pers__traits">
        ${C.personality.traits.map(([a, b]) => `<li><h3 class="title-sm">${esc(a)}</h3><p class="body">${esc(b)}</p></li>`).join('')}
      </ul>
      <div class="pers__cards">
        ${C.personality.principles.map(([a, b], i) => `
        <div class="card${i === 0 ? ' has-photo' : ''}">
          <p class="lead">${esc(a)}</p><p class="caption">${esc(b)}</p>
          ${i === 0 ? img('photos/party.jpg', 'A Tiny Love take-along mobile with party characters') : ''}
        </div>`).join('')}
      </div>
    </div>`,
  });

/* 7 ---------------------------------------------------------------------- */
export const voice = () =>
  page({
    id: 'voice', section: 'Voice', name: 'Voice and tone: principles', ground: 'paper',
    body: `
    ${head(C.voice.title)}
    <div class="voice">
      <div class="voice__quote" data-clip>
        <span data-bleed>${motif('heart-red')}</span>
        <p class="h3">${esc(C.voice.sounds)}</p>
      </div>
      <ol class="rules">
        ${C.voice.rules.map((r) => `<li class="body">${esc(r)}</li>`).join('')}
      </ol>
      <div class="voice__side">
        <div>
          <h3 class="ui blockhead">${esc(C.voice.toneTitle)}</h3>
          <ul class="voice__tone">${C.voice.tone.map(([a, b]) => `<li><span class="caption strong">${esc(a)}</span><span class="caption soft">${esc(b)}</span></li>`).join('')}</ul>
        </div>
        <div>
          <h3 class="ui blockhead">${esc(C.voice.useTitle)}</h3>
          <div class="chips">${C.voice.use.map((w) => `<span class="pill caption">${esc(w)}</span>`).join('')}</div>
        </div>
        <div>
          <h3 class="ui blockhead">${esc(C.voice.avoidTitle)}</h3>
          <div class="chips chips--avoid">${C.voice.avoid.map((w) => `<span class="pill caption">${esc(w)}</span>`).join('')}</div>
        </div>
      </div>
    </div>`,
  });

/* 8 ---------------------------------------------------------------------- */
export const voiceExamples = () =>
  page({
    id: 'vex', section: 'Voice', name: 'Voice and tone: do and don’t', ground: 'pool',
    body: `
    ${head(C.voiceExamples.title, esc(C.voiceExamples.note))}
    <div class="vex">
      <div class="card vex__table">
        <div class="vex__row vex__row--head"><span></span><span class="label yes">Write this</span><span class="label no">Steer away from</span></div>
        ${C.voiceExamples.pairs.map(([k, yes, no]) => `
        <div class="vex__row"><span class="label">${esc(k)}</span><span class="lead vex__yes">${esc(yes)}</span><span class="body vex__no">${esc(no)}</span></div>`).join('')}
      </div>
      <div class="card vex__live">
        <h3 class="ui blockhead" style="margin-bottom:10px">${esc(C.voiceExamples.liveTitle)}</h3>
        <ul class="vex__live stack fill">
          ${C.voiceExamples.live.map(([a, b]) => `<li><p class="lead">${esc(a)}</p><p class="caption">${esc(b)}</p></li>`).join('')}
        </ul>
      </div>
    </div>`,
  });

/* 9 ---------------------------------------------------------------------- */
// Pin positions as % of the mark's 318 x 218 box.
const PINS = [[38, 50], [75.5, 10.4], [7.1, 74.2], [64.6, 95.6]];
const PART_COLORS = ['pool', 'tomato', 'yolk', 'tomato'];

export const markArt = () => `
        <div class="mark__art">
          ${logo('sha-mark')}
          ${PINS.map(([x, y], i) => `<span class="mark__pin ui" style="left:${x}%;top:${y}%">${i + 1}</span>`).join('')}
        </div>`;

export const markParts = (withNotes = true) => `
        <ol class="mark__parts">
          ${C.mark.parts.map(([a, b, c], i) => `
          <li><span class="mark__pin ui">${i + 1}</span><span class="sw bg-${PART_COLORS[i]}"></span>
            <div><p class="lead">${esc(a)} <span class="soft">${esc(b)}</span></p>${withNotes ? `<p class="caption">${esc(c)}</p>` : ''}</div></li>`).join('')}
        </ol>`;

export const theMark = () =>
  page({
    id: 'mark', section: 'Logo', name: 'The mark', ground: 'cream',
    body: `
    ${head(C.mark.title, esc(C.mark.note))}
    <div class="mark">
      <div class="mark__tile">
        ${markArt()}
      </div>
      <div class="mark__side">
        ${markParts()}
        <div>
          <p class="body">${esc(C.mark.rule)}</p>
          <p class="caption file" style="margin-top:8px">${esc(C.mark.file)}</p>
        </div>
      </div>
    </div>`,
  });

/* 10 --------------------------------------------------------------------- */
const LOCKUP_W = { 'sha-horizontal': 390, 'sha-stacked': 124, 'sha-wordmark': 250, 'sha-sticker': 122 };

export const lockups = () =>
  page({
    id: 'lockups', section: 'Logo', name: 'Lockups', ground: 'paper',
    body: `
    ${head(C.lockups.title, esc(C.lockups.note))}
    <div class="lockups">
      ${C.lockups.items.map((it) => lockupFig(it)).join('')}
    </div>
    <p class="caption soft">${esc(C.lockups.descriptor)}</p>`,
  });

/* 11 --------------------------------------------------------------------- */
export const vtile = ([file, ground, use]) => `
  <figure class="vtile">
    <div class="vtile__art bg-${ground}">${logo(file)}</div>
    <figcaption><span class="caption file">${esc(file)}.svg</span><span class="caption use">${esc(use)}</span></figcaption>
  </figure>`;

export const variants = () =>
  page({
    id: 'variants', section: 'Logo', name: 'Color variants', ground: 'night',
    body: `
    ${head(C.variants.title, esc(C.variants.note))}
    <div class="variants">
      <div class="variants__row variants__row--marks">${C.variants.marks.map(vtile).join('')}</div>
      <div class="variants__row variants__row--lockups">${C.variants.lockups.map(vtile).join('')}</div>
      <div class="variants__notes">
        <p class="caption">${C.variants.rules.map(esc).join(' ')}</p>
        <p class="caption">${esc(C.variants.oneColor)}</p>
        <p class="caption">${esc(C.variants.exception)}</p>
      </div>
    </div>`,
  });

/* 12 --------------------------------------------------------------------- */
// Samples drawn at the kit's minimum screen sizes, in kit px.
const MIN_PX = { 'sha-mark': 'height:20px', 'sha-horizontal': 'width:160px', 'sha-stacked': 'width:120px', 'sha-wordmark': 'width:120px', 'sha-sticker': 'height:48px' };

export const spaceBox = () => `
          <div class="space__box">
            ${['tl', 'tr', 'bl', 'br'].map((c) => `<span class="space__x space__x--${c} ui">x</span>`).join('')}
            ${logo('sha-mark')}
          </div>`;

export const minList = () => `
        <ul class="minsizes">
          ${C.space.min.map(([file, name, px, mm]) => `
          <li><span class="sample"><span style="display:block;${MIN_PX[file]}">${logo(file, { mutate: (s) => s.replace('class="logo', `style="${MIN_PX[file]};width:auto" class="logo`) })}</span></span>
            <span class="ui strong">${esc(name)}</span><span class="caption num">${esc(px)}</span><span class="caption num">${esc(mm)}</span></li>`).join('')}
        </ul>`;

export const lockupFig = ([file, name, use], w = LOCKUP_W[file]) => `
      <figure class="lockup${file === 'sha-sticker' ? ' lockup--pool' : ''}">
        <div class="lockup__art"><div style="width:${w}px">${logo(file)}</div></div>
        <figcaption class="lockup__meta"><span class="ui strong">${esc(name)}</span><span class="caption">${esc(use)}</span></figcaption>
      </figure>`;

export const clearSpace = () =>
  page({
    id: 'space', section: 'Logo', name: 'Clear space and minimum size', ground: 'paper',
    body: `
    ${head(C.space.title)}
    <div class="space">
      <div class="space__left">
        <div class="space__tile">
          ${spaceBox()}
        </div>
        <p class="body"><span class="strong">Clear space.</span> ${esc(C.space.clear)}</p>
      </div>
      <div class="space__right">
        <h3 class="lead">${esc(C.space.minTitle)}</h3>
        ${minList()}
        <p class="caption">${esc(C.space.below)}</p>
      </div>
    </div>`,
  });

/* 13 --------------------------------------------------------------------- */
// Each wrong version is made from the real kit file.
const swapColors = (svg) =>
  svg
    .replace(/fill="#1864ED"/gi, 'style="fill:var(--tomato)"')
    .replace(/fill="#F74612"/gi, 'style="fill:var(--yolk)"')
    .replace(/fill="#FAC423"/gi, 'style="fill:var(--pool)"');

const MISUSE_ART = {
  stretch: () => `<div class="mis-stretch">${logo('sha-mark')}</div>`,
  rotate: () => `<div class="mis-rotate">${logo('sha-mark')}</div>`,
  swap: () => logo('sha-mark', { mutate: swapColors }),
  black: () => `<div class="mis-black">${logo('sha-mark')}</div>`,
  outline: () => `<div class="mis-outline">${logo('sha-mark')}${logo('sha-mark')}</div>`,
  onpool: () => logo('sha-mark'),
  wrongcoat: () => logo('sha-mark-on-yolk'),
  crowd: () => `<div class="mis-crowd">${motif('daisy-yellow')}${logo('sha-mark')}<span class="pill pill--tomato ui">New</span><span class="lead">Toy studio</span></div>`,
};
const MISUSE_TILE = { onpool: 'pool', wrongcoat: 'tomato' };

export const misuseTiles = () => `
    <div class="donts">
      ${C.misuse.items.map(([key, text]) => `
      <figure class="dont-tile${MISUSE_TILE[key] ? ` dont-tile--${MISUSE_TILE[key]}` : ''}">
        <div class="dont-tile__art" data-contrast-demo>${MISUSE_ART[key]()}</div>
        <figcaption class="dont-tile__cap"><span class="dont caption strong">Don’t</span><span class="ui">${esc(text)}</span></figcaption>
      </figure>`).join('')}
    </div>`;

export const misuse = () =>
  page({
    id: 'misuse', section: 'Logo', name: 'Misuse', ground: 'cream',
    body: `
    ${head(C.misuse.title, esc(C.misuse.note))}
    ${misuseTiles()}`,
  });

export const partsA = { shape };
