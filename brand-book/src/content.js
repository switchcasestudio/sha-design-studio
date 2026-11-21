// One content file for both editions. The Full edition reads every field.
// The Essentials edition reads the same records and prefers `short` where a
// record has one, so the two books cannot say different things.
//
// Sources: Sha-Brand-Kit (README, tokens, guide), PRODUCT.md, the live site
// (src/pages, src/data, siteConfig) and the non-conflicting parts of
// BRAND_GUIDELINES.md. See brand-book/AUDIT.md and DECISIONS.md.
// Titles are [before, block, after]: exactly one phrase sits in the block.

export const brand = {
  name: 'Sha Design Studio',
  designer: 'Shiran Bar',
  descriptor: 'Industrial design',
  tagline: ['Designing ', 'thoughtful', ' products'],
  taglinePlain: 'Designing thoughtful products',
  promise: 'Simple, smart, and full of wonder',
  site: 'sha-design.com',
  email: 'hayonshiran@gmail.com',
  version: 'Kit version 3',
  date: 'November 2026',
};

export const sections = {
  Welcome: 'Cover, contents, how to use the book',
  Brand: 'Who Shiran is and what the studio is for',
  Voice: 'How Sha sounds in writing',
  Logo: 'The mark, the lockups and their rules',
  Color: 'Three primaries and seven neutrals',
  Type: 'Inter Tight in two weights',
  Motifs: 'Fourteen flat shapes',
  Icons: 'Interface icons, app icons, avatars',
  Photography: 'Products, process, people',
  Layout: 'Panels, spacing, corners',
  Components: 'Pills, buttons, badges, cards',
  Motion: 'How things move',
  'In use': 'Website, social, print',
  Clients: 'Brands Shiran has worked with',
  Reference: 'File index and contact',
};

export const hello = {
  title: ['Start ', 'here', ''],
  intro:
    'This book is for anyone making something with the Sha name on it: a printer, a vendor, a new collaborator. The rules are here. The files are in the brand kit folder, and page 34 lists every one.',
  short:
    'For anyone making something with the Sha name on it. The rules are here; the files are in the brand kit folder.',
  rulesTitle: 'Five rules to remember',
  rules: [
    'One panel color and one highlight color per section.',
    'Headlines are in color, with exactly one phrase in a solid block.',
    'Inter Tight only: 500 for headlines and UI, 400 for text. No bold.',
    'No black, no shadows, no gradients. Everything you click is a pill.',
    'Never put tomato letters on yolk or yolk letters on tomato.',
  ],
  editionsTitle: 'Two editions',
  editions: [
    ['Full, 35 pages', 'The complete reference. Keep it with the kit.'],
    ['Essentials, 12 pages', 'The one to send to a printer or a vendor.'],
  ],
};

export const who = {
  title: ['The designer behind ', 'Sha', ''],
  lead: 'Sha Design Studio is Shiran Bar, an industrial designer who specializes in toys and baby products.',
  bio: [
    'She graduated from Shenkar College, interned at HAPE in China, and worked at Tiny Love on baby products that ranged from soft toys to electronic developmental items.',
    'She takes freelance projects, creative collaborations and contract work.',
  ],
  quote:
    'I’m inspired by the beautiful simplicity of babies: their curiosity, instinct to play, and unfiltered reactions.',
  quoteBy: 'Shiran Bar, on the About page',
  roadTitle: 'The road to the studio',
  road: [
    ['daisy-yellow', 'yolk', 'Shenkar College', 'B.Des Industrial Design'],
    ['clover-blue', 'pool', 'HAPE, China', 'Toy-design internship'],
    ['heart-red', 'tomato', 'Tiny Love', '5 years, 10+ products shipped'],
    ['star-blue', 'yolk', 'Sha Design Studio', 'Her own practice'],
  ],
  short:
    'Sha Design Studio is Shiran Bar, an industrial designer who specializes in toys and baby products. She trained at Shenkar College, interned at HAPE in China and spent five years at Tiny Love. She now takes freelance and contract work.',
};

export const idea = {
  title: brand.tagline,
  promiseLabel: 'The promise',
  doesLabel: 'What the studio does',
  does: 'The studio helps brands, startups and entrepreneurs turn an idea into a product. A project can run from research and concept through product design, 3D visualization and development support.',
  forLabel: 'Who hires it',
  for: [
    'Toy and baby-product brands looking for freelance industrial design',
    'Studios and agencies that need contract design support',
    'Parent brands launching a new product line',
    'Collaborators in neighboring fields',
  ],
  testLabel: 'What people come to check',
  test: 'Is the work real, is it shipped, and is it right for babies? Anything made under the Sha name should help them answer yes.',
};

export const personality = {
  title: ['Loud color, ', 'quiet type', ', nothing childish'],
  traits: [
    ['Warm', 'The audience is parents, designers and brands that care about babies. Be human first.'],
    ['Confident', 'Shiran trained at Shenkar and worked at HAPE and Tiny Love. Say so plainly.'],
    ['Playful, not cute', 'Toys are the subject, so the brand can play. It never uses baby talk.'],
    ['Specific', '“Soft toys and electronic developmental items” beats “all kinds of products.”'],
  ],
  principlesTitle: 'Three principles',
  principles: [
    ['The work is the hero', 'Real shipped products, photographed, one click from their case study.'],
    ['One dominant accent per section', 'Each section is clearly one of cream, tomato, yolk, pool or night.'],
    ['Playful means specific', 'Curiosity, giggles, factory floors: concrete details over generic delight.'],
  ],
};

export const voice = {
  title: ['Short, plain, ', 'warm', ''],
  sounds:
    'Sha sounds like a designer explaining her work to a parent at the playground: specific, friendly, never selling.',
  rules: [
    'Write short, plain sentences. Name the object and who holds it.',
    'Use sentence case for headlines, pills and buttons. Lowercase only in the footer.',
    'Start buttons with a verb: “Start a project”, “Explore my services”, “View case study”.',
    'Set leads in two tones: the main phrase in ink, the rest in slate.',
    'No emoji, no exclamation marks, no bold.',
  ],
  toneTitle: 'Tone by place',
  tone: [
    ['Home and About', 'Inviting, personal, first person'],
    ['Services', 'Direct and business-like, still warm'],
    ['Project pages', 'A story, rooted in what the design is for'],
    ['Buttons', 'Active, low effort: “Let’s chat”'],
    ['Form labels', 'Plain: “Email”, “Message”'],
  ],
  useTitle: 'Words Sha uses',
  use: ['play', 'curiosity', 'wonder', 'simple', 'smart', 'thoughtful', 'intuitive', 'sensitivity', 'precision', 'spark joy', 'inspire', 'empower'],
  avoidTitle: 'Words Sha avoids',
  avoid: ['solutions', 'leverage', 'disrupt', 'innovative', 'cutting-edge', 'synergy', 'adorable', 'cutesy', 'bestie'],
};

export const voiceExamples = {
  title: ['Say it ', 'like this', ''],
  note: 'The left column is live on sha-design.com. The right column is what to steer away from.',
  pairs: [
    ['Headline', 'Designing thoughtful products', 'Innovative Design Solutions For Modern Families!'],
    ['Button', 'Start a project', 'Click here to submit your inquiry'],
    ['Lead', 'Toys, baby gear and the boxes they arrive in', 'We leverage cutting-edge methodologies to deliver best-in-class products.'],
    ['Footer', 'work · services · about · inquire', 'WORK | SERVICES | ABOUT | CONTACT US'],
  ],
  liveTitle: 'More lines from the live site',
  live: [
    ['This page wandered off to play', 'The 404 page'],
    ['Got a product itching to exist?', 'The end of the Services page'],
    ['Let’s make something together', 'The Inquire page'],
    ['Psst: everything here can be picked up.', 'A hint under the 404'],
  ],
};

export const mark = {
  title: ['One mark, ', 'four parts', ''],
  note: 'The mark carries the brand. Use it alone wherever space is tight: the nav, the favicon, an avatar.',
  parts: [
    ['Body', 'Pool', 'The large shape. It turns paper on pool and on tomato.'],
    ['Top dot', 'Tomato', 'Its height is the unit for clear space.'],
    ['Left dot', 'Yolk', 'It turns paper on yolk.'],
    ['Dash', 'Tomato', 'A short bar under the body.'],
  ],
  rule: 'On cream and paper the mark is always these four parts in these four colors.',
  file: 'logos/svg/sha-mark.svg',
};

export const lockups = {
  title: ['Five pieces, ', 'one family', ''],
  note: 'Every piece comes as outlined SVG and 1200 px PNG in logos/. The mark carries the brand; the lockups add the name.',
  items: [
    ['sha-horizontal', 'Horizontal lockup', 'Wide headers, email signatures, decks.'],
    ['sha-stacked', 'Stacked lockup', 'Square formats, the About page, cards.'],
    ['sha-wordmark', 'Wordmark', 'When the mark is already nearby.'],
    ['sha-sticker', 'Die-cut sticker', 'Merch and packaging seals. Always on a color.'],
  ],
  descriptor: 'Each lockup carries the descriptor “Industrial design” under the name. Don’t retype it; use the file.',
};

export const variants = {
  title: ['A coat for ', 'every ground', ''],
  note: 'The mark changes its coat for each ground. Pick the file named for the color it sits on, and never move a version onto another color.',
  // [file, ground class, label]
  marks: [
    ['sha-mark', 'cream', 'Full color, on cream and paper'],
    ['sha-mark-on-pool', 'pool', 'On pool'],
    ['sha-mark-on-tomato', 'tomato', 'On tomato'],
    ['sha-mark-on-yolk', 'yolk', 'On yolk'],
    ['sha-mark-paper', 'night', 'One color, on night and photos'],
    ['sha-mark-ink', 'paper', 'One color, single-ink print'],
    ['sha-mark-pool', 'paper', 'Pool only, on cream, paper or yolk'],
    ['sha-mark-tomato', 'paper', 'Tomato only, on cream, paper or night'],
    ['sha-mark-yolk', 'night', 'Yolk only, on pool or night'],
  ],
  lockups: [
    ['sha-horizontal', 'cream', 'Horizontal'],
    ['sha-horizontal-paper', 'pool', 'Horizontal, paper'],
    ['sha-stacked', 'paper', 'Stacked'],
    ['sha-stacked-paper', 'tomato', 'Stacked, paper'],
    ['sha-wordmark', 'cream', 'Wordmark'],
    ['sha-wordmark-paper', 'night', 'Wordmark, paper'],
    ['sha-sticker', 'pool', 'Sticker'],
  ],
  rules: [
    'On pool and tomato the body turns paper. On yolk it stays pool with a paper left dot.',
    'One-color paper goes on night and on photos. One-color ink is for single-ink print.',
  ],
  oneColor:
    'Full color is the first choice. Use a pool-only, tomato-only or yolk-only mark when a piece can carry just one color besides its ground: a one-color print, a stamp or an engraving, or a panel that already has its panel color and its highlight color.',
  exception:
    'The website also shows an ink-bodied mark on yolk pages. That file is not in the kit. For anything outside the site, use sha-mark-on-yolk.',
};

export const space = {
  title: ['Give it room, ', 'keep it whole', ''],
  clear: 'Keep an empty margin of x on every side, where x is the height of the mark’s top dot. Lockups use the same x.',
  minTitle: 'Minimum sizes',
  // [file, name, screen, print]
  min: [
    ['sha-mark', 'Sha mark', '20 px tall', '6 mm'],
    ['sha-horizontal', 'Horizontal lockup', '160 px wide', '40 mm'],
    ['sha-stacked', 'Stacked lockup', '120 px wide', '30 mm'],
    ['sha-wordmark', 'Wordmark', '120 px wide', '30 mm'],
    ['sha-sticker', 'Die-cut sticker', '48 px tall', '15 mm'],
  ],
  below: 'Below these sizes the dots and the dash fill in. Use the mark alone when space is tight.',
};

export const misuse = {
  title: ['Eight ways to ', 'get it wrong', ''],
  note: 'Each tile shows the real mark, broken on purpose.',
  items: [
    ['stretch', 'Stretch or squash it'],
    ['rotate', 'Rotate it'],
    ['swap', 'Swap the colors around'],
    ['black', 'Set it in black'],
    ['outline', 'Add an outline or a shadow'],
    ['onpool', 'Use full color on pool'],
    ['wrongcoat', 'Move a version to another ground'],
    ['crowd', 'Crowd it'],
  ],
};

export const palette = {
  title: ['Three primaries ', 'take turns', ''],
  note: 'One panel color and one highlight color per section. Never a fourth loud color in the same panel.',
  // roles are the kit's own wording
  primaries: [
    ['pool', 'Pool', 'Leads the rotation. The About page, highlight blocks on cream and tomato, the capsule hover.'],
    ['yolk', 'Yolk', 'The Services page and covers. Highlight blocks on pool, project frames, the default capsule.'],
    ['tomato', 'Tomato', 'The Work page, the Inquire pill, headline words on cream. The loudest of the three, so it gets the least space.'],
  ],
  neutralsTitle: ['Warm neutrals, ', 'no black', ''],
  neutrals: [
    ['cream', 'Cream', 'Page canvas.'],
    ['paper', 'Paper', 'Cards and frames on color.'],
    ['oat', 'Oat', 'Pills, inputs, light panels.'],
    ['sand', 'Sand', 'Closing panels.'],
    ['slate', 'Slate', 'Secondary text.'],
    ['ink', 'Ink', 'All running text. Never black.'],
    ['night', 'Night', 'Footer, dark pages.'],
  ],
  cmyk: 'CMYK values are converted from the screen colors and are approximate. They are not color-managed. Ask your printer for a proof before a run.',
};

export const pairing = {
  title: ['One panel color, ', 'one highlight', ''],
  note: 'Each ground has one recipe: the color the headline takes and the color of the block behind one phrase.',
  shareTitle: 'Share of color down a full page, as the kit sets it',
  share: [
    ['cream', 'Cream', 28],
    ['pool', 'Pool', 24],
    ['yolk', 'Yolk', 20],
    ['tomato', 'Tomato', 16],
    ['paper', 'Paper', 8],
    ['night', 'Night', 4],
  ],
  // [ground, words, block, letters in the block, running text]
  recipes: [
    ['cream', 'tomato words', 'pool block'],
    ['paper', 'pool words', 'tomato block'],
    ['yolk', 'pool words', 'tomato block'],
    ['pool', 'paper words', 'yolk block'],
    ['tomato', 'paper words', 'pool block'],
    ['sand', 'pool words', 'tomato block'],
    ['night', 'paper words', 'yolk block'],
  ],
  sample: ['Selected ', 'work', ''],
};

export const access = {
  title: ['Pairings that ', 'pass', ''],
  note: 'Ratios are WCAG 2. Body text needs 4.5:1. Text at 24 px and up needs 3:1.',
  legend: [
    ['body', 'Any size'],
    ['large', '24 px and up only'],
    ['never', 'Never for text'],
  ],
  neverTitle: 'Three pairs to stay away from',
  never: [
    'Tomato letters on yolk, or yolk letters on tomato: 2.2:1.',
    'Ink on pool: 3.2:1. Use paper on pool.',
    'Slate on any color panel. Slate is for cream, paper and oat.',
  ],
  focus: 'Keyboard focus is a 3 px solid ink ring. On night the ring is paper, and the site uses paper on pool too.',
};

export const typeface = {
  title: ['One family, ', 'two weights', ''],
  note: 'Inter Tight is free under the SIL Open Font License. Desktop files and web files are in fonts/.',
  weights: [
    ['Medium 500', 'Headlines, leads, UI'],
    ['Regular 400', 'Running text'],
  ],
  rules: [
    ['Size and color make the hierarchy.', 'Never bold, never italic for emphasis.'],
    ['Install the two TTFs', 'before opening any design file.'],
    ['Retired: Bagel Fat One and Fredoka.', 'Don’t load either.'],
  ],
  glyphs: ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789 & ? ! . , : ; ’ “ ” · $ € %'],
};

export const scale = {
  title: ['Size and color, ', 'never bold', ''],
  note: 'Sizes are for desktop. On small screens display type scales down: hero to 56 px, display to 44 px, H2 to 34 px.',
  // [class, name, spec, sample, use]
  styles: [
    ['hero', 'Hero', '128 / 0.90, −5%, 500', 'Sha Design', 'The wordmark and the Home hero only'],
    ['display', 'Display', '96 / 1.00, −4.5%, 500', 'Design services', 'Page-opening headlines, always in color'],
    ['h2', 'H2', '64 / 1.04, −3.5%, 500', 'Areas of expertise', 'Section headlines on panels, always in color'],
    ['h3', 'H3', '28 / 1.10, −2%, 500', 'Treasure the Ocean', 'Project titles and card headings'],
    ['lead', 'Lead', '22 / 1.30, −1%, 500', 'Toys, baby gear and the boxes they arrive in', 'Card copy and intros'],
    ['body', 'Body', '16 / 1.50, −0.5%, 400', 'Hi there, I’m Shiran Bar, an industrial designer specializing in toys and baby products.', 'Running text'],
    ['ui', 'UI', '14 / 1.00, 500', 'Work · Services · About · Inquire', 'Pills, buttons, nav'],
    ['label', 'Label', '12 / 1.30, +6%, 500, caps', 'Brands I’ve worked with', 'Card tags'],
    ['caption', 'Caption', '13 / 1.45, 400', 'Model of a ringed planet: stacked rings on a sphere.', 'Captions and helper text'],
    ['footer', 'Footer', '12 / 1.70, 400, lowercase', 'work · services · about · inquire', 'Footer links'],
  ],
};

export const setting = {
  title: ['One phrase, ', 'one block', ''],
  blockRules: [
    ['Split it', 'Break the headline into two or three parts: “Designing / thoughtful / products”.'],
    ['Block one part', 'Exactly one part gets a solid, nearly square block. Pick the phrase that carries the feeling, and keep it to three words or fewer.'],
    ['Keep the face', 'The block keeps the headline’s size and weight. Only the block and the letter color change.'],
  ],
  rulesTitle: 'Setting type',
  rules: [
    'Tighten tracking as type grows: −5% at hero size, −4.5% at display, −3.5% at H2. Body sits at −0.5%.',
    'Keep body lines near 65 characters.',
    'Sentence case for everything. Lowercase in the footer. Capitals for 12 px labels only, tracked +6%.',
    'Two-tone leads on paper, cream or oat: the main phrase in ink, the rest in slate.',
  ],
  ex1: ['Designed for ', 'small hands', ''],
  ex2: ['Let’s make ', 'something', ' together'],
  short: [
    'Exactly one phrase per headline sits in a solid block. The block keeps the headline’s size and weight.',
    'Tracking tightens as type grows. Keep body lines near 65 characters.',
    'Sentence case, with lowercase in the footer and capitals for 12 px labels only.',
    'Hierarchy comes from size and color. Bold and italic are not used.',
  ],
};

export const motifs = {
  title: ['Shapes you could ', 'pick up', ''],
  note: 'Fourteen shapes in motifs/, each as SVG and PNG. The color is in the file name: blue is pool, red is tomato, yellow is yolk.',
  // file name -> color token
  all: [
    ['blob-blue', 'pool'], ['clover-blue', 'pool'], ['ring-blue', 'pool'], ['splat-blue', 'pool'], ['star-blue', 'pool'],
    ['blob-red', 'tomato'], ['coral-red', 'tomato'], ['flower-red', 'tomato'], ['heart-red', 'tomato'], ['splat-red', 'tomato'],
    ['blob-yellow', 'yolk'], ['daisy-yellow', 'yolk'], ['flower-yellow', 'yolk'], ['tulip-yellow', 'yolk'],
  ],
};

export const compose = {
  title: ['Where the ', 'shapes go', ''],
  note: 'Shapes are illustration. They frame the type and the work, and they stay out of the way of both.',
  rules: [
    ['Big in the corners, small in between', 'On the home page the corner shapes are about twice the size of the ones between them, and the middle stays clear for the headline. Twelve shapes on a desktop screen, four on a phone.'],
    ['Let one run off the edge', 'One oversized shape can sit behind the text, cropped by the corner of a panel so that half of it is hidden.'],
    ['Never on its own color', 'Yolk shapes go on pool, paper or cream. Pool shapes on yolk, paper or cream. Tomato shapes on yolk, paper or cream. On pool or tomato a shape may also be paper.'],
    ['Keep them level', 'Shapes sit straight. Nothing rests at a tilt.'],
  ],
  short: [
    'Big in the corners, small in between. Leave the middle clear for the headline.',
    'One oversized shape may run off the corner of a panel.',
    'Never on its own color. On pool or tomato a shape may be paper.',
    'Shapes sit level, with one flat fill.',
  ],
};

export const motifDonts = {
  title: ['Keep the shapes ', 'simple', ''],
  note: 'Each shape is one primary at full strength: no outlines, gradients, shadows or second colors.',
  items: [
    ['own', 'Put a shape on its own color'],
    ['outline', 'Outline it or give it two colors'],
    ['stretch', 'Stretch it'],
    ['tile', 'Tile shapes into a pattern'],
    ['button', 'Put one inside a button'],
    ['photo', 'Cover a product photo'],
  ],
};

export const icons = {
  title: ['Icons and ', 'app icons', ''],
  uiTitle: 'Interface icons',
  ui: [
    'Icons come from Lucide: 2 px stroke, 20 to 24 px.',
    'They follow the text rules: ink on light grounds, paper on pool and night.',
    'Motifs are never icons, and no emoji.',
  ],
  appTitle: 'App icons and avatars',
  app: [
    ['favicon.svg', 'Browser tab'],
    ['favicon-32.png', 'Tab fallback, 32 px'],
    ['apple-touch-icon.png', 'iOS home screen, 180 px'],
    ['icon-192.png, icon-512.png', 'Android'],
    ['avatar-pool-1080.png', 'Social avatar on pool'],
    ['avatar-cream-1080.png', 'Social avatar on cream'],
  ],
};

export const photo = {
  title: ['Show the ', 'whole product', ''],
  note: 'These rules cover how a photo is placed on a page.',
  rules: [
    ['Frame it', 'A photo sits in a paper or yolk frame with 16 px corners.'],
    ['Show all of it', 'Keep the whole product in the picture. Don’t crop into it.'],
    ['Lead with the clean shot', 'A product on white comes first. Lifestyle photos follow.'],
    ['Label it quietly', 'Name the work in a paper pill with a 12 px ink label.'],
    ['Keep it clear', 'Shapes and type stay off the product.'],
  ],
  credit: 'Product photos: Tiny Love.',
  short: [
    'Paper or yolk frame, 16 px corners.',
    'The whole product, uncropped. Clean shot on white first.',
    'Label in a paper pill. Shapes and type stay off the product.',
  ],
};

export const process = {
  title: ['Sketch, model, ', 'shelf', ''],
  note: 'Show process as a line: the drawing first, then the models built from it, then the product. Sketches are redrawn in ink so they stay sharp at any size. Models are cut out and set on paper.',
  stages: [
    ['Initial form studies', 'Early studies explored simple geometric forms and a suspended mobile structure.'],
    ['Character & material', 'Combining a molded plastic head with soft fabric elements.'],
    ['Starfish direction', 'Form, character and interaction evolve together.'],
  ],
  shelf: ['On the shelf', 'Treasure the Ocean 2-in-1 Musical Mobile Gymini, designed for Tiny Love.'],
  credit: 'Stage titles and lines are Shiran’s. Product photo: Tiny Love.',
};

export const people = {
  title: ['Shiran, ', 'at work', ''],
  note: 'The two photos of Shiran: a portrait, and one of her setting up a product shoot.',
  rules: [
    ['Use a plain frame', 'A person’s photo goes in a paper frame, like the work.'],
    ['The Hello flower', 'On the About page a yolk flower with “Hello” sits on the corner of the portrait.'],
    ['Show the work too', 'When there is a choice, pick the photo with products in it.'],
  ],
  captions: ['Portrait, About page', 'At a product photoshoot, Home page'],
};

export const layout = {
  title: ['Panels, ', 'not lines', ''],
  note: 'Every page is a stack of rounded color panels inset from the window. Layers separate by color alone.',
  spacingTitle: 'Spacing, px',
  spacing: [
    ['gap-pill', 4, 'Between pills'],
    ['gap-grid', 10, 'Between cards on a panel'],
    ['gutter', 16, 'Panel inset, and the gap between panels'],
    ['pad-card', 22, 'Inside a paper card'],
    ['gap-block', 36, 'Between headline and content'],
    ['pad-panel', 72, 'Inside a panel on desktop'],
  ],
  radiusTitle: 'Corners, px',
  radius: [
    ['radius-frame', 16, 'Photo frames'],
    ['radius-card', 18, 'Paper cards'],
    ['radius-panel', 24, 'Color panels'],
    ['radius-pill', 999, 'Anything you click'],
  ],
  rule: 'Everything you click is a pill. Gaps come from grid and flex gap, never from margins on single elements.',
  short: 'Pages are rounded color panels inset 16 px from the edge, 24 px corners. Cards 18, photo frames 16, and anything you click is a pill.',
};

export const components = {
  title: ['Built from ', 'pills and panels', ''],
  note: 'These are the pieces you’ll meet first on the site. Sizes are in px.',
  nav: ['Floating nav', 'No bar background. The mark takes the page’s colorway. The active page is ink. Inquire is tomato, or yolk on the Work page.'],
  pills: ['Pills', 'Inter Tight 500, 14 px. Oat by default, ink when active.'],
  capsule: ['Capsule', 'The one big call to action per section. Yolk, turning pool on hover.'],
  buttons: ['Buttons', 'Five fills, three heights: 36, 44 and 64.'],
  buttonList: [
    ['primary', 'Primary', 'tomato, to ink'],
    ['yellow', 'Yellow', 'yolk, to pool'],
    ['outline', 'Outline', 'oat, to ink'],
    ['dark', 'Dark', 'ink, to pool'],
    ['ghost', 'Ghost', 'no fill, to oat'],
  ],
  badge: ['Badge', 'A paper pill with a 12 px ink label. It names a piece of work on a photo.'],
  card: ['Project card', 'A colored tab over a framed photo.'],
  field: ['Field + action', 'An oat field joined to an ink pill.'],
  focus: ['Focus ring', '3 px solid ink. Paper on night, and on pool on the site.'],
};

export const motion = {
  title: ['Built to be ', 'played with', ''],
  note: 'On the site, type rises, blocks wipe in, and shapes can be grabbed. Everything springs into place and comes to rest level.',
  springsTitle: 'Four springs',
  // [name, stiffness, damping, mass, plain description]
  springs: [
    ['Snappy', 520, 30, 1, 'Fast, with a small overshoot.'],
    ['Bouncy', 380, 14, 0.9, 'Overshoots, then settles.'],
    ['Soft', 140, 20, 1, 'Slow and smooth.'],
    ['Wobbly', 260, 9, 1, 'Swings past twice before it rests.'],
  ],
  movesTitle: 'The moves',
  moves: [
    ['rise', 'Headlines rise', 'Words come up out of a clipped line, one after another, 60 ms apart.'],
    ['wipe', 'The block wipes in', 'The highlight block grows from the left. Its words rise a beat later.'],
    ['sweep', 'Buttons sweep', 'On hover the new color rises from below as a circle, and the label rolls up to a copy of itself.'],
    ['grab', 'Shapes can be grabbed', 'Pick one up, throw it, and it springs back home.'],
    ['band', 'Words run in a band', 'An endless line of big words drifts by and speeds up with the scroll.'],
  ],
  reduced: 'If a device asks for less motion, the site holds still: no springs and no drawing in. Hovers and switches cross-fade in 220 ms.',
  short: 'On the site, type rises, blocks wipe in and shapes can be grabbed. Everything springs into place and rests level. Devices that ask for less motion get the still version.',
};

export const web = {
  title: ['One ground ', 'per page', ''],
  note: 'Each page of sha-design.com sits on one color, and the mark in the nav changes its coat to match.',
  // [screenshot file, page, ground, line]
  screens: [
    ['home', 'Home', 'Cream', 'Tomato headline, pool block, shapes in all three primaries.'],
    ['projects', 'Work', 'Tomato', 'Paper headline, pool block.'],
    ['services', 'Services', 'Yolk', 'Pool headline, tomato block.'],
    ['about', 'About', 'Pool', 'Paper headline, yolk block.'],
    ['inquire', 'Inquire', 'Cream', 'The form sits on a paper card with oat fields.'],
  ],
};

export const social = {
  title: ['Shared and ', 'social', ''],
  note: 'The share image and the avatars are finished files. The post and the signature are sample layouts.',
  og: ['Share image', '1200 × 630 px. What a link to sha-design.com shows when it is shared.'],
  avatars: ['Avatars', 'Two squares at 1080 px: the mark on pool and on cream.'],
  post: ['Social post, 1:1', 'Sample layout'],
  postLabel: 'New work',
  postTitle: ['Meet ', 'Treasure', ' the Ocean'],
  sig: ['Email signature', 'Sample layout'],
  filesTitle: 'Where the files are',
  files: [
    ['sha-og-image.jpg', 'In the website’s public folder. The sha-og-image.png beside it is the old design.'],
    ['avatar-pool-1080.png', 'Kit, icons/'],
    ['avatar-cream-1080.png', 'Kit, icons/'],
    ['sha-horizontal.svg', 'Kit, logos/svg/. Use it for signatures.'],
  ],
  sigLines: ['Shiran Bar', 'Industrial designer', 'sha-design.com'],
};

export const print = {
  title: ['On paper, ', 'the same rules', ''],
  note: 'These are sample layouts drawn from the kit, to show how the rules carry over to print.',
  items: [
    ['Business card', 'Sample layout. Stacked lockup on cream; the one-color paper mark on pool.'],
    ['Sticker sheet', 'Sample layout. The die-cut sticker, always on a color.'],
    ['Shipping label', 'Sample layout. One-color ink mark for single-ink print.'],
  ],
  minTitle: 'Smallest print sizes',
  min: [['Mark', '6 mm tall'], ['Horizontal lockup', '40 mm wide'], ['Stacked lockup, wordmark', '30 mm wide'], ['Sticker', '15 mm tall']],
  cmyk: 'Print colors on page 14 are approximate. Proof before a run.',
};

export const clients = {
  title: ['Brands Shiran has ', 'worked with', ''],
  note: 'On the site this row is titled “Brands I’ve worked with”. Keep that wording.',
  logos: [
    ['hape', 'HAPE'], ['tiny_love', 'Tiny Love'], ['doona', 'Doona'],
    ['winfun', 'winfun'], ['desheoz', 'Desheoz'], ['tom_tikkun_olam', 'TOM, Tikkun Olam Makers'],
  ],
  facts: [
    ['HAPE', 'A toy-design internship in China.'],
    ['Tiny Love', 'Five years, with more than ten products shipped.'],
    ['winfun', 'A concept for an interactive armchair for toddlers.'],
  ],
  rule: 'Show client logos in one color, ink, the way the site does. Use the logo files as supplied.',
};

export const index = {
  title: ['What’s in ', 'the kit', ''],
  note: 'Use SVG wherever you can and PNG only where SVG won’t go.',
  folders: [
    ['logos/', '16 SVG + 16 PNG', 'The mark in 9 colorways, horizontal and stacked lockups, wordmark, die-cut sticker. PNGs are 1200 px with transparent backgrounds.'],
    ['motifs/', '14 SVG + 14 PNG', 'Every shape in its primary. The color is in the file name.'],
    ['icons/', '7 files', 'favicon.svg, favicon-32, apple-touch-icon, 192 and 512 app icons, two 1080 px avatars.'],
    ['fonts/', 'TTF + WOFF2 + OFL', 'Inter Tight Regular and Medium for desktop apps, variable web files, and the license.'],
    ['tokens/', 'CSS + JSON', 'tokens.css drops into a site; tokens.json feeds design tools.'],
  ],
  pickTitle: 'Which file for which job',
  pick: [
    ['A website header or anything small', 'sha-mark.svg, or the version named for the ground'],
    ['An email signature or a deck', 'sha-horizontal.svg'],
    ['A square profile picture', 'avatar-pool-1080.png or avatar-cream-1080.png'],
    ['On a photo, or on night', 'sha-mark-paper.svg'],
    ['Single-ink print', 'sha-mark-ink.svg'],
    ['One-color print in a brand color', 'sha-mark-pool.svg, sha-mark-tomato.svg or sha-mark-yolk.svg'],
    ['A sticker or a packaging seal', 'sha-sticker.svg'],
  ],
  siteOnly: 'One more mark, sha-mark-on-yolk-ink.svg, lives only in the website’s source. It is not a kit file.',
};

export const back = {
  title: ['Let’s make ', 'something', ' together'],
  line: 'Questions about a file or a rule? Write to Shiran.',
};
