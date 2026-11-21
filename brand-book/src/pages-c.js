// Full edition, pages 27 to 35: layout, components, motion, in use, clients, reference.
import * as C from './content.js';
import { esc, hl, head, logo, motif, icon, img, page } from './lib.js';

/* 27 --------------------------------------------------------------------- */
export const spacingBars = () => `
  <ul class="sp">
    ${C.layout.spacing.map(([name, v, use]) => `
    <li><span class="caption strong">${esc(name)}</span><span class="sp__bar"><i style="width:${v * 2.6}px"></i></span><span class="caption num">${v}</span><span class="caption soft">${esc(use)}</span></li>`).join('')}
  </ul>`;

export const radiusRow = (short = false) => `
  <div class="rad">
    ${C.layout.radius.map(([name, v, use]) => `
    <div><i style="border-radius:${Math.min(v, short ? 20 : 34)}px"></i>${short
      ? `<p class="caption"><span class="strong">${v}</span> ${esc(name.replace('radius-', ''))}</p>`
      : `<p class="caption strong">${esc(name)}</p><p class="caption soft">${v}, ${esc(use.toLowerCase())}</p>`}</div>`).join('')}
  </div>`;

export const layout = () =>
  page({
    id: 'layout', section: 'Layout', name: 'Panels, spacing and corners', ground: 'cream',
    body: `
    ${head(C.layout.title, esc(C.layout.note))}
    <div class="lay">
      <div class="lay__win">
        <div class="lay__nav"><span class="lay__mark">${logo('sha-mark')}</span><span class="lay__pills"><i></i><i class="on"></i><i></i></span><i class="lay__cta"></i></div>
        <div class="lay__panel bg-pool">
          <i class="lay__h bg-paper"></i><i class="lay__h lay__h--2 bg-yolk"></i>
          <div class="lay__cards"><i></i><i></i><i></i></div>
        </div>
        <div class="lay__panel lay__panel--2 bg-yolk"><i class="lay__capsule bg-pool"></i></div>
        <span class="lay__tag caption" style="left:-14px;top:74px">gutter 16</span>
        <span class="lay__tag caption" style="left:30px;top:48px">radius 24</span>
        <span class="lay__tag caption" style="right:28px;top:104px">pad 72</span>
        <span class="lay__tag caption" style="right:36px;top:196px">cards: radius 18, gap 10</span>
        <span class="lay__tag caption" style="left:44px;bottom:8px">panels stack with a 16 gap</span>
      </div>
      <div class="lay__side">
        <div><h3 class="ui blockhead">${esc(C.layout.spacingTitle)}</h3>${spacingBars()}</div>
        <div><h3 class="ui blockhead">${esc(C.layout.radiusTitle)}</h3>${radiusRow()}</div>
        <p class="body">${esc(C.layout.rule)}</p>
      </div>
    </div>`,
  });

/* 28 --------------------------------------------------------------------- */
export const navMock = () => `
  <div class="nv">
    <span class="nv__mark">${logo('sha-mark')}</span>
    <span class="nv__pills"><span class="pill ui">Work</span><span class="pill ui">Services</span><span class="pill pill--ink ui">About</span></span>
    <span class="pill pill--tomato ui">Inquire</span>
  </div>`;

const BTN = { primary: ['tomato', 'ink'], yellow: ['yolk', 'pool'], outline: ['oat', 'ink'], dark: ['ink', 'pool'], ghost: ['ghost', 'oat'] };

export const components = () =>
  page({
    id: 'components', section: 'Components', name: 'Pills, buttons, badges, cards', ground: 'pool',
    body: `
    ${head(C.components.title, esc(C.components.note))}
    <div class="cmp">
      <div class="card cmp__c cmp__c--2">
        <h3 class="ui blockhead">${esc(C.components.nav[0])}</h3>
        ${navMock()}
        <p class="caption soft">${esc(C.components.nav[1])}</p>
      </div>
      <div class="card cmp__c">
        <h3 class="ui blockhead">${esc(C.components.pills[0])}</h3>
        <div class="row" style="gap:4px;flex-wrap:wrap"><span class="pill pill--ink ui">All</span><span class="pill ui">Toys</span><span class="pill ui">Baby products</span></div>
        <p class="caption soft">${esc(C.components.pills[1])}</p>
      </div>
      <div class="card cmp__c cmp__c--2">
        <h3 class="ui blockhead">${esc(C.components.buttons[0])}</h3>
        <div class="cmp__btns">
          ${C.components.buttonList.map(([key, name, note]) => `
          <div><span class="pill pill--${BTN[key][0]} ui">${esc(name)}</span><span class="pill pill--${BTN[key][1]} ui cmp__hover">${esc(name)}</span><p class="caption soft">${esc(note)}</p></div>`).join('')}
        </div>
        <p class="caption soft">${esc(C.components.buttons[1])} The second row shows each fill on hover.</p>
      </div>
      <div class="card cmp__c">
        <h3 class="ui blockhead">${esc(C.components.capsule[0])}</h3>
        <div class="cmp__caps"><span class="pill pill--yolk lead cmp__capsule">Start a project</span><span class="pill pill--pool lead cmp__capsule">Start a project</span></div>
        <p class="caption soft">${esc(C.components.capsule[1])}</p>
      </div>
      <div class="card cmp__c cmp__c--row">
        <div class="cmp__proj"><span class="cmp__tab bg-tomato ui">Treasure the Ocean</span><div class="frame frame--yolk">${img('photos/gymini-hero.jpg', 'Treasure the Ocean play gym')}<span class="pill pill--paper pill--sm caption strong cmp__badge">Play gym</span></div></div>
        <div><h3 class="ui blockhead">${esc(C.components.card[0])} + ${esc(C.components.badge[0].toLowerCase())}</h3><p class="caption soft">${esc(C.components.card[1])} ${esc(C.components.badge[1])}</p></div>
      </div>
      <div class="card cmp__c">
        <h3 class="ui blockhead">${esc(C.components.field[0])}</h3>
        <div class="cmp__field"><span class="ui">Your email</span><span class="pill pill--ink ui">Say hi</span></div>
        <p class="caption soft">${esc(C.components.field[1])}</p>
      </div>
      <div class="card cmp__c">
        <h3 class="ui blockhead">${esc(C.components.focus[0])}</h3>
        <div><span class="pill ui cmp__ring">Explore my services</span></div>
        <p class="caption soft">${esc(C.components.focus[1])}</p>
      </div>
    </div>`,
  });

/* 29 --------------------------------------------------------------------- */
// Step response of a spring, the way motion/react solves it.
function springCurve(k, c, m, w = 236, h = 86) {
  const w0 = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(k * m));
  const wd = w0 * Math.sqrt(1 - z * z);
  const x = (t) => 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  const T = 1.1;
  const base = h - 8;
  const one = 34;
  const pts = [];
  for (let i = 0; i <= 110; i++) {
    const t = (i / 110) * T;
    pts.push(`${((t / T) * w).toFixed(1)},${(base - x(t) * (base - one)).toFixed(1)}`);
  }
  return `<svg class="spr__svg" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <line x1="0" y1="${one}" x2="${w}" y2="${one}" class="spr__target"/>
    <line x1="0" y1="${base}" x2="${w}" y2="${base}" class="spr__axis"/>
    <polyline points="${pts.join(' ')}" class="spr__line"/>
  </svg>`;
}

export const springs = () => `
  <div class="spr">
    ${C.motion.springs.map(([name, k, c, m, text]) => `
    <figure class="spr__one">
      ${springCurve(k, c, m)}
      <figcaption><p class="lead">${esc(name)}</p><p class="caption soft">stiffness ${k}, damping ${c}${m !== 1 ? `, mass ${m}` : ''}</p><p class="caption">${esc(text)}</p></figcaption>
    </figure>`).join('')}
  </div>`;

const FRAMES = {
  rise: `<i class="fr fr--rise"><b style="transform:translateY(105%)">Play</b></i><i class="fr fr--rise"><b style="transform:translateY(48%)">Play</b></i><i class="fr fr--rise"><b>Play</b></i>`,
  wipe: `<i class="fr fr--wipe"><u style="width:0"></u><b class="pre">work</b></i><i class="fr fr--wipe"><u style="width:52%"></u><b class="pre">work</b></i><i class="fr fr--wipe"><u></u><b>work</b></i>`,
  sweep: `<i class="fr fr--sweep"><u style="transform:translate(-50%,0) scale(0)"></u><b>Say hi</b></i><i class="fr fr--sweep"><u style="transform:translate(-50%,-24%) scale(1)"></u><b>Say hi</b></i><i class="fr fr--sweep"><u style="transform:translate(-50%,-50%) scale(1)"></u><b class="on">Say hi</b></i>`,
  grab: `<i class="fr fr--grab"><span class="c-yolk" style="left:36%;top:28%">${motif('daisy-yellow')}</span></i><i class="fr fr--grab"><em></em><span class="c-yolk" style="left:62%;top:6%">${motif('daisy-yellow')}</span></i><i class="fr fr--grab"><span class="c-yolk" style="left:36%;top:28%">${motif('daisy-yellow')}</span></i>`,
  band: `<i class="fr fr--band"><b>little hands</b></i><i class="fr fr--band"><b style="transform:translateX(-34%)">little hands</b></i><i class="fr fr--band"><b style="transform:translateX(-68%)">little hands</b></i>`,
};

export const FRAME_SWEEP = FRAMES.sweep;

export const moves = (keys) => `
  <ul class="mv">
    ${C.motion.moves.filter(([k]) => !keys || keys.includes(k)).map(([key, title, text]) => `
    <li><div><p class="ui strong">${esc(title)}</p><p class="caption soft">${esc(text)}</p></div><div class="mv__frames" data-contrast-demo data-bleed>${FRAMES[key]}</div></li>`).join('')}
  </ul>`;

export const motion = () =>
  page({
    id: 'motion', section: 'Motion', name: 'Motion', ground: 'night',
    body: `
    ${head(C.motion.title, esc(C.motion.note))}
    <div class="mo">
      <div><h3 class="ui blockhead">${esc(C.motion.springsTitle)}</h3>${springs()}</div>
      <div><h3 class="ui blockhead">${esc(C.motion.movesTitle)}</h3>${moves()}</div>
    </div>
    <p class="caption mo__reduced">${esc(C.motion.reduced)}</p>`,
  });

/* 30 --------------------------------------------------------------------- */
export const screenFig = ([file, name, ground, line]) => `
  <figure class="scr">
    <div class="frame">${img(`screens/${file}.jpg`, `${name} page of sha-design.com`)}</div>
    <figcaption class="caption"><span class="strong">${esc(name)}</span> <span class="soft">${esc(ground)}. ${esc(line)}</span></figcaption>
  </figure>`;

export const web = () => {
  const [home, ...rest] = C.web.screens;
  return page({
    id: 'web', section: 'In use', name: 'Website', ground: 'cream',
    body: `
    ${head(C.web.title, esc(C.web.note))}
    <div class="wb">
      <div class="wb__big">${screenFig(home)}</div>
      <div class="wb__grid">${rest.map(screenFig).join('')}</div>
    </div>`,
  });
};

/* 31 --------------------------------------------------------------------- */
export const samplePill = '<span class="pill pill--sm pill--ink caption">Sample layout</span>';

export const postMock = () => `
  <div class="post g-pool" data-bleed>
    <span class="c-yolk post__s1">${motif('ring-blue')}</span><span class="c-paper post__s2">${motif('heart-red')}</span>
    <p class="label">${esc(C.social.postLabel)}</p>
    <p class="post__title">${hl(C.social.postTitle)}</p>
    <span class="post__mark">${logo('sha-mark-on-pool')}</span>
  </div>`;

export const sigMock = () => `
  <div class="sig card">
    <span class="sig__logo">${logo('sha-horizontal')}</span>
    <div class="sig__text"><p class="ui strong">${esc(C.social.sigLines[0])}</p><p class="caption soft">${esc(C.social.sigLines[1])}</p><p class="caption c-pool">${esc(C.social.sigLines[2])}</p></div>
  </div>`;

export const social = () =>
  page({
    id: 'social', section: 'In use', name: 'Social, share image, avatar', ground: 'yolk',
    body: `
    ${head(C.social.title, esc(C.social.note))}
    <div class="so">
      <div class="so__col">
        <figure><div class="frame">${img('social/sha-og-image.jpg', 'The share image: Designing thoughtful products')}</div><figcaption class="caption"><span class="strong">${esc(C.social.og[0])}.</span> ${esc(C.social.og[1])}</figcaption></figure>
        <figure>${sigMock()}<figcaption class="caption"><span class="strong">${esc(C.social.sig[0])}</span> ${samplePill}</figcaption></figure>
      </div>
      <div class="so__col">
        <figure>${postMock()}<figcaption class="caption"><span class="strong">${esc(C.social.post[0])}</span> ${samplePill}</figcaption></figure>
        <figure><div class="so__avs">${img('kit/icons/avatar-pool-1080.png', 'Avatar on pool')}${img('kit/icons/avatar-cream-1080.png', 'Avatar on cream')}</div><figcaption class="caption"><span class="strong">${esc(C.social.avatars[0])}.</span> ${esc(C.social.avatars[1])}</figcaption></figure>
      </div>
      <div class="card so__files">
        <h3 class="ui blockhead">${esc(C.social.filesTitle)}</h3>
        <ul class="rules">${C.social.files.map(([a, b]) => `<li><p class="caption strong">${esc(a)}</p><p class="caption soft">${esc(b)}</p></li>`).join('')}</ul>
      </div>
    </div>`,
  });

/* 32 --------------------------------------------------------------------- */
export const cardMock = () => `
  <div class="bc">
    <div class="bc__face bg-cream"><span style="width:92px">${logo('sha-stacked')}</span></div>
    <div class="bc__face bg-pool c-paper"><span class="bc__mark">${logo('sha-mark-paper')}</span><div><p class="ui strong">${esc(C.brand.designer)}</p><p class="caption">Industrial designer</p><p class="caption" style="margin-top:8px">${esc(C.brand.site)}</p><p class="caption">${esc(C.brand.email)}</p></div></div>
  </div>`;

export const stickerMock = () => `
  <div class="stk bg-sand">${Array.from({ length: 6 }, () => `<span>${logo('sha-sticker')}</span>`).join('')}</div>`;

export const labelMock = () => `
  <div class="shl">
    <div class="shl__top"><span class="shl__mark">${logo('sha-mark-ink')}</span><div><p class="ui strong">${esc(C.brand.name)}</p><p class="caption">${esc(C.brand.site)}</p></div></div>
    <p class="label">Ship to</p><i></i><i style="width:70%"></i><i style="width:50%"></i>
  </div>`;

export const print = () =>
  page({
    id: 'print', section: 'In use', name: 'Packaging and print', ground: 'paper',
    body: `
    ${head(C.print.title, esc(C.print.note))}
    <div class="prn">
      <div class="prn__pieces">
        <figure class="prn__fig">${cardMock()}<figcaption class="caption"><span class="strong">${esc(C.print.items[0][0])}</span> ${samplePill}<br><span class="soft">${esc(C.print.items[0][1].replace('Sample layout. ', ''))}</span></figcaption></figure>
        <figure class="prn__fig">${stickerMock()}<figcaption class="caption"><span class="strong">${esc(C.print.items[1][0])}</span> ${samplePill}<br><span class="soft">${esc(C.print.items[1][1].replace('Sample layout. ', ''))}</span></figcaption></figure>
        <figure class="prn__fig">${labelMock()}<figcaption class="caption"><span class="strong">${esc(C.print.items[2][0])}</span> ${samplePill}<br><span class="soft">${esc(C.print.items[2][1].replace('Sample layout. ', ''))}</span></figcaption></figure>
      </div>
      <div class="prn__side">
        <div>
          <h3 class="ui blockhead">${esc(C.print.minTitle)}</h3>
          <ul class="prn__min">${C.print.min.map(([a, b]) => `<li><span class="caption strong">${esc(a)}</span><span class="caption">${esc(b)}</span></li>`).join('')}</ul>
        </div>
        <p class="caption soft">${esc(C.print.cmyk)}</p>
      </div>
    </div>`,
  });

/* 33 --------------------------------------------------------------------- */
export const clientTiles = () => `
  <div class="cl__grid">${C.clients.logos.map(([file, name]) => `<div class="cl__tile">${img(`clients/${file}-ink.png`, `${name} logo`)}</div>`).join('')}</div>`;

export const clients = () =>
  page({
    id: 'clients', section: 'Clients', name: 'Brands Shiran has worked with', ground: 'sand',
    body: `
    ${head(C.clients.title, esc(C.clients.note))}
    <div class="cl">
      ${clientTiles()}
      <div class="cl__side">
        <ul class="rules">${C.clients.facts.map(([a, b]) => `<li class="body"><span class="strong">${esc(a)}.</span> ${esc(b)}</li>`).join('')}</ul>
        <p class="caption">${esc(C.clients.rule)}</p>
      </div>
    </div>`,
  });

/* 34 --------------------------------------------------------------------- */
export const pickTable = () => `
  <ul class="pick">${C.index.pick.map(([a, b]) => `<li><span class="caption">${esc(a)}</span><span class="caption strong">${esc(b)}</span></li>`).join('')}</ul>`;

export const assetIndex = () =>
  page({
    id: 'index', section: 'Reference', name: 'Asset index', ground: 'cream',
    body: `
    ${head(C.index.title, esc(C.index.note))}
    <div class="ix">
      <div class="ix__folders">
        ${C.index.folders.map(([a, b, c]) => `<div class="card ix__folder"><p class="lead c-pool">${esc(a)}</p><p class="label soft">${esc(b)}</p><p class="caption">${esc(c)}</p></div>`).join('')}
      </div>
      <div class="ix__side">
        <h3 class="ui blockhead">${esc(C.index.pickTitle)}</h3>
        ${pickTable()}
        <p class="caption soft">${esc(C.index.siteOnly)}</p>
      </div>
    </div>`,
  });

/* 35 --------------------------------------------------------------------- */
export const backCover = ({ id = 'back', extra = '', essentials = '' } = {}) =>
  page({
    id, section: 'Reference', name: essentials ? 'Assets and contact' : 'Contact', ground: 'night', cls: `p-backcover${essentials ? ' p-backcover--e' : ''}`,
    body: `
    <div class="cover__shapes" data-bleed>
      <span class="shape c-yolk" style="--x:930px;--y:-60px;--w:270px">${motif('flower-yellow')}</span>
      <span class="shape c-tomato" style="--x:1040px;--y:236px;--w:170px">${motif('heart-red')}</span>
      <span class="shape c-pool" style="--x:930px;--y:318px;--w:104px">${motif('clover-blue')}</span>
      <span class="shape c-yolk" style="--x:1010px;--y:470px;--w:240px">${motif('tulip-yellow')}</span>
    </div>
    <div class="back__logo">${logo('sha-horizontal-paper')}</div>
    ${essentials}
    <div class="back__main">
      ${extra}
      <h2 class="${essentials ? 'h2' : 'display'} title">${hl(C.back.title)}</h2>
      <p class="lead back__line">${esc(C.back.line)}</p>
      <p class="h3 back__contact">${esc(C.brand.site)}<br>${esc(C.brand.email)}</p>
      <p class="label soft">Brand book  /  ${esc(C.brand.version)}  /  ${esc(C.brand.date)}</p>
    </div>`,
  });
