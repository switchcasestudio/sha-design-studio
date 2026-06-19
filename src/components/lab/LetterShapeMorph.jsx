import { useEffect, useRef } from 'react';

/**
 * Letters ⇄ shapes — the Config trick, in code. A word is sampled into dots;
 * selected letters periodically re-form their dots into a brand shape (heart /
 * flower / star) and flow back, each on its own staggered loop. No Rive, no
 * asset — word, letters, shapes, colours and timing are all here.
 */

// Which letter indices morph, into which shape + brand colour.
const DEFAULT_MORPHS = {
  2: { shape: 'heart', color: [229, 75, 42] }, //  a  → orange heart
  8: { shape: 'flower', color: [74, 127, 191] }, // g  → blue flower
  16: { shape: 'star', color: [242, 201, 76] }, //  o  → yellow star
};

// Fill a brand shape into octx within a centred box of `s` px. Sampled after.
function drawShape(octx, type, s) {
  const c = s / 2;
  octx.save();
  octx.fillStyle = '#000';
  octx.translate(c, c);
  if (type === 'heart') {
    const k = s * 0.018;
    octx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.02) {
      const x = 16 * Math.sin(a) ** 3;
      const y =
        -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
      if (a === 0) octx.moveTo(x * k, y * k);
      else octx.lineTo(x * k, y * k);
    }
    octx.closePath();
    octx.fill();
  } else if (type === 'flower') {
    const petal = s * 0.24;
    const r = s * 0.24;
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      octx.beginPath();
      octx.arc(Math.cos(a) * r, Math.sin(a) * r, petal, 0, Math.PI * 2);
      octx.fill();
    }
    octx.beginPath();
    octx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
    octx.fill();
  } else if (type === 'star') {
    const R = s * 0.46;
    const r = s * 0.2;
    octx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? R : r;
      const x = Math.cos(a) * rad;
      const y = Math.sin(a) * rad;
      if (i === 0) octx.moveTo(x, y);
      else octx.lineTo(x, y);
    }
    octx.closePath();
    octx.fill();
  }
  octx.restore();
}

// Sample filled-pixel points from an offscreen canvas (already drawn).
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
  morphs = DEFAULT_MORPHS,
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
    let particles = [];
    let w = 0;
    let h = 0;

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render the whole word and measure per-character x ranges.
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
      while (total() > w * 0.9 && fontSize > 8) fontSize -= 2;
      const startX = (w - octx.measureText(text).width) / 2;

      // x-range per character index (for bucketing sampled pixels into letters)
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
      // Collect glyph points grouped by character index.
      const byChar = {};
      const glyph = samplePoints(octx, off.width, off.height, step);
      glyph.forEach(([px, py]) => {
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
        let shapePts = null;
        if (morph) {
          // shape sampled into a box ~1.5x the letter, centred on it
          const xs = pts.map((p) => p[0]);
          const ys = pts.map((p) => p[1]);
          const bx = (Math.min(...xs) + Math.max(...xs)) / 2;
          const by = (Math.min(...ys) + Math.max(...ys)) / 2;
          const box = Math.max(
            Math.max(...xs) - Math.min(...xs),
            Math.max(...ys) - Math.min(...ys)
          ) * 1.55;
          const so = document.createElement('canvas');
          so.width = so.height = Math.floor(box * dpr);
          const soc = so.getContext('2d');
          soc.scale(dpr, dpr);
          drawShape(soc, morph.shape, box);
          shapePts = samplePoints(soc, so.width, so.height, step).map(([sx, sy]) => [
            bx - box / 2 + sx / dpr,
            by - box / 2 + sy / dpr,
          ]);
        }
        pts.forEach(([gx, gy], i) => {
          const sp = shapePts ? shapePts[i % shapePts.length] : null;
          particles.push({
            gx,
            gy,
            sx: sp ? sp[0] + (Math.random() - 0.5) * 3 : gx,
            sy: sp ? sp[1] + (Math.random() - 0.5) * 3 : gy,
            ci,
            morph: !!morph,
            color: morph ? morph.color : null,
            p: Math.random() * Math.PI * 2,
          });
        });
      });
    }

    // Per-letter morph value, staggered so letters bloom at different times.
    const CYCLE = 5200;
    function mFor(ci, now) {
      if (reduce) return 0;
      const offset = (ci * 1234) % CYCLE;
      const t = ((now + offset) % CYCLE) / CYCLE;
      if (t < 0.12) return easeInOut(t / 0.12); // letter → shape
      if (t < 0.42) return 1; // hold shape
      if (t < 0.54) return 1 - easeInOut((t - 0.42) / 0.12); // shape → letter
      return 0; // hold letter
    }

    function render(now) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const m = p.morph ? mFor(p.ci, now) : 0;
        const idle = m < 0.02 ? 1 : 0; // tiny breathing only when settled as letter
        const x = p.gx + (p.sx - p.gx) * m + Math.cos(now / 950 + p.p) * 0.5 * idle;
        const y = p.gy + (p.sy - p.gy) * m + Math.sin(now / 1100 + p.p) * 0.5 * idle;

        if (p.color && m > 0.01) {
          const c = p.color;
          const b = baseColor;
          const r = Math.round(b[0] + (c[0] - b[0]) * m);
          const g = Math.round(b[1] + (c[1] - b[1]) * m);
          const bl = Math.round(b[2] + (c[2] - b[2]) * m);
          ctx.fillStyle = `rgb(${r},${g},${bl})`;
        } else {
          ctx.fillStyle = `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    }

    build();
    if (reduce) render(0);
    else raf = requestAnimationFrame(render);

    const onResize = () => {
      cancelAnimationFrame(raf);
      build();
      raf = requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [text, morphs, baseColor, background, fontFamily, dotSize, density]);

  return (
    <canvas ref={canvasRef} className={`letter-shape-morph ${className}`.trim()} />
  );
}

export default LetterShapeMorph;
