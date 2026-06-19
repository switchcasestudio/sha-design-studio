import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import heart from '@/assets/svg/orange-1.svg';
import flower from '@/assets/svg/blue-2.svg';
import star from '@/assets/svg/12_star.svg';
import circle from '@/assets/svg/02_circle.svg';
import splat from '@/assets/svg/orange-3.svg';
import blobYellow from '@/assets/svg/yellow-2.svg';
import ring from '@/assets/svg/13_ring.svg';
import './HeadlineMorph.css';

// Real brand motifs (their SVGs carry their own brand colours).
const SHAPES = [heart, flower, star, circle, splat, blobYellow, ring];

function pickShapes(n) {
  const pool = [...SHAPES];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

const POP = { type: 'spring', stiffness: 380, damping: 18 };

// One letter: mostly shows the glyph; on its own random timer it pops into one
// of its brand shapes for a beat, then back.
function MorphLetter({ char, shapes, reduce }) {
  const [state, setState] = useState(0); // 0 = letter; 1..n = shapes[state-1]

  useEffect(() => {
    if (reduce) return undefined;
    const isLetter = state === 0;
    // Long pause as the letter, short hold as a shape → only ~2 letters are a
    // shape at any moment, so the wordmark stays legible.
    const delay = isLetter ? 2800 + Math.random() * 4400 : 600 + Math.random() * 800;
    const id = setTimeout(() => {
      setState(isLetter ? 1 + Math.floor(Math.random() * shapes.length) : 0);
    }, delay);
    return () => clearTimeout(id);
  }, [state, reduce, shapes.length]);

  return (
    <span className="hm__letter">
      <span className="hm__ghost" aria-hidden="true">
        {char}
      </span>
      <AnimatePresence initial={false}>
        {state === 0 ? (
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
          <motion.img
            key={`shape-${state}`}
            className="hm__face hm__shape"
            src={shapes[state - 1]}
            alt=""
            aria-hidden="true"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 45, opacity: 0 }}
            transition={POP}
          />
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Headline whose letters playfully pop between the glyph and brand motifs, each
 * on its own random clock (no scroll, no particles). Solid letters + the real
 * coloured brand SVGs.
 */
function HeadlineMorph({ text, shapesPerLetter = 2, className = '' }) {
  const reduce = useReducedMotion();
  const pools = useMemo(
    () => text.split('').map(() => pickShapes(shapesPerLetter)),
    [text, shapesPerLetter]
  );

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
              <MorphLetter key={idx} char={ch} shapes={pools[idx]} reduce={reduce} />
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default HeadlineMorph;
