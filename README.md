# Sha Design Studio

Portfolio website for **Shiran Bar**, an industrial designer specializing in toys and baby products. Built with React + Vite + vanilla CSS, with optional [React Bits Pro](https://reactbits.dev) components for premium animated sections.

> **Tagline:** Designing Playful Thoughtful Products

---

## Tech Stack

- **React 18** with **Vite** for blazing-fast dev/build
- **React Router 6** for client-side routing
- **Vanilla CSS** with CSS custom properties (no Tailwind, no CSS-in-JS)
- **React Bits Pro** for animated UI components (optional, license-gated)
- **Lucide React** for icons
- **Motion** (Framer Motion) for animations

## Getting Started

### 1. Prerequisites

- **Node.js 18+** ([download](https://nodejs.org))
- **npm** (comes with Node)

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and add your React Bits Pro license key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
REACTBITS_LICENSE_KEY=your_key_here
```

> The site runs without a license key — you just won't be able to install React Bits Pro components.

### 4. Add fonts

Drop the **Climate Crisis** font file at:

```
src/assets/fonts/ClimateCrisis-Regular.ttf
```

The body font (Inter) loads from Google Fonts automatically.

### 5. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

### 6. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Project Structure

```
sha-design-studio/
├── public/                       # Static assets served as-is
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── fonts/                # Climate Crisis + any local fonts
│   │   ├── images/               # Projects, portraits, lifestyle photos
│   │   └── icons/                # SVG icons (logo, badges, etc.)
│   ├── components/
│   │   ├── layout/               # Navbar, Footer, Layout shell
│   │   ├── sections/             # Composable page sections (ContactForm, etc.)
│   │   └── ui/                   # Reusable primitives (Button, Badge, Logo)
│   ├── context/                  # React Context providers (theme, etc.)
│   ├── hooks/                    # Custom React hooks
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── Services.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── styles/
│   │   ├── globals.css           # Imports tokens + reset + fonts
│   │   ├── tokens.css            # Design tokens (colors, type, spacing)
│   │   ├── reset.css             # Modern CSS reset
│   │   └── fonts.css             # @font-face declarations
│   ├── utils/
│   │   ├── cn.js                 # className utility
│   │   └── siteConfig.js         # Single source of truth for nav/brand
│   ├── App.jsx                   # Router config
│   └── main.jsx                  # Entry point
├── .env.example                  # Template for env vars
├── .env.local                    # Local secrets (gitignored)
├── .gitignore
├── components.json               # shadcn/React Bits registry config
├── index.html
├── jsconfig.json                 # Path alias intellisense
├── package.json
├── README.md                     # ← you are here
├── BRAND_GUIDELINES.md           # Brand reference for the project
└── vite.config.js
```

### Path Aliases

Imports use these aliases (configured in `vite.config.js` + `jsconfig.json`):

| Alias | Path |
|---|---|
| `@/` | `src/` |
| `@assets/` | `src/assets/` |
| `@components/` | `src/components/` |
| `@pages/` | `src/pages/` |
| `@styles/` | `src/styles/` |
| `@hooks/` | `src/hooks/` |
| `@utils/` | `src/utils/` |

### Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/projects` | Portfolio |
| `/services` | Services |
| `/about` | About |
| `*` | 404 |

## Adding React Bits Components

With your license key set in `.env.local`, install components/blocks via the shadcn CLI:

```bash
# A single animated component (use the -css variant since this project doesn't use Tailwind)
npx shadcn@latest add @reactbits-starter/silk-waves-css

# A full page block (Pro license required)
npx shadcn@latest add @reactbits-pro/hero-1
```

Components install to `src/components/react-bits/` and blocks to `src/components/blocks/`.

> **Note:** Some React Bits blocks ship with Tailwind classes. Since this project uses vanilla CSS, you may need to translate or strip those classes after installing. The `cn()` helper in `src/utils/cn.js` handles both cases.

## Design System

See [`BRAND_GUIDELINES.md`](./BRAND_GUIDELINES.md) for the full brand specification — colors, typography, voice, and visual language.

All design tokens live in `src/styles/tokens.css` as CSS custom properties. To re-theme, edit those variables.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Deployment

This is a static SPA — deploy the `dist/` folder anywhere:

- **Vercel / Netlify**: zero-config — connect the repo and set the build command to `npm run build` and the publish directory to `dist`
- **GitHub Pages**: use `vite-plugin-gh-pages` or push `dist/` to a `gh-pages` branch
- **Cloudflare Pages**: same as above

Make sure your host is configured to handle SPA routing (rewrite all unknown paths to `/index.html`).

## License

Proprietary — © Sha Design Studio. All rights reserved.
