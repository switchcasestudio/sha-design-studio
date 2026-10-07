import { motion } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { ease, stagger as staggers } from './motion';

/* Animated headline text for the vivid theme. Splits a plain string into
   words (default) or characters, each rising out of a clipped line.
   In regular it returns the string unchanged.
     <h2><SplitText text="Kind" /> <span className="hl"><SplitText text="words" delay={0.2} /></span></h2>
   `trigger="view"` (default) plays on scroll-in; `trigger="mount"` plays immediately. */
function SplitText({ text, by = 'words', delay = 0, trigger = 'view', className }) {
  const { isVivid } = useTheme();
  if (!isVivid) return text;

  const parts = by === 'chars' ? Array.from(text) : text.split(/(\s+)/);
  const step = by === 'chars' ? staggers.chars : staggers.words;
  const play =
    trigger === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.6 } };

  return (
    <motion.span
      className={className}
      aria-label={text}
      style={{ display: 'inline' }}
      transition={{ staggerChildren: step, delayChildren: delay }}
      {...play}
    >
      {parts.map((part, i) =>
        /^\s+$/.test(part) ? (
          ' '
        ) : (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              paddingBottom: '0.08em',
              marginBottom: '-0.08em',
            }}
          >
            <motion.span
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              variants={{
                hidden: { y: '110%', rotate: 8 },
                show: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: ease.expoOut } },
              }}
            >
              {part}
            </motion.span>
          </span>
        )
      )}
    </motion.span>
  );
}

export default SplitText;
