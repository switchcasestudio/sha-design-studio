import { useEffect, useRef } from 'react';

/**
 * Letters ⇄ shapes — the Config trick, in code. A word is sampled into dots;
 * selected letters periodically re-form their dots into a real BRAND motif
 * (the actual SVG heart / flower / star) and flow back. No Rive, no .riv.
 *
 * `morphs`: { [letterIndex]: { raw: <svg ?raw string>, color: [r,g,b] } }
 * `progressRef`: optional ref whose `.current` (0..1) drives the morph (e.g. from
 *   a ScrollTrigger). When absent, every morph-letter auto-loops on its own beat.
 */

// Turn a raw brand SVG into a solid-black silhouette data URL we can rasterise
// and sample (we only need the shape mask; colour comes from `morphs`).
function rawToSolidUrl(raw) {
  const solid = raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
    .replace(/class="[^"]*"/g, 'fill="#000"')
    .replace(/fill="[^"]*"/g, 'fill="#000"')
    .replace(/stroke="[^"]*"/g, 'stroke="#000"')
    .replace(/currentColor/g, '#000')
    .trim();
  return `data:image/svg+xml,${encodeURIComponent(solid)}`;
}

function samplePoints(octx, width, height, step) {
  const data = octx.getImageData(0, 0, width, height).data;
  const pts = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) pts.push([x, y]);
    }
  }
  return pts;
}

function LetterShapeMorph({
  text = 'Sha Design Studio',
  morphs = {},
  progressRef = null,
  baseColor = [26, 26, 26],
  background = '#f5f0e1',
  fontFamily = "'Bagel Fat One', system-ui, sans-serif",
  dotSize = 1.9,
  density = 3,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

    let raf = 0;
    let cancelled = false;
    let particles = [];
    let w = 0;
    let h = 0;
    const images = new Map(); // raw -> HTMLImageElement (solid silhouette)

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = Math.floor(w * dpr);
      off.height = Math.floor(h * dpr);
      const octx = off.getContext('2d');
      octx.scale(dpr, dpr);
      octx.textBaseline = 'middle';
      octx.textAlign = 'left';

      let fontSize = h * 0.5;
      const total = () => {
        octx.font = `${fontSize}px ${fontFamily}`;
        return octx.measureText(text).width;
      };
      while (total() > w * 0.92 && fontSize > 8) fontSize -= 2;
      const startX = (w - octx.measureText(text).width) / 2;

      const ranges = [];
      let cx = startX;
      for (let i = 0; i < text.length; i += 1) {
        const cw = octx.measureText(text[i]).width;
        ranges.push([cx, cx + cw]);
        cx += cw;
      }

      octx.fillStyle = '#000';
      octx.fillText(text, startX, h / 2);

      const step = Math.max(2, Math.floor(density * dpr));
      const byChar = {};
      samplePoints(octx, off.width, off.height, step).forEach(([px, py]) => {
        const x = px / dpr;
        const y = py / dpr;
        const ci = ranges.findIndex(([a, b]) => x >= a && x < b);
        if (ci < 0) return;
        (byChar[ci] ||= []).push([x, y]);
      });

      particles = [];
      Object.entries(byChar).forEach(([ciStr, pts]) => {
        const ci = Number(ciStr);
        const morph = morphs[ci];
        const img = morph ? images.get(morph.raw) : null;
        let shapePts = null;
        if (morph && img) {
          const xs = pts.map((p) => p[0]);
          const ys = pts.map((p) => p[1]);
          const bx = (Math.min(...xs) + Math.max(...xs)) / 2;
          const by = (Math.min(...ys) + Math.max(...ys)) / 2;
          const box =
            Math.max(
              Math.max(...xs) - Math.min(...xs),
              Math.max(...ys) - Math.min(...ys)
            ) * 1.6;
          const so = document.createElement('canvas');
          so.width = so.height = Math.max(8, Math.floor(box * dpr));
          const soc = so.getContext('2d');
          soc.scale(dpr, dpr);
          soc.drawImage(img, 0, 0, box, box);
          shapePts = samplePoints(soc, so.width, so.height, step).map(([sx, sy]) => [
            bx - box / 2 + sx / dpr,
            by - box / 2 + sy / dpr,
          ]);
        }
        pts.forEach(([gx, gy], i) => {
          const sp = shapePts && shapePts.length ? shapePts[i % shapePts.length] : null;
          particles.push({
            gx,
            gy,
            sx: sp ? sp[0] + (Math.random() - 0.5) * 3 : gx,
            sy: sp ? sp[1] + (Math.random() - 0.5) * 3 : gy,
            ci,
            morph: !!sp,
            color: sp ? morph.color : null,
            p: Math.random() * Math.PI * 2,
          });
        });
      });
    }

    const CYCLE = 5200;
    function mFor(ci, now) {
      if (reduce) return 0;
      // Scroll-driven: progress 0→0.5 letters→shapes, 0.5→1 shapes→letters,
      // each letter offset a touch so they bloom out of sync.
      if (progressRef && typeof progressRef.current === 'number') {
        const j = (((ci * 37) % 100) / 100) * 0.14 - 0.07;
        const pj = Math.min(1, Math.max(0, progressRef.current + j));
        const tri = pj < 0.5 ? pj / 0.5 : (1 - pj) / 0.5;
        return easeInOut(tri);
      }
      // Auto-loop, staggered per letter.
      const offset = (ci * 1234) % CYCLE;
      const t = ((now + offset) % CYCLE) / CYCLE;
      if (t < 0.12) return easeInOut(t / 0.12);
      if (t < 0.42) return 1;
      if (t < 0.54) return 1 - easeInOut((t - 0.42) / 0.12);
      return 0;
    }

    function render(now) {
      ctx.clearRect(0, 0, w, h);
      if (background !== 'transparent') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const m = p.morph ? mFor(p.ci, now) : 0;
        const idle = m < 0.02 ? 1 : 0;
        const x = p.gx + (p.sx - p.gx) * m + Math.cos(now / 950 + p.p) * 0.5 * idle;
        const y = p.gy + (p.sy - p.gy) * m + Math.sin(now / 1100 + p.p) * 0.5 * idle;
        if (p.color && m > 0.01) {
          const c = p.color;
          const b = baseColor;
          ctx.fillStyle = `rgb(${Math.round(b[0] + (c[0] - b[0]) * m)},${Math.round(
            b[1] + (c[1] - b[1]) * m
          )},${Math.round(b[2] + (c[2] - b[2]) * m)})`;
        } else {
          ctx.fillStyle = `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    }

    function start() {
      if (cancelled) return;
      build();
      if (reduce && !progressRef) render(0);
      else raf = requestAnimationFrame(render);
    }

    // Preload the brand-motif silhouettes, then start.
    const rawList = [...new Set(Object.values(morphs).map((m) => m.raw))];
    Promise.all(
      rawList.map(
        (raw) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = () => {
              images.set(raw, img);
              res();
            };
            img.onerror = res;
            img.src = rawToSolidUrl(raw);
          })
      )
    ).then(start);

    const onResize = () => {
      cancelAnimationFrame(raf);
      build();
      raf = requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [text, morphs, progressRef, baseColor, background, fontFamily, dotSize, density]);

  return (
    <canvas ref={canvasRef} className={`letter-shape-morph ${className}`.trim()} />
  );
}

export default LetterShapeMorph;
