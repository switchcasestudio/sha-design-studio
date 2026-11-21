// Full edition, pages 14 to 26: color, type, motifs, icons, photography.
import * as C from './content.js';
import { esc, hl, head, logo, motif, icon, favicon, img, page, tokens, rgbOf, cmykOf, contrast } from './lib.js';

const T = () => tokens();
const hexOf = (name) => T()[name].toUpperCase();
const rgbText = (name) => rgbOf(hexOf(name)).join(' ');
const cmykText = (name) => {
  const [c, m, y, k] = cmykOf(hexOf(name));
  return `${c} ${m} ${y} ${k}`;
};
// Readable text color on each swatch.
export const ON = { pool: 'paper', yolk: 'ink', tomato: 'ink', cream: 'ink', paper: 'ink', oat: 'ink', sand: 'ink', slate: 'paper', ink: 'paper', night: 'paper' };

/* 14 --------------------------------------------------------------------- */
export const swatchValues = (name) => `
  <dl class="vals caption">
    <div><dt>HEX</dt><dd>${hexOf(name)}</dd></div>
    <div><dt>RGB</dt><dd>${rgbText(name)}</dd></div>
    <div><dt>CMYK*</dt><dd>${cmykText(name)}</dd></div>
    <div><dt>Token</dt><dd>--${name}</dd></div>
  </dl>`;

export const palette = () =>
  page({
    id: 'palette', section: 'Color', name: 'Palette', ground: 'cream',
    body: `
    ${head(C.palette.title, esc(C.palette.note))}
    <div class="pal">
      <div class="pal__primaries">
        ${C.palette.primaries.map(([name, label, role]) => `
        <div class="pal__big bg-${name} c-${ON[name]}">
          <div class="pal__top"><h3 class="h2">${esc(label)}</h3>${swatchValues(name)}</div>
          <p class="body">${esc(role)}</p>
        </div>`).join('')}
      </div>
      <div class="pal__neutrals">
        ${C.palette.neutrals.map(([name, label, role]) => `
        <div class="pal__n">
          <div class="pal__chip bg-${name} c-${ON[name]}"><span class="lead">${esc(label)}</span></div>
          ${swatchValues(name)}
          <p class="caption soft">${esc(role)}</p>
        </div>`).join('')}
      </div>
      <p class="caption soft">* ${esc(C.palette.cmyk)}</p>
    </div>`,
  });

/* 15 --------------------------------------------------------------------- */
export const shareBar = (aligned = true) => `
  <div class="share">
    <div class="share__bar">
      ${C.pairing.share.map(([name, , pct]) => `<span class="bg-${name}" style="flex:${pct}"></span>`).join('')}
    </div>
    <div class="share__labels caption${aligned ? '' : ' share__labels--spread'}">
      ${C.pairing.share.map(([name, label, pct]) => `<span${aligned ? ` style="flex:${pct}"` : ''}><span class="strong">${esc(label)}</span> ${pct}%</span>`).join('')}
    </div>
  </div>`;

export const recipeTile = ([ground, words, block]) => `
  <div class="recipe g-${ground}">
    <p class="recipe__sample">${hl(C.pairing.sample)}</p>
    <p class="caption"><span class="strong">${ground[0].toUpperCase()}${ground.slice(1)}:</span> ${esc(words)}, ${esc(block)}</p>
  </div>`;

export const pairing = () =>
  page({
    id: 'pairing', section: 'Color', name: 'Proportions and pairings', ground: 'paper',
    body: `
    ${head(C.pairing.title, esc(C.pairing.note))}
    <div class="pair">
      <div>
        <h3 class="ui blockhead">${esc(C.pairing.shareTitle)}</h3>
        ${shareBar()}
      </div>
      <div class="pair__recipes">${C.pairing.recipes.map(recipeTile).join('')}
        <div class="recipe recipe--rule"><p class="lead">${esc(C.palette.note)}</p></div>
      </div>
    </div>`,
  });

/* 16 --------------------------------------------------------------------- */
const GROUNDS = ['cream', 'paper', 'oat', 'sand', 'yolk', 'pool', 'tomato', 'night'];
const TEXTS = ['ink', 'slate', 'pool', 'tomato', 'yolk', 'paper'];
const verdict = (r) => (r >= 4.5 ? ['body', 'any size'] : r >= 3 ? ['large', '24 px+'] : ['never', 'never']);

export const matrix = () => `
  <div class="mx">
    <div class="mx__row mx__row--head caption">
      <span></span>${TEXTS.map((t) => `<span>${t[0].toUpperCase()}${t.slice(1)} text</span>`).join('')}
    </div>
    ${GROUNDS.map((g) => `
    <div class="mx__row bg-${g} c-${ON[g]}">
      <span class="ui strong">${g[0].toUpperCase()}${g.slice(1)}</span>
      ${TEXTS.map((t) => {
        if (t === g) return '<span></span>';
        const r = contrast(t, g);
        const [key, word] = verdict(r);
        return `<span class="mx__cell mx__cell--${key}"><span class="mx__aa c-${t}" data-contrast-demo>Aa</span><span class="caption"><span class="strong">${r.toFixed(1)}</span> ${word}</span></span>`;
      }).join('')}
    </div>`).join('')}
  </div>`;

export const access = () =>
  page({
    id: 'access', section: 'Color', name: 'Accessibility', ground: 'cream',
    body: `
    ${head(C.access.title, esc(C.access.note))}
    <div class="acc">
      ${matrix()}
      <div class="acc__side">
        <div>
          <h3 class="ui blockhead">${esc(C.access.neverTitle)}</h3>
          <ul class="rules">${C.access.never.map((n) => `<li class="body">${esc(n)}</li>`).join('')}</ul>
        </div>
        <div class="card acc__focus">
          <span class="pill ui acc__ring">Start a project</span>
          <p class="caption soft">${esc(C.access.focus)}</p>
        </div>
      </div>
    </div>`,
  });

/* 17 --------------------------------------------------------------------- */
export const typeface = () =>
  page({
    id: 'typeface', section: 'Type', name: 'Inter Tight', ground: 'yolk',
    body: `
    ${head(C.typeface.title, esc(C.typeface.note))}
    <div class="tf">
      <div class="tf__aa" aria-hidden="true">Aa</div>
      <div class="tf__main">
        <div>
          <p class="label">${esc(C.typeface.weights[0][0])}  /  ${esc(C.typeface.weights[0][1])}</p>
          <p class="tf__sample">${esc(C.brand.taglinePlain)}</p>
        </div>
        <div>
          <p class="label">${esc(C.typeface.weights[1][0])}  /  ${esc(C.typeface.weights[1][1])}</p>
          <p class="lead tf__regular">${esc(C.who.lead)}</p>
        </div>
        <p class="lead tf__glyphs">${C.typeface.glyphs.map(esc).join('<br>')}</p>
      </div>
    </div>
    <div class="tf__rules">
      ${C.typeface.rules.map(([a, b]) => `<p class="caption"><span class="strong">${esc(a)}</span> ${esc(b)}</p>`).join('')}
    </div>`,
  });

/* 18 --------------------------------------------------------------------- */
const specRow = ([cls, name, spec, sample, use], tone) => `
  <div class="sc__row">
    <div class="sc__meta"><p class="ui strong">${esc(name)}</p><p class="caption soft">${esc(spec)}</p><p class="caption soft">${esc(use)}</p></div>
    <p class="${cls} sc__sample${tone ? ` c-${tone}` : ''}">${esc(sample)}</p>
  </div>`;

export const scale = () => {
  const [hero, display, h2, ...rest] = C.scale.styles;
  return page({
    id: 'scale', section: 'Type', name: 'Scale and hierarchy', ground: 'cream',
    body: `
    ${head(C.scale.title, esc(C.scale.note))}
    <div class="sc">
      <div class="sc__big">${specRow(hero, 'tomato')}${specRow(display, 'tomato')}${specRow(h2, 'pool')}</div>
      <div class="sc__small">${rest.map((s) => specRow(s)).join('')}</div>
    </div>`,
  });
};

/* 19 --------------------------------------------------------------------- */
export const setting = () =>
  page({
    id: 'setting', section: 'Type', name: 'Setting rules', ground: 'tomato',
    body: `
    ${head(C.setting.title)}
    <div class="set">
      <div class="set__cards">
        ${C.setting.blockRules.map(([a, b]) => `<div class="card"><p class="lead">${esc(a)}</p><p class="caption soft">${esc(b)}</p></div>`).join('')}
      </div>
      <div class="set__row">
        <div class="set__ex g-cream"><p class="set__type">${hl(C.setting.ex1)}</p></div>
        <div class="set__ex g-pool"><p class="set__type">${hl(C.setting.ex2)}</p></div>
        <div class="card set__rules">
          <h3 class="ui blockhead">${esc(C.setting.rulesTitle)}</h3>
          <ul class="rules">${C.setting.rules.map((r) => `<li class="caption">${esc(r)}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`,
  });

/* 20 --------------------------------------------------------------------- */
export const motifTile = ([name, color]) => `
  <figure class="mt">
    <div class="mt__art c-${color}">${motif(name)}</div>
    <figcaption><span class="caption strong">${esc(name)}</span><span class="caption soft">${esc(color)}</span></figcaption>
  </figure>`;

export const family = () =>
  page({
    id: 'family', section: 'Motifs', name: 'The family of 14', ground: 'paper',
    body: `
    ${head(C.motifs.title, esc(C.motifs.note))}
    <div class="fam">${C.motifs.all.map(motifTile).join('')}</div>`,
  });

/* 21 --------------------------------------------------------------------- */
const m = (name, color, style) => `<span class="c-${color}" style="position:absolute;${style}">${motif(name)}</span>`;

export const COMPOSE_ART = [
  // big in the corners, small in between, the middle clear
  `<div class="demo g-cream">
     ${m('blob-blue', 'pool', 'left:4%;top:8%;width:17%')}${m('flower-yellow', 'yolk', 'right:4%;top:8%;width:18%')}
     ${m('splat-red', 'tomato', 'right:5%;bottom:8%;width:17%')}${m('heart-red', 'yolk', 'left:5%;bottom:8%;width:15%')}
     ${m('daisy-yellow', 'tomato', 'left:27%;top:14%;width:8%')}${m('star-blue', 'pool', 'right:27%;top:16%;width:7%')}
     ${m('ring-blue', 'pool', 'left:30%;bottom:12%;width:6%')}${m('tulip-yellow', 'tomato', 'right:30%;bottom:10%;width:7%')}
     <span class="demo__line bg-tomato" style="left:36%;top:40%;width:28%"></span><span class="demo__line bg-pool" style="left:40%;top:54%;width:20%"></span>
   </div>`,
  // one oversized shape, cropped by the corner
  `<div class="demo g-yolk" data-bleed>
     ${m('clover-blue', 'pool', 'left:-9%;bottom:-38%;width:42%')}
     <span class="demo__line bg-pool" style="left:44%;top:22%;width:40%"></span>
     <span class="demo__text bg-ink" style="left:44%;top:46%;width:46%"></span><span class="demo__text bg-ink" style="left:44%;top:57%;width:42%"></span><span class="demo__text bg-ink" style="left:44%;top:68%;width:30%"></span>
   </div>`,
  // never on its own color
  `<div class="demo demo--four">
     <span class="bg-pool c-yolk">${motif('daisy-yellow')}</span><span class="bg-yolk c-pool">${motif('star-blue')}</span>
     <span class="bg-paper c-tomato">${motif('heart-red')}</span><span class="bg-tomato c-paper">${motif('flower-red')}</span>
   </div>`,
  // level
  `<div class="demo g-paper demo--level">
     <span class="c-tomato">${motif('coral-red')}</span><span class="c-yolk">${motif('tulip-yellow')}</span><span class="c-pool">${motif('ring-blue')}</span>
     <i class="demo__base"></i>
   </div>`,
];

export const compose = () =>
  page({
    id: 'compose', section: 'Motifs', name: 'Composition', ground: 'pool',
    body: `
    ${head(C.compose.title, esc(C.compose.note))}
    <div class="comp">
      ${C.compose.rules.map(([a, b], i) => `
      <div class="card comp__card">${COMPOSE_ART[i]}<div><p class="lead">${esc(a)}</p><p class="caption soft">${esc(b)}</p></div></div>`).join('')}
    </div>`,
  });

/* 22 --------------------------------------------------------------------- */
const MOTIF_DONT_ART = {
  own: () => `<span class="md-shape md-ghost c-yolk">${motif('daisy-yellow')}</span>`,
  outline: () => `<span class="md-shape md-outline c-pool">${motif('star-blue')}</span>`,
  stretch: () => `<span class="md-shape md-stretch c-tomato">${motif('blob-red')}</span>`,
  tile: () => `<span class="md-tile">${Array.from({ length: 24 }, (_, i) => `<i class="c-${['pool', 'tomato', 'yolk'][i % 3]}">${motif(['star-blue', 'heart-red', 'daisy-yellow'][i % 3])}</i>`).join('')}</span>`,
  button: () => `<span class="pill pill--yolk ui md-button"><i class="c-tomato">${motif('heart-red')}</i>Start a project</span>`,
  photo: () => `<span class="md-photo">${img('photos/sorter.jpg', '')}<i class="c-pool">${motif('splat-blue')}</i></span>`,
};
const MOTIF_DONT_TILE = { own: 'yolk' };

export const motifDontTiles = (keys) => `
    <div class="donts donts--${keys ? keys.length : 3}">
      ${C.motifDonts.items.filter(([k]) => !keys || keys.includes(k)).map(([key, text]) => `
      <figure class="dont-tile${MOTIF_DONT_TILE[key] ? ` dont-tile--${MOTIF_DONT_TILE[key]}` : ''}">
        <div class="dont-tile__art" data-contrast-demo data-bleed>${MOTIF_DONT_ART[key]()}</div>
        <figcaption class="dont-tile__cap"><span class="dont caption strong">Don’t</span><span class="ui">${esc(text)}</span></figcaption>
      </figure>`).join('')}
    </div>`;

export const motifDonts = () =>
  page({
    id: 'mdonts', section: 'Motifs', name: 'Don’ts', ground: 'cream',
    body: `
    ${head(C.motifDonts.title, esc(C.motifDonts.note))}
    ${motifDontTiles()}`,
  });

/* 23 --------------------------------------------------------------------- */
const ICON_TILES = [['arrow-right', 'oat', 'ink'], ['mail', 'cream', 'ink'], ['instagram', 'pool', 'paper'], ['menu', 'yolk', 'ink'], ['x', 'tomato', 'ink'], ['plus', 'night', 'paper']];

export const iconRow = (names = true) =>
  `<div class="ic__row">${ICON_TILES.map(([n, bg, fg]) => `<span class="ic__one"><span class="ic__tile bg-${bg} c-${fg}">${icon(n, 26)}</span>${names ? `<span class="caption soft">${n}</span>` : ''}</span>`).join('')}</div>`;

export const icons = () =>
  page({
    id: 'icons', section: 'Icons', name: 'Icons, app icons and avatars', ground: 'sand',
    body: `
    ${head(C.icons.title)}
    <div class="ic">
      <div class="card ic__card">
        <h3 class="lead">${esc(C.icons.uiTitle)}</h3>
        ${iconRow()}
        <ul class="rules">${C.icons.ui.map((r) => `<li class="body">${esc(r)}</li>`).join('')}</ul>
        <div class="ic__live">
          <span class="pill ui ic__mail">${icon('mail', 20)}${esc(C.brand.email)}</span>
          <span class="ic__social bg-night c-paper">${icon('instagram', 20)}${icon('mail', 20)}</span>
          <p class="caption soft">On the site: the email pill on the Inquire page, and the footer links on night.</p>
        </div>
      </div>
      <div class="card ic__card">
        <h3 class="lead">${esc(C.icons.appTitle)}</h3>
        <div class="ic__apps">
          <span class="ic__tab">${favicon('ic__fav')}<span class="ui">Sha Design Studio</span></span>
          ${img('kit/icons/apple-touch-icon.png', 'App icon', 'ic__app')}
          ${img('kit/icons/avatar-pool-1080.png', 'Avatar on pool', 'ic__avatar')}
          ${img('kit/icons/avatar-cream-1080.png', 'Avatar on cream', 'ic__avatar ic__avatar--line')}
        </div>
        <ul class="ic__files">${C.icons.app.map(([a, b]) => `<li><span class="caption strong">${esc(a)}</span><span class="caption soft">${esc(b)}</span></li>`).join('')}</ul>
      </div>
    </div>`,
  });

/* 24 --------------------------------------------------------------------- */
export const photo = () =>
  page({
    id: 'photo', section: 'Photography', name: 'Product photos', ground: 'yolk',
    body: `
    ${head(C.photo.title, esc(C.photo.note))}
    <div class="ph">
      <div class="ph__photos">
        <figure class="frame ph__wide">${img('photos/wooden-cover.jpg', 'The wooden toy collection lined up together')}<span class="pill pill--paper pill--sm label ph__badge">Wooden toys</span></figure>
        <figure class="frame">${img('photos/gymini-hero.jpg', 'Treasure the Ocean play gym on white')}<span class="pill pill--paper pill--sm label ph__badge">Play gym</span></figure>
        <figure class="frame">${img('photos/sorter.jpg', 'Tiny Rockers shape sorter on white')}<span class="pill pill--paper pill--sm label ph__badge">Shape sorter</span></figure>
      </div>
      <div class="ph__side">
        <ul class="rules">${C.photo.rules.map(([a, b]) => `<li class="body"><span class="strong">${esc(a)}.</span> ${esc(b)}</li>`).join('')}</ul>
        <p class="caption">${esc(C.photo.credit)}</p>
      </div>
    </div>`,
  });

/* 25 --------------------------------------------------------------------- */
const STAGES = [
  ['sketch-01-form-studies.svg', ['model-ringed-planet', 'model-dotted-disc']],
  ['sketch-02-characters.svg', ['model-star-white-dome', 'model-dome-character']],
  ['sketch-03-starfish.svg', ['model-starfish-dotted', 'model-starfish-final']],
];

export const process = () =>
  page({
    id: 'process', section: 'Photography', name: 'Process: sketch, model, shelf', ground: 'tomato',
    body: `
    ${head(C.process.title, esc(C.process.note))}
    <div class="card pr">
      <div class="pr__stages">
        ${C.process.stages.map(([title, line], i) => `
        <div class="pr__stage">
          <div><p class="label soft">Stage 0${i + 1}</p><p class="lead">${esc(title)}</p><p class="caption soft">${esc(line)}</p></div>
          ${img(`sketches/${STAGES[i][0]}`, `Sketch sheet for ${title}`, 'pr__sketch')}
          <div class="pr__models">${STAGES[i][1].map((k) => img(`photos/${k}.png`, 'Prototype model')).join('')}</div>
        </div>`).join('')}
      </div>
      <div class="pr__shelf">
        <span class="pr__arrow c-tomato">${icon('arrow-right', 28)}</span>
        <div class="frame frame--yolk">${img('photos/gymini-hero.jpg', 'Treasure the Ocean 2-in-1 Musical Mobile Gymini')}</div>
        <p class="lead">${esc(C.process.shelf[0])}</p>
        <p class="caption soft">${esc(C.process.shelf[1])}</p>
        <p class="caption soft">${esc(C.process.credit)}</p>
      </div>
    </div>`,
  });

/* 26 --------------------------------------------------------------------- */
export const people = () =>
  page({
    id: 'people', section: 'Photography', name: 'People', ground: 'paper',
    body: `
    ${head(C.people.title, esc(C.people.note))}
    <div class="pp">
      <figure class="pp__fig pp__fig--portrait"><div class="frame card--cream">${img('photos/portrait.jpg', 'Shiran Bar')}</div><figcaption class="caption soft">${esc(C.people.captions[0])}</figcaption></figure>
      <figure class="pp__fig pp__fig--work"><div class="frame card--cream">${img('photos/atwork.jpg', 'Shiran Bar at work in a product photoshoot')}</div><figcaption class="caption soft">${esc(C.people.captions[1])}</figcaption></figure>
      <div class="pp__side">
        <ul class="rules">${C.people.rules.map(([a, b]) => `<li class="body"><span class="strong">${esc(a)}.</span> ${esc(b)}</li>`).join('')}</ul>
      </div>
    </div>`,
  });
