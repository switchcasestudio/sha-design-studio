/**
 * Case-study content (brief / process / sketches) for the project detail page.
 *
 * `projects.js` is the generated source of truth and must not be hand-edited,
 * so this richer editorial content lives app-side and is keyed by project id —
 * the same pattern as COLLECTION_KIND in ProjectDetail.jsx. Pages read it via
 * `getCaseStudy(id)`, which resolves each sketch's `assetPath` to a bundled URL
 * (null when the file hasn't been dropped in yet → the UI shows a placeholder).
 *
 * To add sketches for a project, drop the files under
 *   src/assets/images/case-studies/<project-id>/
 * and reference them from that project's `sketches[].assetPath` below.
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

    // Single full-width sketch. Drop the real file at the assetPath below to
    // replace the placeholder.
    sketches: [
      {
        assetPath:
          'src/assets/images/case-studies/treasure-the-ocean-gymini/sketch-1.webp',
        alt: 'Concept sketches of the 2-in-1 gym — lay & play and tummy-time modes, with arch and mobile explorations',
        caption: 'Concept exploration — two play modes and form studies',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Scaffolds for the other on-site projects. Keyed by their SITE project id.
  // Every project renders the full layout: any slot left empty/null falls back
  // to the shared DEFAULT_* content below. Fill a slot to override it with that
  // project's real specifics. Shapes:
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

// Shared fallback content so EVERY project shows the full case-study layout
// (Brief · Process · Sketches), even before it's been customized. A project's
// own values in `caseStudies` always win; anything it leaves empty falls back
// to these. Kept deliberately generic + true to Shiran's process so it reads
// honestly as a placeholder — replace per project with the real specifics.
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
// per project (until then it renders the striped placeholder).
function defaultSketches(id) {
  return [
    {
      assetPath: `src/assets/images/case-studies/${id}/sketch-1.webp`,
      alt: 'Concept sketches from the development process',
      caption: 'Concept exploration',
    },
  ];
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
  const sketches = study.sketches?.length ? study.sketches : defaultSketches(id);
  return {
    brief,
    process,
    sketches: sketches.map((sketch) => ({
      ...sketch,
      src: resolveSketch(sketch.assetPath),
    })),
  };
}

export default caseStudies;
