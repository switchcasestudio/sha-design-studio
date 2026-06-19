import { useEffect, useRef } from 'react';

/**
 * Canvas-2D particle morph — the "Config" effect, built from scratch (no Rive,
 * no asset). A word is sampled into a cloud of dots that assemble into the solid
 * letterforms, hold, then disperse — looping. This is the same idea as Figma's
 * Config motion (shape ⇄ scattered particles), authored entirely in code so it
 * uses our own brand word, font and colours.
 *
 * How it works:
 *  1. Render the word to an offscreen canvas, read its pixels, and collect a
 *     target point everywhere a glyph is filled (sampled on a jittered grid).
 *  2. Give every particle a random "scattered" origin and its glyph "target".
 *  3. Each frame, lerp every particle between scatter↔target by a global morph
 *     value `m` that loops (assemble → hold → disperse → hold), with a little
 *     idle drift so it always feels alive.
 */
function ParticleMorph({
  text = 'Playful',
  color = '#e54b2a',
  background = '#f5f0e1',
  fontFamily = "'Bagel Fat One', system-ui, sans-serif",
  dotSize = 2.1,
  density = 4, // sample step in px — smaller = more particles
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let particles = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

    // Sample target points from the rendered word.
    function buildTargets() {
      const off = document.createElement('canvas');
      off.width = Math.floor(w * dpr);
      off.height = Math.floor(h * dpr);
      const octx = off.getContext('2d');
      octx.scale(dpr, dpr);

      // Fit the word to ~82% of the width.
      let fontSize = h * 0.62;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      const fit = () => {
        octx.font = `${fontSize}px ${fontFamily}`;
        return octx.measureText(text).width;
      };
      while (fit() > w * 0.82 && fontSize > 8) fontSize -= 2;

      octx.fillStyle = '#000';
      octx.fillText(text, w / 2, h / 2);

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.floor(density * dpr));
      const targets = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const alpha = img[(y * off.width + x) * 4 + 3];
          if (alpha > 128) {
            targets.push({
              tx: x / dpr + (Math.random() - 0.5) * (step / dpr),
              ty: y / dpr + (Math.random() - 0.5) * (step / dpr),
            });
          }
        }
      }
      return targets;
    }

    function init() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targets = buildTargets();
      particles = targets.map((t) => {
        const a = Math.random() * Math.PI * 2;
        const r = Math.max(w, h) * (0.35 + Math.random() * 0.5);
        return {
          tx: t.tx,
          ty: t.ty,
          // scattered origin: a wide ring around the centre
          sx: w / 2 + Math.cos(a) * r,
          sy: h / 2 + Math.sin(a) * r * 0.6,
          // idle drift phase
          p: Math.random() * Math.PI * 2,
          s: 0.4 + Math.random() * 0.8,
        };
      });
    }

    // Loop the morph value 0→1→0 with holds. One full cycle ≈ 7s.
    const CYCLE = 7000;
    function morphAt(now) {
      if (reduce) return 1; // assembled, static
      const t = (now % CYCLE) / CYCLE;
      if (t < 0.06) return easeInOut(t / 0.06); // assemble
      if (t < 0.55) return 1; // hold assembled
      if (t < 0.68) return 1 - easeInOut((t - 0.55) / 0.13); // disperse
      return 0; // hold scattered
    }

    function render(now) {
      const m = morphAt(now);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;

      const drift = (1 - m) * 22; // scattered particles wander more
      for (let i = 0; i < particles.length; i += 1) {
        const pt = particles[i];
        const idleX = Math.cos(now / 900 + pt.p) * (0.6 + drift) * pt.s;
        const idleY = Math.sin(now / 1100 + pt.p) * (0.6 + drift) * pt.s;
        const x = pt.sx + (pt.tx - pt.sx) * m + idleX;
        const y = pt.sy + (pt.ty - pt.sy) * m + idleY;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    }

    init();
    if (reduce) {
      render(0); // single static assembled frame
    } else {
      raf = requestAnimationFrame(render);
    }

    const onResize = () => {
      cancelAnimationFrame(raf);
      init();
      raf = requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);

    // Re-sample once the brand font has loaded (metrics differ from fallback).
    if (document.fonts?.ready) document.fonts.ready.then(onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [text, color, background, fontFamily, dotSize, density]);

  return <canvas ref={canvasRef} className={`particle-morph ${className}`.trim()} />;
}

export default ParticleMorph;
