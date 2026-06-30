/**
 * Authored project copy — Shiran Bar's own descriptions.
 *
 * Source of truth: `Portfolio_Shiran-Bar.pdf` (the studio's 2026 portfolio
 * deck). The generated `projects.js` only carries product photos + SEO scraped
 * from the Tiny Love CDN; it has no narrative voice. This file holds the text
 * Shiran actually wrote about each project, transcribed verbatim from the deck
 * and split into paragraphs for display.
 *
 * It is hand-maintained (unlike `projects.js`, which is generated). Keys are
 * content slugs. `siteProjectId` links an entry to a live project on the site
 * (the detail page can pull its overview via `getContentForProject`); it is
 * null for projects that are in the deck but not yet built on the site (these
 * have no image assets in the repo yet — see `onSite`).
 *
 * Note: two deck entries (the Garden of Adventures rattle/gift set and its
 * packaging) map to the single combined `garden-of-adventures-packaging`
 * project on the site, so `getContentForProject` returns an array.
 */

export const projectContent = {
  // ----- On the site today -----
  'here-i-grow-activity-center': {
    title: '5-in-1 Here I Grow Stationary Activity Center',
    client: 'Tiny Love',
    siteProjectId: 'here-i-grow-activity-center',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 3 },
    overview: [
      'Developed as part of a collaborative product development team, this multifunctional activity center was designed to grow with the child through multiple developmental stages, transitioning from tummy-time station to activity center, jumper, and later into a table and chair configuration.',
      'The project involved complex product architecture, integration between detachable components, and consideration of long-term usability, modularity, and user interaction across different stages of development.',
      'Within the project, I designed and developed two key interactive toys, the Take-Along Piano and the Bear on a Cloud, designed to function both as integrated components and as stand-alone products adaptable across multiple collections and themes.',
      'The development process included concept thinking, feature development, 3D modeling, interaction design, and close consideration of manufacturing constraints and product feasibility.',
    ],
  },

  'treasure-the-ocean-gymini': {
    title: '2-in-1 Musical Mobile Gymini',
    client: 'Tiny Love',
    siteProjectId: 'treasure-the-ocean-gymini',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 4 },
    overview: [
      'An ocean-themed activity gym featuring 18 engaging play activities for infants. The key feature is the musical mobile, which I designed and developed – a rotating mobile with 6 melodies and a light show that easily transforms into an interactive tummy-time toy, providing visual and audio feedback to encourage longer play.',
      'The design integrates adjustable arches and a variety of sensory toys, including rattles, a mirror, textured elements, and crinkly fabrics, all aimed at stimulating curiosity, developing motor skills, and creating a playful, multi-sensory experience.',
    ],
  },

  'shape-sorter': {
    title: 'Shape Sorter',
    client: 'Tiny Love',
    siteProjectId: 'tiny-rockers-shape-sorter',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 7 },
    overview: [
      'A 3-in-1 shape sorter for classic sorting, puzzle-solving, and open-ended play. Designed to help children develop shape, color, and size recognition, while enhancing fine motor skills and hand-eye coordination.',
      'I designed the product in compliance with the company’s safety standards, incorporating unique tactile patterns on each shape to enrich sensory stimulation and support learning through touch. The set includes 6 geometric shapes, a storage bucket, and an easy-to-carry handle for play on the go.',
    ],
  },

  'wooden-toys-design': {
    title: 'Wooden Toys Design',
    client: 'Tiny Love',
    siteProjectId: 'wooden-toy-design',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 8 },
    overview: [
      'A four-piece collection of wooden toys designed in a soft, boho-inspired aesthetic. The project’s challenge was to adapt existing products to meet the company’s safety standards, while also refreshing their look through updated color palettes, patterns, and graphic elements.',
      'The collection includes a wooden train set, a car ramp racer, a balance bike, and an activity walker – all styled with warm earthy tones, playful illustrations, and a cohesive visual identity that appeals to both children and parents.',
    ],
  },

  'take-along-rattle-gift-set': {
    title: 'Take Along Rattle & Gift Set',
    client: 'Tiny Love',
    siteProjectId: 'garden-of-adventures-packaging',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 9 },
    overview: [
      'As part of Tiny Love’s sustainable Garden of Adventures collection, the Take-Along Rattle and Gift Set were designed with natural, eco-friendly materials and a cohesive aesthetic language. The collection aimed to create engaging toys from a minimal fabric selection, while solving the technical challenge of securely combining wood and textiles.',
      'The Take-Along Rattle integrates corduroy leaves, a delicately patterned wooden base, and colorful beads to encourage sensory exploration and fine motor skills. The Gift Set extends the same values with soft organic fabrics, highlighting a thoughtful balance of sustainability, aesthetics, and developmental play.',
    ],
  },

  'packaging-design': {
    title: 'Packaging Design',
    client: 'Tiny Love',
    siteProjectId: 'garden-of-adventures-packaging',
    onSite: true,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 10 },
    overview: [
      'Eco-conscious packaging created for Tiny Love’s sustainable Garden of Adventures collection. The design communicates its sustainability values through dedicated eco-icons, natural color tones, and a warm, organic visual language. Die-cut windows invite interaction by allowing customers to feel the product’s textures, while the structure is thoughtfully designed to minimize material use. The result is packaging that stands out on the shelf, reflects the brand’s eco-friendly ethos, and complements the collection’s natural aesthetic.',
    ],
  },

  // ----- In the deck, not yet built on the site (no image assets in repo) -----
  'developmental-gymini': {
    title: 'Developmental Gymini',
    client: 'Tiny Love',
    siteProjectId: null,
    onSite: false,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 5 },
    overview: [
      'Unicorn-themed activity gym with a soft, colorful design featuring a mirror, music box, plush teething dolls, and a tummy-time pillow. I led the project from concept to final product, including an on-site visit to the factory in China to ensure every detail was executed accurately. My role included designing the features, creating the dolls’ patterns, and 3D designing a teething cloud with satin ribbons.',
      'The adjustable arches adapt to different play stages, from tummy time to rolling and sitting, while the toys promote sensory exploration, motor skills, and cause-and-effect learning. Soft textures, crinkly fabrics, and charming characters invite interaction and support development.',
    ],
  },

  'take-along-musical-toy': {
    title: 'Take Along Musical Toy',
    client: 'Tiny Love',
    siteProjectId: null,
    onSite: false,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 6 },
    overview: [
      'Part of Tiny Love’s Unicorn Collection, this plush unicorn features a built-in music box that plays a melody when touched, encouraging sensory exploration and cognitive development. The design blends plush fabrics, embroidered eyes, metallic gold accents, and varied textures for rich tactile stimulation. Includes a plastic attachment ring, designed for take-along products, that connects to a wide range of the brand’s items.',
    ],
  },

  'product-redesign': {
    title: 'Product Redesign',
    client: 'Tiny Love',
    siteProjectId: null,
    onSite: false,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 11 },
    overview: [
      'Redesign of the company’s existing products to align with a refreshed theme. The work included creating new cloth dolls, updating designs and color palettes, and ensuring compliance with safety standards. The project was managed from design development through production, in collaboration with factories.',
    ],
  },

  'baby-park-concept': {
    title: 'Baby Park Concept',
    client: null, // concept project — no client badge in the deck
    siteProjectId: null,
    onSite: false,
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 12 },
    overview: [
      'Designed for a company specializing in printed grass technology. The project aimed to create a safe, inviting, and joyful environment for infants and their caregivers, with play areas seamlessly integrated into public gardens.',
      'The design process included theme selection, age-appropriate illustrated characters, and the creation of a cohesive visual language adapted to innovative printed-grass surfaces. Developed in 3D and presented through renderings, the concept combines practicality with a warm, playful atmosphere, encouraging sensory exploration and motor development in a unique outdoor setting.',
    ],
  },

  'armchair-design': {
    title: 'Armchair Design',
    client: 'winfun',
    siteProjectId: null,
    onSite: false,
    // The deck notes the imagery is "Rendering from the development process".
    source: { file: 'Portfolio_Shiran-Bar.pdf', page: 13 },
    overview: [
      'Development of a concept for an interactive electronic armchair for toddlers.',
      'The project involved defining the play concept, designing activity features, and developing the overall form and styling of the chair. The design process included sketches, 3D modeling, and final renderings.',
      'The 3D modeling stage was carried out with careful consideration of the manufacturing process, including mold design and production feasibility. Ergonomic comfort was combined with interactive elements—music, lights, and tactile activities—to enrich developmental play.',
      'The result is a multifunctional product that toddlers can sit on, explore, and move independently, encouraging autonomy and safe exploration while ensuring durability and long-term use.',
    ],
  },
};

/** Look up authored copy by its content slug. */
export function getContent(contentId) {
  return projectContent[contentId] ?? null;
}

/**
 * Authored copy entries linked to a live site project, by its project id.
 * Returns an array because one site project can combine several deck entries
 * (e.g. Garden of Adventures = rattle/gift set + packaging).
 */
export function getContentForProject(siteProjectId) {
  return Object.entries(projectContent)
    .filter(([, entry]) => entry.siteProjectId === siteProjectId)
    .map(([id, entry]) => ({ id, ...entry }));
}

/** Deck projects that don't have a page on the site yet. */
export function getUnbuiltProjects() {
  return Object.entries(projectContent)
    .filter(([, entry]) => !entry.onSite)
    .map(([id, entry]) => ({ id, ...entry }));
}

export default projectContent;
