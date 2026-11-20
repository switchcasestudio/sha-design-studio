/**
 * Case-study content (brief / process / sketches / stages) for the project
 * detail page.
 *
 * `projects.js` is the generated source of truth and must not be hand-edited,
 * so this richer editorial content lives app-side and is keyed by project id —
 * the same pattern as COLLECTION_KIND in ProjectDetail.jsx. Pages read it via
 * `getCaseStudy(id)`, which resolves each sketch's `assetPath` to a bundled URL.
 * A sketch whose file hasn't been dropped in yet is left out, and a project
 * with no sketches shows no sketch section at all — nothing empty is rendered.
 *
 * To add sketches for a project, drop the files under
 *   src/assets/images/case-studies/<project-id>/
 * and reference them from that project's `sketches[].assetPath` below.
 *
 * A project with real process material uses `stages` instead of the single
 * sketch slot: each stage is one "page from the sketchbook" — a drawing, then
 * the physical models that came out of it (see the Ocean Gymini below). When a
 * project has stages, the page shows them in place of the sketch frame.
 */

// Resolve every case-study image to its bundled URL, preferring the .webp
// sibling — same convention as src/data/index.js.
const sketchUrls = import.meta.glob(
  '../assets/images/case-studies/**/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' }
);

function resolveSketch(assetPath) {
  if (!assetPath) return null;
  const key = assetPath.replace(/^src\/assets\//, '../assets/');
  const webpKey = key.replace(/\.(jpe?g|png)$/i, '.webp');
  return sketchUrls[webpKey] ?? sketchUrls[key] ?? null;
}

const OCEAN = 'src/assets/images/case-studies/treasure-the-ocean-gymini';

const caseStudies = {
  'treasure-the-ocean-gymini': {
    brief: {
      goals: [
        'Encourage motor development',
        'Stimulate the senses',
        '2-in-1 functionality',
        'Easy to assemble and store',
      ],
      constraints: [
        'Safe & durable materials',
        'Lightweight structure',
        'Cost-effective manufacturing',
        'Suitable from 0+ months',
      ],
      users: 'Babies 0–12 months and their parents.',
    },

    process: [
      {
        n: '01',
        title: 'It started with one simple idea',
        text: 'Can we create a gym that engages babies from day one and grows with them?',
      },
      {
        n: '02',
        title: 'Exploring countless possibilities',
        text: 'Sketching dozens of arch, mobile and play-mat configurations to find the form with the most play value.',
      },
      {
        n: '03',
        title: 'Shaping the experience',
        text: 'Testing forms, proportions and interactions to create the right balance between function, aesthetics and developmental value.',
      },
      {
        n: '04',
        title: 'Engineering with purpose',
        text: 'Refining every detail in 3D — mechanisms, materials and safety — to bring the concept to life.',
      },
      {
        n: '05',
        title: 'Built, tested and improved',
        text: 'Prototyping, testing and iterating with real babies and parents to ensure a joyful and meaningful experience.',
      },
      {
        n: '06',
        title: 'Ready for adventures',
        text: 'The final 2-in-1 gym — designed to inspire curiosity, support development and grow with the baby.',
      },
    ],

    // Form exploration, told as three pages from the sketchbook. Each page is
    // one row of Shiran's concept sheet (traced to ink vector from her Figma
    // file, so it stays sharp at any size) followed by the models built from
    // it. Stage titles and lines are hers, from the same file.
    stages: [
      {
        n: '01',
        title: 'Initial form studies',
        text: 'Early studies explored simple geometric forms and a suspended mobile structure.',
        sketch: {
          assetPath: `${OCEAN}/sketch-01-form-studies.svg`,
          width: 1236,
          height: 388,
          alt: 'Sketches of ringed planets, a dotted saucer and cone-shaped hanging mobiles',
        },
        models: [
          {
            assetPath: `${OCEAN}/model-01-ringed-planet.webp`,
            alt: 'Model of a ringed planet: stacked rings on a sphere, sitting on a flat disc',
          },
          {
            assetPath: `${OCEAN}/model-01-dotted-disc.webp`,
            alt: 'Model of a white dome set in a patterned fabric disc',
          },
          {
            assetPath: `${OCEAN}/model-01-canopy-mobile.webp`,
            alt: 'Fabric canopy mobile prototype with a jellyfish, a fish and a shell hanging from it',
          },
        ],
      },
      {
        n: '02',
        title: 'Character & material',
        text: 'Combining a molded plastic head with soft fabric elements.',
        sketch: {
          assetPath: `${OCEAN}/sketch-02-characters.svg`,
          width: 1236,
          height: 430,
          alt: 'Character sketches: jellyfish, a starfish with a face, and a dome-headed star hanging from the gym arch',
        },
        models: [
          {
            assetPath: `${OCEAN}/model-02-star-white-dome.webp`,
            alt: 'Prototype of a white dome with eyes set in a teal fabric star, with a ring, a rattle and a striped star attached',
          },
          {
            assetPath: `${OCEAN}/model-02-dome-character.webp`,
            alt: 'Prototype of a dome character with a face, resting on a green fabric star',
          },
          {
            assetPath: `${OCEAN}/model-02-on-the-arch.webp`,
            alt: 'The dome character prototype hanging from the gym arch',
          },
        ],
      },
      {
        n: '03',
        title: 'Starfish direction',
        text: 'Form, character and interaction evolve together.',
        sketch: {
          assetPath: `${OCEAN}/sketch-03-starfish.svg`,
          width: 1236,
          height: 416,
          alt: 'Sketches of padded stars and a star-shaped mobile with hanging fish',
        },
        models: [
          {
            assetPath: `${OCEAN}/model-03-starfish-first-form.webp`,
            alt: 'First starfish form in cream fabric with a round centre',
          },
          {
            assetPath: `${OCEAN}/model-03-starfish-dotted.webp`,
            alt: 'Starfish prototype in dotted fabric with eyes and fish charms',
          },
          {
            assetPath: `${OCEAN}/model-03-starfish-final.webp`,
            alt: 'Starfish mobile prototype: a molded star on navy fabric with fish hanging beneath',
          },
        ],
      },
    ],
    stagesCaption:
      'Concept exploration — from functional models to a playful ocean character',
  },

  // ---------------------------------------------------------------------------
  // Scaffolds for the other on-site projects. Keyed by their SITE project id.
  // A slot left empty/null is not shown on the page (the brief is the one
  // exception: it falls back to DEFAULT_BRIEF below). Fill a slot with that
  // project's real specifics and its section appears. Shapes:
  //
  //   brief: {
  //     goals:       ['…', '…'],
  //     constraints: ['…', '…'],
  //     users:       'One short sentence about who it’s for.',
  //   }
  //   process: [ { n: '01', title: '…', text: '…' }, … ]   // numbered steps
  //   sketches: [ {                                         // one full-width image
  //     assetPath: 'src/assets/images/case-studies/<project-id>/sketch-1.webp',
  //     alt: '…',
  //     caption: '…',
  //   } ]
  //   stages: [ {                                           // replaces `sketches`
  //     n: '01', title: '…', text: '…',
  //     sketch: { assetPath: '…/sketch-01.svg', width: 1236, height: 388, alt: '…' },
  //       (width/height = the file's own size, so the page holds its space while it loads)
  //     models: [ { assetPath: '…/model-01.webp', alt: '…' }, … ],
  //   } ]
  // ---------------------------------------------------------------------------

  'here-i-grow-activity-center': {
    brief: null,
    process: [],
    sketches: [],
  },

  'wooden-toy-design': {
    brief: null,
    process: [],
    sketches: [],
  },

  'garden-of-adventures-packaging': {
    brief: null,
    process: [],
    sketches: [],
  },

  'tiny-rockers-shape-sorter': {
    brief: null,
    process: [],
    sketches: [],
  },

  'mobile-character-design': {
    brief: null,
    process: [],
    sketches: [],
  },
};

// Shared fallback content. A project's own values in `caseStudies` always win.
// Only DEFAULT_BRIEF is ever shown (its goals fill the reference card);
// DEFAULT_PROCESS is kept as a starting point for writing a project's own
// steps and never reaches the page (see `hasOwnProcess`). Kept deliberately
// generic + true to Shiran's process — replace per project with the specifics.
const DEFAULT_BRIEF = {
  goals: [
    'Support developmental play',
    'Engage the senses',
    'Intuitive and joyful to use',
    'Easy for parents to live with',
  ],
  constraints: [
    'Meets child-safety standards',
    'Durable, child-safe materials',
    'Cost-effective to manufacture',
    'Age-appropriate from the start',
  ],
  users: 'Babies, toddlers and their parents.',
};

const DEFAULT_PROCESS = [
  {
    n: '01',
    title: 'Starting with a question',
    text: 'Every project begins by understanding the child, the play value, and the problem worth solving.',
  },
  {
    n: '02',
    title: 'Exploring possibilities',
    text: 'Sketching and exploring a wide range of directions to find the idea with the most potential.',
  },
  {
    n: '03',
    title: 'Shaping the experience',
    text: 'Testing forms, proportions and interactions to balance function, aesthetics and developmental value.',
  },
  {
    n: '04',
    title: 'Engineering with purpose',
    text: 'Refining every detail in 3D — mechanisms, materials and safety — to bring the concept to life.',
  },
  {
    n: '05',
    title: 'Built, tested and improved',
    text: 'Prototyping and iterating with real users to ensure a joyful, meaningful result.',
  },
  {
    n: '06',
    title: 'Ready for the world',
    text: 'The final product — designed to inspire curiosity, support development and last.',
  },
];

// Each project gets its own sketch slot/path so a real file can be dropped in
// per project with no code change. Until the file exists the slot resolves to
// nothing and the page shows no sketch section.
function defaultSketches(id) {
  return [
    {
      assetPath: `src/assets/images/case-studies/${id}/sketch-1.webp`,
      alt: 'Concept sketches from the development process',
      caption: 'Concept exploration',
    },
  ];
}

// Resolve a project's stages to bundled URLs. An image whose file is missing is
// dropped (never a broken frame), and a stage left with nothing to show is
// dropped with it.
function resolveStages(stages = []) {
  const withSrc = (image) => {
    const src = resolveSketch(image?.assetPath);
    return src ? { ...image, src } : null;
  };
  return stages
    .map((stage) => ({
      ...stage,
      sketch: withSrc(stage.sketch),
      models: (stage.models ?? []).map(withSrc).filter(Boolean),
    }))
    .filter((stage) => stage.sketch || stage.models.length > 0);
}

/**
 * Case-study content for a project id, with sketch URLs resolved and shared
 * defaults filled in. Returns content for every project so the full layout is
 * applied app-wide; a project's own `caseStudies` entry overrides any slot.
 */
export function getCaseStudy(id) {
  const study = caseStudies[id] ?? {};
  const brief = study.brief ?? DEFAULT_BRIEF;
  const process = study.process?.length ? study.process : DEFAULT_PROCESS;
  const stages = resolveStages(study.stages);
  // Stages are the real material, so they take the sketch frame's place.
  const sketches = stages.length
    ? []
    : study.sketches?.length
      ? study.sketches
      : defaultSketches(id);
  return {
    brief,
    process,
    // The shared DEFAULT_PROCESS is a fallback, not this project's story — the
    // page only shows a process section when a project has its own steps.
    hasOwnProcess: Boolean(study.process?.length),
    // Only sketches whose file exists. No file, no frame: the page never shows
    // an empty slot.
    sketches: sketches
      .map((sketch) => ({ ...sketch, src: resolveSketch(sketch.assetPath) }))
      .filter((sketch) => sketch.src),
    stages,
    stagesCaption: stages.length ? (study.stagesCaption ?? null) : null,
  };
}

export default caseStudies;
