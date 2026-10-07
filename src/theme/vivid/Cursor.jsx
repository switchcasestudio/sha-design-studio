import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { spring } from './motion';
import './Cursor.css';

/* Custom cursor for the vivid theme (fine pointers only; touch never sees it).
   A small dot tracks the pointer exactly; a ring trails it on a spring.

   States, picked from whatever is under the pointer:
   - default         dot + ring (blend mode keeps them visible on every ground)
   - interactive     a, button, [role=button], label, summary → ring swells
   - labelled        any element (or ancestor) with data-cursor="…" turns the
                     cursor into a big yolk disc with that word in it:
                       <a href="/projects/x" data-cursor="View">…</a>
                       <div data-cursor="Drag">…</div>
                     Keep labels to one short word: View, Open, Drag, Play, Read.
   - text fields     input / textarea / select / [contenteditable] → the custom
                     cursor hides and the native caret cursor shows. */
const INTERACTIVE = 'a, button, [role="button"], label, summary, select';
const TEXTY = 'input, textarea, select, [contenteditable="true"]';

function Cursor() {
  const { isVivid } = useTheme();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const active = isVivid && finePointer;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 32, mass: 0.6 });

  const [mode, setMode] = useState('default'); // default | hover | label | text
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    root.classList.add('has-vivid-cursor');

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target instanceof Element ? e.target : null;
      const labelled = el?.closest('[data-cursor]');
      if (el?.closest(TEXTY)) {
        setMode('text');
      } else if (labelled) {
        setMode('label');
        setLabel(labelled.getAttribute('data-cursor'));
      } else if (el?.closest(INTERACTIVE)) {
        setMode('hover');
      } else {
        setMode('default');
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      root.classList.remove('has-vivid-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [active, x, y]);

  if (!active) return null;

  const show = visible && mode !== 'text';
  const ringSize = mode === 'label' ? 104 : mode === 'hover' ? 64 : 36;

  return (
    <div className="vivid-cursor" aria-hidden="true">
      <motion.div
        className={`vivid-cursor__ring vivid-cursor__ring--${mode}`}
        style={{ x: rx, y: ry }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: show ? 1 : 0,
          scale: down ? 0.8 : 1,
        }}
        transition={spring.bouncy}
      >
        <AnimatePresence>
          {mode === 'label' && (
            <motion.span
              key={label}
              className="vivid-cursor__label"
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={spring.bouncy}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="vivid-cursor__dot"
        style={{ x, y }}
        animate={{
          opacity: show && mode !== 'label' ? 1 : 0,
          scale: mode === 'hover' ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}

export default Cursor;
