// Essentials edition: 12 pages. Each page is laid out for this edition, but it
// reads the same content records and reuses the same parts as the Full edition.
import * as C from './content.js';
import { esc, hl, logo, motif, icon, img, page } from './lib.js';
import * as A from './pages-a.js';
import * as B from './pages-b.js';
import * as D from './pages-c.js';

const shape = A.partsA.shape;
const title = (t) => `<h2 class="title-sm">${hl(t)}</h2>`;
const ehead = (t, note = '') => `<header class="head">${title(t)}${note ? `<p class="caption note">${note}</p>` : ''}</header>`;

/* 1 */
export const cover = () =>
  A.cover({
    id: 'e-cover', ground: 'pool', markFile: 'sha-mark-on-pool', kind: 'Brand book', edition: 'Essentials',
    shapes: [
      shape('flower-yellow', 'yolk', 900, -64, 300),
      shape('heart-red', 'paper', 780, 200, 146),
      shape('clover-blue', 'paper', 1016, 270, 120),
      shape('tulip-yellow', 'yolk', 1050, 420, 250),
      shape('daisy-yellow', 'yolk', 880, 430, 96),
    ].join(''),
  });

/* 2 */
export const whoIdea = () =>
  page({
    id: 'e-who', section: 'Brand', name: 'Who Sha is and the brand idea', ground: 'cream',
    body: `
    <div class="e-who">
      <div class="e-who__photo"><div class="frame">${img('photos/portrait.jpg', 'Shiran Bar')}</div></div>
      <div class="e-who__main">
        <h2 class="h2 title">${hl(C.brand.tagline)}</h2>
        <p class="h3">${esc(C.brand.promise)}</p>
        <p class="body">${esc(C.who.short)}</p>
        <div class="e-who__road">
          ${C.who.road.map(([m, c, a, b]) => `<div class="who__stop"><span class="c-${c}">${motif(m)}</span><div><p class="ui strong">${esc(a)}</p><p class="caption soft" style="margin-top:4px">${esc(b)}</p></div></div>`).join('')}
        </div>
      </div>
      <div class="e-who__side">
        <div class="card">
          <h3 class="ui blockhead">${esc(C.idea.forLabel)}</h3>
          <ul class="rules">${C.idea.for.map((f) => `<li class="caption">${esc(f)}</li>`).join('')}</ul>
        </div>
        <div class="card">
          <h3 class="ui blockhead">${esc(C.personality.principlesTitle)}</h3>
          <ul class="rules">${C.personality.principles.map(([a, b]) => `<li><p class="ui strong">${esc(a)}</p><p class="caption soft" style="margin-top:4px">${esc(b)}</p></li>`).join('')}</ul>
        </div>
      </div>
    </div>`,
  });

/* 3 */
export const voice = () =>
  page({
    id: 'e-voice', section: 'Voice', name: 'Voice in one page', ground: 'paper',
    body: `
    ${ehead(C.voice.title)}
    <div class="e-voice__band"><p class="h3">${esc(C.voice.sounds)}</p></div>
    <div class="e-voice">
      <ol class="rules">${C.voice.rules.map((r) => `<li class="body">${esc(r)}</li>`).join('')}</ol>
      <div class="card card--cream e-voice__pairs">
        <div class="vex__row vex__row--head"><span></span><span class="label yes">Write this</span><span class="label no">Steer away from</span></div>
        ${C.voiceExamples.pairs.map(([k, yes, no]) => `<div class="vex__row"><span class="label">${esc(k)}</span><span class="ui strong vex__yes">${esc(yes)}</span><span class="caption vex__no">${esc(no)}</span></div>`).join('')}
      </div>
      <div class="voice__side">
        <div><h3 class="ui blockhead">${esc(C.voice.useTitle)}</h3><div class="chips">${C.voice.use.map((w) => `<span class="pill caption">${esc(w)}</span>`).join('')}</div></div>
        <div><h3 class="ui blockhead">${esc(C.voice.avoidTitle)}</h3><div class="chips chips--avoid">${C.voice.avoid.map((w) => `<span class="pill caption">${esc(w)}</span>`).join('')}</div></div>
      </div>
    </div>`,
  });

/* 4 */
export const logoPage = () =>
  page({
    id: 'e-logo', section: 'Logo', name: 'Logo and lockups', ground: 'cream',
    body: `
    ${ehead(C.lockups.title, esc(C.lockups.note))}
    <div class="e-logo">
      <div class="e-logo__mark">
        <div class="mark__tile">${A.markArt()}</div>
        ${A.markParts(false)}
      </div>
      <div class="e-logo__lockups">
        ${C.lockups.items.map((it) => A.lockupFig(it, { 'sha-horizontal': 300, 'sha-stacked': 112, 'sha-wordmark': 210, 'sha-sticker': 112 }[it[0]])).join('')}
      </div>
    </div>`,
  });

/* 5 */
export const variants = () =>
  page({
    id: 'e-variants', section: 'Logo', name: 'Color variants and clear space', ground: 'night',
    body: `
    ${ehead(C.variants.title, esc(C.variants.note))}
    <div class="e-var">
      <div class="variants__row variants__row--marks">${C.variants.marks.map(A.vtile).join('')}</div>
      <div class="variants__row variants__row--lockups">${C.variants.lockups.map(A.vtile).join('')}</div>
      <div class="e-var__bottom">
        <div class="card e-var__space">
          <div class="space__tile">${A.spaceBox()}</div>
          <p class="caption"><span class="strong">Clear space.</span> ${esc(C.space.clear)}</p>
        </div>
        <div class="card e-var__min">
          <h3 class="ui blockhead">${esc(C.space.minTitle)}</h3>
          ${A.minList()}
        </div>
        <div class="e-var__notes">
          <p class="caption">${C.variants.rules.map(esc).join(' ')}</p>
          <p class="caption">${esc(C.variants.oneColor)}</p>
        </div>
      </div>
    </div>`,
  });

/* 6 */
export const donts = () =>
  page({
    id: 'e-donts', section: 'Logo', name: 'Logo don’ts', ground: 'cream',
    body: `
    ${ehead(C.misuse.title, esc(C.misuse.note))}
    ${A.misuseTiles()}`,
  });

/* 7 */
export const color = () =>
  page({
    id: 'e-color', section: 'Color', name: 'Color palette and pairings', ground: 'cream',
    body: `
    ${ehead(C.palette.title, esc(C.palette.note))}
    <div class="e-col">
      <div class="e-col__primaries">
        ${C.palette.primaries.map(([name, label]) => `<div class="e-col__big bg-${name} c-${B.ON[name]}"><h3 class="h3">${esc(label)}</h3>${B.swatchValues(name)}</div>`).join('')}
      </div>
      <div class="pal__neutrals">
        ${C.palette.neutrals.map(([name, label, role]) => `<div class="pal__n"><div class="pal__chip bg-${name} c-${B.ON[name]}"><span class="ui strong">${esc(label)}</span></div>${B.swatchValues(name)}<p class="caption soft">${esc(role)}</p></div>`).join('')}
      </div>
      <div class="e-col__recipes">${C.pairing.recipes.map(B.recipeTile).join('')}</div>
      <div class="e-col__foot">
        <div>${B.shareBar(false)}</div>
        <ul class="e-col__never">${C.access.never.map((n) => `<li class="caption"><span class="dont caption strong">Don’t</span> ${esc(n)}</li>`).join('')}</ul>
      </div>
      <p class="caption soft">* ${esc(C.palette.cmyk)}</p>
    </div>`,
  });

/* 8 */
export const type = () =>
  page({
    id: 'e-type', section: 'Type', name: 'Typography', ground: 'yolk',
    body: `
    ${ehead(C.typeface.title, esc(C.typeface.note))}
    <div class="e-type">
      <div class="e-type__left">
        <div class="e-type__aa" aria-hidden="true">Aa</div>
        ${C.typeface.weights.map(([a, b]) => `<p class="caption"><span class="strong">${esc(a)}.</span> ${esc(b)}</p>`).join('')}
        <p class="caption">${C.typeface.rules.map(([a, b]) => `<span class="strong">${esc(a)}</span> ${esc(b)}`).join(' ')}</p>
      </div>
      <div class="card e-type__table">
        ${C.scale.styles.map(([cls, name, spec, , use]) => `<div class="e-type__row"><span class="ui strong">${esc(name)}</span><span class="caption">${esc(spec)}</span><span class="caption soft">${esc(use)}</span></div>`).join('')}
      </div>
      <div class="e-type__right">
        <div class="set__ex g-cream"><p class="set__type">${hl(C.setting.ex1)}</p></div>
        <ul class="rules">${C.setting.short.map((r) => `<li class="caption">${esc(r)}</li>`).join('')}</ul>
      </div>
    </div>`,
  });

/* 9 */
export const motifs = () =>
  page({
    id: 'e-motifs', section: 'Motifs', name: 'Motifs', ground: 'paper',
    body: `
    ${ehead(C.motifs.title, esc(C.motifs.note))}
    <div class="e-mot">
      <div class="fam">${C.motifs.all.map(B.motifTile).join('')}</div>
      <div class="e-mot__side">
        <ul class="rules">${C.compose.short.map((r) => `<li class="caption">${esc(r)}</li>`).join('')}</ul>
        <ul class="e-mot__donts">${C.motifDonts.items.map(([, t]) => `<li class="caption"><span class="dont caption strong">Don’t</span> ${esc(t.toLowerCase())}</li>`).join('')}</ul>
      </div>
    </div>`,
  });

/* 10 */
export const photos = () =>
  page({
    id: 'e-photo', section: 'Photography', name: 'Photography', ground: 'tomato',
    body: `
    ${ehead(C.photo.title, esc(C.photo.note))}
    <div class="e-ph">
      <div class="card e-ph__strip">
        ${img('sketches/sketch-02-characters.svg', 'Character sketches for the Ocean gymini', 'e-ph__sketch')}
        <span class="c-tomato">${icon('arrow-right', 26)}</span>
        <div class="e-ph__models">${['model-star-white-dome', 'model-dome-character', 'model-starfish-final'].map((k) => img(`photos/${k}.png`, 'Prototype model')).join('')}</div>
        <span class="c-tomato">${icon('arrow-right', 26)}</span>
        <div class="frame frame--yolk e-ph__shelf">${img('photos/gymini-hero.jpg', 'Treasure the Ocean 2-in-1 Musical Mobile Gymini')}</div>
      </div>
      <div class="e-ph__row">
        <div class="e-ph__rules">
          <ul class="rules">${C.photo.short.map((r) => `<li class="body">${esc(r)}</li>`).join('')}</ul>
          <p class="caption">Show process as a line: sketch, model, shelf. ${esc(C.photo.credit)}</p>
        </div>
        <div class="e-ph__people">
          <div class="frame">${img('photos/portrait.jpg', 'Shiran Bar')}</div>
          <div class="frame">${img('photos/atwork.jpg', 'Shiran Bar at work in a product photoshoot')}</div>
        </div>
        <div class="e-ph__tk">
          <p class="caption">${esc(C.people.rules[0][1])} ${esc(C.people.rules[2][1])}</p>
        </div>
      </div>
    </div>`,
  });

/* 11 */
export const inUse = () =>
  page({
    id: 'e-use', section: 'In use', name: 'Brand in use', ground: 'cream',
    body: `
    ${ehead(C.web.title, esc(C.web.note))}
    <div class="e-use">
      <div class="e-use__web">
        ${D.screenFig(C.web.screens[0])}
        <div class="e-use__two">${D.screenFig(C.web.screens[1])}${D.screenFig(C.web.screens[3])}</div>
      </div>
      <div class="e-use__mid">
        <figure class="scr"><div class="frame">${img('social/sha-og-image.jpg', 'The share image')}</div><figcaption class="caption"><span class="strong">${esc(C.social.og[0])}.</span> <span class="soft">1200 × 630 px.</span></figcaption></figure>
        <div class="e-use__small">
          ${img('kit/icons/avatar-pool-1080.png', 'Avatar on pool')}${img('kit/icons/avatar-cream-1080.png', 'Avatar on cream', 'line')}
          <span class="e-use__sticker bg-pool">${logo('sha-sticker')}</span>
        </div>
        <p class="caption"><span class="strong">Avatars and the die-cut sticker.</span> <span class="soft">The sticker always sits on a color.</span></p>
        <figure class="e-use__sig">${D.sigMock()}<figcaption class="caption"><span class="strong">${esc(C.social.sig[0])}</span> ${D.samplePill}</figcaption></figure>
      </div>
      <div class="e-use__side">
        <div class="card g-night e-use__motion">
          <h3 class="ui blockhead">Motion</h3>
          <p class="caption">${esc(C.motion.short)}</p>
          <div class="mv__frames" data-contrast-demo data-bleed>${D.FRAME_SWEEP}</div>
        </div>
        <div class="card">
          <h3 class="ui blockhead">Layout</h3>
          <p class="caption">${esc(C.layout.short)}</p>
          ${D.radiusRow(true)}
        </div>
      </div>
    </div>`,
  });

/* 12 */
export const assets = () =>
  page({
    id: 'e-back', section: 'Reference', name: 'Assets and contact', ground: 'night',
    body: `
    <div class="cover__shapes" data-bleed>
      ${shape('flower-yellow', 'yolk', 1040, -96, 250)}
      ${shape('heart-red', 'tomato', 372, 86, 124)}
      ${shape('clover-blue', 'pool', 292, 176, 70)}
    </div>
    <div class="e-back">
      <div class="e-back__left">
        <div class="back__logo">${logo('sha-horizontal-paper')}</div>
        <div class="back__main">
          <h2 class="h2 title">${hl(C.back.title)}</h2>
          <p class="lead back__line">${esc(C.back.line)}</p>
          <p class="h3 back__contact">${esc(C.brand.site)}<br>${esc(C.brand.email)}</p>
          <p class="label soft">Brand book  /  ${esc(C.brand.version)}  /  ${esc(C.brand.date)}</p>
        </div>
      </div>
      <div class="e-back__right">
        <div>
          <h3 class="ui blockhead">${esc(C.index.pickTitle)}</h3>
          ${D.pickTable()}
        </div>
        <div>
          <h3 class="ui blockhead">In the kit</h3>
          <ul class="pick">${C.index.folders.map(([a, b]) => `<li><span class="caption strong">${esc(a)}</span><span class="caption">${esc(b)}</span></li>`).join('')}</ul>
        </div>
        <p class="caption soft">${esc(C.index.note)}</p>
      </div>
    </div>`,
  });
