# Sha Design Studio — Brand Guidelines

> Reference document for the Sha Design Studio website project.
> Use this as the single source of truth when designing pages, writing copy, or building new components.

---

## 1. Brand at a Glance

**Studio:** Sha Design Studio
**Designer:** Shiran Bar
**Discipline:** Industrial design — toys & baby products
**Tagline:** *Designing Playful Thoughtful Products*
**Promise:** Simple, smart, and full of wonder.

### The story in one paragraph

Shiran is an independent industrial designer specializing in toys and baby products. After graduating from Shenkar College of Design, interning at HAPE in China, and working at Tiny Love designing soft toys and electronic developmental items, she's now opening her own freelance practice. Her work is grounded in the curiosity, instinct to play, and unfiltered reactions of babies — and in a love for the small, surprising details that turn a good product into an exceptional one.

### Audience

- Toy & baby-product brands looking for freelance industrial design
- Studios & agencies needing contract design support
- Direct-to-consumer parent brands launching new product lines
- Creative collaborators in adjacent design fields

---

## 2. Color System

The palette is warm, playful, and confident — built on a cream canvas with three saturated accents.

### Primary colors

| Role | Name | Hex | CSS variable | Notes |
|---|---|---|---|---|
| **Background canvas** | Cream | `#F5F0E1` | `--color-cream` | Default page background. Warm parchment. |
| **Primary accent** | Orange | `#E54B2A` | `--color-orange` | Logo, headings, CTAs, the Portfolio page background. The brand's heartbeat. |
| **Secondary** | Yellow | `#F2C94C` | `--color-yellow` | "What I Do" section, Design Session card, Hello! badge. Warm and inviting. |
| **Tertiary** | Blue | `#4A7FBF` | `--color-blue` | About page background, "Kind Words" testimonial, Full-service tier. |
| **Ink** | Dark | `#1A1A1A` | `--color-ink` | Body text, dark tier cards, blackletter headings. |

### Tints & shades (for hover/pressed states)

| Variable | Hex | Use |
|---|---|---|
| `--color-orange-deep` | `#C93D1F` | Orange hover/pressed |
| `--color-orange-soft` | `#F37A5C` | Light orange tint |
| `--color-yellow-deep` | `#E8B91E` | Yellow hover |
| `--color-yellow-soft` | `#F7DA7A` | Light yellow tint |
| `--color-blue-deep` | `#3A6BA5` | Blue hover |
| `--color-blue-soft` | `#7AA0D2` | Cloud-shaped badge fill |
| `--color-cream-soft` | `#FBF7EC` | Light card backgrounds |

### Usage rules

- **Cream is always the canvas.** Never use pure white as a page background.
- **One dominant accent per section.** Don't pile colors on top of each other — let each section be unmistakably orange, yellow, blue, or cream.
- **Orange = action.** Anything clickable, anything urgent, anything that needs to draw the eye.
- **Yellow = warmth.** Service tiers, "What I Do" moments, friendly invitations.
- **Blue = quiet confidence.** About, testimonials, the highest service tier.
- **Ink for body text on cream/yellow.** Cream for body text on orange/blue/ink.

### Accessibility

All color combinations used in the live site meet **WCAG AA** for normal body text (4.5:1) and large text (3:1). When introducing new pairings, run them through a contrast checker first.

---

## 3. Typography

Two voices, paired intentionally.

### Display — Climate Crisis

Used for headlines, the tagline, the "Site Title" mark, and any time the brand needs to *speak loudly*. Climate Crisis is a chunky, blackletter-flavored variable display font — heavy, characterful, and a little wild.

- **CSS variable:** `--font-display`
- **Source:** Drop the `.ttf` at `src/assets/fonts/ClimateCrisis-Regular.ttf`
- **Fallback stack:** `'Climate Crisis', 'Impact', 'Arial Black', sans-serif`
- **Use for:** `h1`, `h2`, `h3`, `h4`, hero taglines, the logo wordmark, footer site title, decorative quote marks
- **Don't use for:** body copy, captions, form fields, navigation links, or anything under 18px

### Body — Inter

Clean, geometric, neutral. Carries the load for everything Climate Crisis can't.

- **CSS variable:** `--font-body`
- **Source:** Google Fonts CDN (loaded in `src/styles/fonts.css`)
- **Weights used:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Use for:** body paragraphs, navigation, buttons, form fields, captions, microcopy, badge labels

### Type scale

| Token | Size (desktop) | Use |
|---|---|---|
| `--text-7xl` | 96px | Page titles ("Portfolio", "About Me", "Services") |
| `--text-6xl` | 72px | Hero taglines |
| `--text-5xl` | 56px | Section titles ("What I Do", "Kind Words") |
| `--text-4xl` | 40px | Sub-section titles |
| `--text-3xl` | 32px | Card titles, "What I Offer" heading |
| `--text-2xl` | 24px | Pull quotes, lead paragraphs |
| `--text-xl` | 20px | Service tier descriptions |
| `--text-lg` | 18px | Featured body copy |
| `--text-base` | 16px | Default body copy |
| `--text-sm` | 14px | Captions, helper text |
| `--text-xs` | 12px | Labels, tags, metadata (year stamps) |

The scale shrinks responsively below 768px (see `tokens.css`).

### Typography rules

- **Tight leading on display.** `--leading-tight` (1.1) for Climate Crisis. The font has its own personality — give it room to breathe vertically without spreading lines apart.
- **Generous leading on body.** `--leading-relaxed` (1.625) for paragraph text. Especially important on long-form pages like About.
- **Negative letter-spacing on display.** `--tracking-tight` (-0.02em) for big headlines. Climate Crisis has wide default tracking that needs reining in.
- **No all-caps on display.** Climate Crisis is too dense to read in caps.

---

## 4. Logo

The mark is an abstract wordmark — a stylized arrangement of forms reading like the name "Sha". It always appears in **orange** on cream, or **cream** on orange/blue/ink.

### Usage

- **Minimum size:** 32px tall (digital), 12mm tall (print)
- **Clearspace:** at least one logo-height of clear space on all sides
- **Don't:** stretch, recolor outside the palette, place on busy photography, add drop shadows, or stack with other marks
- **Always paired:** with the tagline "Designing Playful Thoughtful Products" set in Climate Crisis when used as a brand lockup

The current logo file is a placeholder SVG in `src/components/ui/Logo.jsx`. Replace with the official mark when delivered.

---

## 5. Decorative Elements

### Flower badges

Eight-petal "daisy" shapes used as playful labels on portfolio thumbnails and hero photography. Examples from the screenshots: *"Way cool!"*, *"Gymini"*, *"Hello!"*

- **Colors:** orange (most common), yellow (secondary)
- **Type:** Inter Semibold, set inside the petal
- **Behavior:** subtle wobble animation on the homepage to feel alive
- **Implementation:** `<Badge shape="flower" color="orange">…</Badge>`

### Cloud badges

Rounded blob shapes used for category labels — quieter than flowers, used to identify a project type.

- **Colors:** blue (most common — see "Sorter", "Activity center")
- **Type:** Inter Semibold
- **Implementation:** `<Badge shape="cloud" color="blue">…</Badge>`

### Studio tags

Tiny pill-shaped tags placed below project images, identifying the studio Shiran worked with (e.g., *"Tiny Love"*).

- **Colors:** orange background, cream text
- **Type:** Inter Semibold, 12px

### Borders & corners

- **Border radius scale:** 6px (small), 12px (medium), 16px (large), 24px (cards), 32px (panels), pill (buttons)
- **Cards & section panels** always use the largest rounding (`--radius-2xl`, 32px) — this is a defining brand trait. Sharp corners feel wrong here.

---

## 6. Voice & Tone

### Voice (always)

- **Warm.** The audience is parents, designers, and brands that care about babies. Be human first.
- **Confident.** Shiran has serious credentials (Shenkar, HAPE, Tiny Love). Don't undersell.
- **Playful, not cute.** "Way cool!" is the upper bound — never baby-talk, never twee.
- **Specific.** "Soft toys and electronic developmental items" beats "all kinds of products."

### Tone (situational)

| Context | Tone |
|---|---|
| Hero / About | Inviting, personal, first-person |
| Services | Direct, business-like, but still warm |
| Project descriptions | Story-driven, sensory, rooted in design intent |
| CTAs | Active, low-friction ("Let's chat", "Send away", "Explore my services") |
| Form labels | Plainspoken ("Email", "Message" — not "Your details") |
| Testimonials | Quoted verbatim, attributed clearly |

### Words we use

play • curiosity • wonder • simple • smart • thoughtful • intuitive • sensitivity • precision • spark joy • inspire • empower

### Words we avoid

solutions (overused) • leverage • disrupt • innovative (show, don't tell) • cutting-edge • synergy • adorable • cutesy • bestie

---

## 7. Layout & Composition

### Canvas

- **Max content width:** 1280px (`--max-width-content`)
- **Gutter:** clamp(1rem, 4vw, 2.5rem) — fluid, comfortable on every screen
- **Vertical rhythm:** generous. Sections breathe with `clamp(48px, 8vw, 96px)` of vertical padding.

### Section pattern

Each major section is a full-bleed colored panel with rounded top/bottom corners (the orange Portfolio page, the yellow "What I Do" panel, the blue "Kind Words" panel). The cream canvas peeks between them, creating a stacked, magazine-like rhythm.

### Grids

- **Project grid:** asymmetric — one large feature card + smaller tiles around it. Avoid perfectly even grids; the asymmetry is part of the brand.
- **Service grid:** stacked full-width cards, each one a different color. Vertical scroll, not horizontal carousel.
- **Footer:** 3-column on desktop (Menu / Social / Contact form), single column on mobile.

### Photography

- **Lifestyle.** Babies playing with toys, designer at work, real interiors. Never stock-y.
- **Warm white-balance.** Slight golden cast in line with the cream canvas.
- **Negative space.** Photos breathe — never crowded.
- **Placeholders:** during development, use diagonal stripe patterns (`repeating-linear-gradient`) to make missing imagery visually obvious without being jarring.

---

## 8. Motion

Motion should feel **soft and intentional**, never showy.

- **Default duration:** 150–250ms for micro-interactions (hover, focus, button press)
- **Default easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — a gentle ease-out
- **Wobble:** flower badges have a subtle 8-second wobble loop to feel alive
- **Page transitions:** none for now (keeping the site fast and predictable)
- **Respect `prefers-reduced-motion`:** all transitions are gated by the media query in `tokens.css`

---

## 9. Component Inventory

The site is built from these reusable pieces. Add to `src/components/` as new ones emerge.

### Layout
- `Layout` — page shell with Outlet
- `Navbar` — sticky top nav with logo, links, CTA, mobile drawer
- `Footer` — orange contact panel + cream bottom bar

### UI primitives
- `Button` — variants: `primary`, `outline`, `ghost`, `dark`, `yellow`. Sizes: `sm`, `md`, `lg`. Polymorphic via `as` prop.
- `Badge` — flower or cloud shape, three colors
- `Logo` — SVG mark, sized via prop

### Sections
- `ContactForm` — used in footer; email + checkbox + message + submit

### Page-specific
- Project cards (Home & Projects pages)
- Service tier cards (Services & About pages)
- Testimonial blockquote (Home page)

---

## 10. Page-by-page Reference

### Home (`/`)
1. **Hero** — cream canvas, centered logo, big tagline in orange
2. **Project grid** — asymmetric, one feature + 4 secondary, badges floating
3. **What I Do** — yellow panel, copy left, designer-at-work photo right
4. **Kind Words** — blue panel, single testimonial in display type

### Projects / Portfolio (`/projects`)
- Full orange background
- Big "Portfolio" title + intro
- Stacked project entries: image(s), badge, year stamp, description

### Services (`/services`)
- Cream canvas
- Hero image
- Three stacked service cards: blue (Full-service), dark (Room Redesign), yellow (Design Session with price + Purchase button)
- Each card has an expandable list of inclusions

### About (`/about`)
- Full blue background
- Bio left, designer portrait right with "Hello!" yellow flower badge
- Photo gallery (asymmetric grid)
- Yellow "What I Offer" panel with expandable services list

### Footer (every page)
- Orange panel: logo + tagline, three columns (Menu / Social / Contact form)
- Cream bottom bar: site title, social icons, email link

---

## 11. Implementation Checklist

When building any new page or component, confirm:

- [ ] Uses CSS variables from `tokens.css` — no hex codes hardcoded in component CSS
- [ ] Body copy uses `--font-body`; headings use `--font-display`
- [ ] Hits at least WCAG AA contrast for all text
- [ ] Touch targets are minimum 44×44px
- [ ] Has a mobile layout (single column at <768px)
- [ ] Respects `prefers-reduced-motion`
- [ ] Has visible focus states on interactive elements
- [ ] Section panel uses `--radius-2xl` rounded corners
- [ ] Uses `<Badge>` for any flower/cloud decorative labels (don't reinvent)
- [ ] Uses `<Button>` for any CTA (don't style raw `<button>` from scratch)
- [ ] Uses semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)

---

*Last updated: site scaffold v0.1*
