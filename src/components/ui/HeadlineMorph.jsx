import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { GEO } from '@/components/ui/BrandShape';
import './HeadlineMorph.css';

// Geometry comes from the shared BrandShape registry (colour-agnostic paths
// routed through `currentColor`). This component owns the per-letter morph
// timing; the shapes themselves are the same set used everywhere else.

// Brand tints. `excludeColors` (e.g. ['red'] in the hero) drops a tint so the
// shapes never blend into the red wordmark.
const PALETTE = {
  red: 'var(--tomato)',
  blue: 'var(--pool)',
  yellow: 'var(--yolk)',
};

// Each letter morphs only into geometry that loosely echoes its silhouette, so
// the swap still reads as that letter. Entries are [geoKey] or [geoKey, rotDeg]
// when a shape needs turning (e.g. the blob flipped 180° for 'h'). Tint is
// chosen separately at runtime, so colour balance isn't baked in here.
const LETTER_SHAPES = {
  s: [['splat1'], ['splat2']],
  h: [['blob3', 180], ['blob1', 180]],
  a: [['blob1'], ['blob2'], ['daisy']],
  d: [['ring'], ['blob1']],
  e: [['ring'], ['daisy']],
  i: [['star'], ['tulip']],
  g: [['ring'], ['blob3']],
  n: [['blob1'], ['blob2']],
  t: [['clover'], ['star']],
  u: [['tulip'], ['blob1']],
  o: [['ring'], ['tulip'], ['flower2'], ['heart']],
};

// Any letter without its own mapping falls back to a few round/blobby motifs.
const FALLBACK = [['blob1'], ['daisy'], ['ring']];

// Never let more than this many letters be a shape at once — keeps the wordmark
// readable no matter how the per-letter clocks line up.
const MAX_SHAPES = 5;

// Resolve a char to its candidate geometries ({ geo, html, rot }).
function candidatesFor(char) {
  const defs = LETTER_SHAPES[char.toLowerCase()] || FALLBACK;
  return defs.map(([geo, rot = 0]) => ({ geo, html: GEO[geo], rot }));
}

// Pick the least-used allowed tint among the currently active shapes (ties
// broken at random) so blue/yellow stay roughly balanced across the wordmark.
function pickColor(active, allowed) {
  const counts = Object.fromEntries(allowed.map((c) => [c, 0]));
  active.forEach((s) => {
    if (counts[s.colorKey] != null) counts[s.colorKey] += 1;
  });
  const min = Math.min(...allowed.map((c) => counts[c]));
  const least = allowed.filter((c) => counts[c] === min);
  return least[Math.floor(Math.random() * least.length)];
}

const POP = { type: 'spring', stiffness: 380, damping: 18 };

// Presentational only — the parent owns timing/coordination and passes `state`
// (null = glyph; otherwise { html, geo, rot, color }). `rot` is only ever a
// 180 flip (axis-preserving, never a tilt) and the shape is tinted via the
// wrapper's `color`.
function MorphLetter({ char, state }) {
  const rot = state ? state.rot : 0;

  return (
    <span className="hm__letter">
      <span className="hm__ghost" aria-hidden="true">
        {char}
      </span>
      <AnimatePresence initial={false}>
        {!state ? (
          <motion.span
            key="glyph"
            className="hm__face"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={POP}
          >
            {char}
          </motion.span>
        ) : (
          <motion.span
            key={`shape-${state.geo}`}
            className="hm__face hm__shape"
            style={{ color: state.color }}
            initial={{ scale: 0, rotate: rot, opacity: 0 }}
            animate={{ scale: 1, rotate: rot, opacity: 1 }}
            exit={{ scale: 0, rotate: rot, opacity: 0 }}
            transition={POP}
            dangerouslySetInnerHTML={{ __html: state.html }}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Headline whose letters playfully pop between the glyph and brand motifs, each
 * on its own random clock (no scroll, no particles). Solid letters + recoloured
 * brand SVG paths.
 *
 * Each letter only morphs into shapes that resemble it (see LETTER_SHAPES).
 * Coordination lives here so we can keep it legible: at most MAX_SHAPES shapes
 * at once, never two reading-order neighbours together, and never the same
 * geometry twice at the same time. Tints are picked to stay balanced, minus any
 * `excludeColors` (the hero passes ['red'] to stay off the red wordmark).
 */
function HeadlineMorph({ text, className = '', excludeColors = [] }) {
  const reduce = useReducedMotion();
  const chars = useMemo(() => text.split(''), [text]);
  const pools = useMemo(() => chars.map((c) => candidatesFor(c)), [chars]);

  const exKey = excludeColors.join('|');
  const allowed = useMemo(
    () => Object.keys(PALETTE).filter((k) => !excludeColors.includes(k)),
    // exKey captures excludeColors' contents; the array ref itself is unstable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exKey]
  );

  // Char indices that are actual letters (spaces never morph). Adjacency is
  // measured in this reading order, so a space doesn't count as a neighbour.
  const letterIndices = useMemo(
    () => chars.map((c, i) => (c === ' ' ? -1 : i)).filter((i) => i >= 0),
    [chars]
  );

  // state[i]: null = glyph, else the active shape descriptor. One per char.
  const [states, setStates] = useState(() => chars.map(() => null));

  // Keep a live ref so the self-rescheduling timers always read the latest
  // committed states without re-running the effect on every flip.
  const statesRef = useRef(states);
  statesRef.current = states;

  useEffect(() => {
    if (reduce) return undefined;

    const order = letterIndices;
    const posOf = new Map(order.map((ci, p) => [ci, p]));
    const timers = new Map();

    const schedule = (ci, first = false) => {
      const isLetter = !statesRef.current[ci];
      // `first`: stagger the opening morphs into the first ~1.8s so the effect
      // announces itself right away (otherwise a visitor may scroll past before
      // a single letter pops). After that, a lively-but-readable cadence — a
      // moderate stretch as the letter, a brief hold as the shape, randomised so
      // the letters don't pulse in lockstep.
      const delay = first
        ? 300 + Math.random() * 1500
        : isLetter
          ? 2200 + Math.random() * 3500
          : 900 + Math.random() * 900;
      timers.set(ci, setTimeout(() => tick(ci), delay));
    };

    const tick = (ci) => {
      const cur = statesRef.current;
      if (!cur[ci]) {
        const p = posOf.get(ci);
        const prev = order[p - 1];
        const next = order[p + 1];
        const active = cur.filter(Boolean);
        const neighbourShape =
          (prev != null && cur[prev]) || (next != null && cur[next]);

        // Become a shape only if under the global cap, no neighbour is a shape,
        // and a geometry not already on screen is available (no dupes at once).
        if (active.length < MAX_SHAPES && !neighbourShape) {
          const used = new Set(active.map((s) => s.geo));
          const choices = pools[ci].filter((c) => !used.has(c.geo));
          if (choices.length > 0) {
            const pick = choices[Math.floor(Math.random() * choices.length)];
            const colorKey = pickColor(active, allowed);
            setStates((s) => {
              const n = [...s];
              n[ci] = {
                html: pick.html,
                geo: pick.geo,
                rot: pick.rot,
                colorKey,
                color: PALETTE[colorKey],
              };
              return n;
            });
          }
        }
        // If blocked, leave it as a letter and just try again next cycle.
      } else {
        setStates((s) => {
          const n = [...s];
          n[ci] = null;
          return n;
        });
      }
      schedule(ci);
    };

    order.forEach((ci) => schedule(ci, true));
    return () => timers.forEach((id) => clearTimeout(id));
  }, [reduce, letterIndices, pools, allowed]);

  // Group letters into words so a word never breaks across lines — only the
  // spaces between words are wrap opportunities.
  const words = [];
  let gi = 0;
  text.split(' ').forEach((word) => {
    words.push(word.split('').map((ch) => ({ ch, idx: gi++ })));
    gi += 1; // skip the space index
  });

  return (
    <span className={`hm ${className}`.trim()} aria-label={text} role="img">
      {words.map((letters, wi) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`w-${wi}`}>
          {wi > 0 && <span className="hm__space"> </span>}
          <span className="hm__word">
            {letters.map(({ ch, idx }) => (
              <MorphLetter key={idx} char={ch} state={states[idx]} />
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default HeadlineMorph;
