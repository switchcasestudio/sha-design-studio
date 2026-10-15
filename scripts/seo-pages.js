import fs from 'node:fs';
import path from 'node:path';
import { shaProjects } from '../src/data/projects.js';

/* Build-time SEO files for the SPA.
   - Reads the public routes straight from src/App.jsx (and the project ids
     from the data) so the list can't drift from the router.
   - Writes dist/sitemap.xml.
   - Writes one HTML copy per route (dist/about.html, dist/projects/<id>.html…)
     whose canonical and og:url name that route. Cloudflare Pages serves
     /about from about.html, so crawlers and social scrapers see the right URL
     without running JS.
   - Writes dist/404.html: noindex, no canonical, no og:url. Its presence also
     switches Cloudflare Pages off the SPA fallback, so unknown URLs answer 404
     (rendering the app's NotFound page) instead of a 200 copy of the home page.
     Every real route has its own file above, so deep links still work. */

// Routes that exist but aren't public pages
const HIDDEN = new Set(['lab']);

function readRoutes(appFile) {
  const src = fs.readFileSync(appFile, 'utf8');
  const paths = [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const routes = ['/'];
  for (const p of paths) {
    if (p === '/' || p === '*' || HIDDEN.has(p)) continue;
    if (p === 'projects/:projectId') {
      const ids = [...shaProjects].sort((a, b) => a.order - b.order).map((x) => x.id);
      routes.push(...ids.map((id) => `/projects/${id}`));
    } else if (p.includes(':')) {
      throw new Error(`seo-pages: no expansion for dynamic route "${p}"`);
    } else {
      routes.push(`/${p}`);
    }
  }
  return routes;
}

function notFoundPage(html) {
  const out = html
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace(/\s*<meta property="og:url"[^>]*>/, '')
    .replace(/<title>[^<]*<\/title>/, '<title>Page not found — Sha Design Studio</title>')
    .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex" />');
  if (
    !out.includes('content="noindex"') ||
    out.includes('rel="canonical"') ||
    out.includes('og:url')
  ) {
    throw new Error('seo-pages: 404.html needs noindex and no canonical / og:url');
  }
  return out;
}

function withUrl(html, url) {
  const out = html
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  if (!out.includes(`href="${url}"`) || !out.includes(`content="${url}"`)) {
    throw new Error('seo-pages: canonical or og:url tag missing from index.html');
  }
  return out;
}

export default function seoPages({ site }) {
  let outDir;
  let root;
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(root, config.build.outDir);
    },
    closeBundle() {
      const routes = readRoutes(path.join(root, 'src/App.jsx'));
      const index = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');

      for (const route of routes) {
        const url = `${site}${route}`;
        const file =
          route === '/' ? 'index.html' : `${route.slice(1)}.html`;
        const dest = path.join(outDir, file);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, withUrl(index, url));
      }

      fs.writeFileSync(path.join(outDir, '404.html'), notFoundPage(index));

      const urls = routes
        .map((r) => `  <url>\n    <loc>${site}${r}</loc>\n  </url>`)
        .join('\n');
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      );
    },
  };
}
