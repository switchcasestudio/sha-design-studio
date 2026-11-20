import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useTransform } from 'motion/react';
import Button from '@/components/ui/Button';
import { getProjectById } from '@/data';
import { getCaseStudy } from '@/data/caseStudies';
import { useTheme } from '@/theme/ThemeContext';
import Magnetic from '@/theme/vivid/Magnetic';
import WipeHeading from '@/theme/vivid/home/WipeHeading';
import { usePointerParallax } from '@/theme/vivid/home/usePointerParallax';
import { ease, spring } from '@/theme/vivid/motion';
import './SketchToShelf.css';

/* ==========================================================================
   Home — "From sketch to shelf". One tomato panel, inset from the window like
   the closing panel (copy left, paper stage right), that walks one real
   project through three states with a three-pill switch:

     Sketch     three drawings from Shiran's sketch sheet, in ink on paper
     Prototype  each drawing swaps for the model that was built from it
     Shelf      the three gather into the product that shipped

   Reduced motion: the switch cross-fades between the states and nothing
   else moves. Otherwise (vivid): on scroll-in the drawings draw themselves,
   then the panel plays Sketch → Prototype → Shelf once and hands over to the
   switch; pointing at a drawing peeks at its model (and back); the stage
   drifts a little against the pointer. Everything shown comes from the Ocean
   Gymini case study, which the panel links to.
   ========================================================================== */

const PROJECT_ID = 'treasure-the-ocean-gymini';

const STEPS = [
  {
    id: 'sketch',
    label: 'Sketch',
    line: 'Every product starts as a page of quick drawings.',
  },
  {
    id: 'prototype',
    label: 'Prototype',
    line: 'The promising ones get built and tested by hand.',
  },
  {
    id: 'shelf',
    label: 'Shelf',
    line: 'One makes it to the shelf: Treasure the Ocean, for Tiny Love.',
  },
];

// One slot per drawing. `model` names the case-study image it turned into;
// `depth` is how far (px) the slot drifts against the pointer; `gather` is
// where it heads as the three collapse into the finished product.
const SLOTS = [
  {
    id: 'planet',
    model: 'model-01-ringed-planet.webp',
    sketchAlt: 'Sketch of a ringed planet',
    depth: -14,
    gather: { x: '55%', y: '60%' },
  },
  {
    id: 'starfish',
    model: 'model-03-starfish-dotted.webp',
    sketchAlt: 'Sketch of a starfish with a face and hanging rings',
    depth: 10,
    gather: { x: '-75%', y: '45%' },
  },
  {
    id: 'mobile',
    model: 'model-03-starfish-final.webp',
    sketchAlt: 'Sketch of a star-shaped mobile with three hanging fish',
    depth: 22,
    gather: { x: '0%', y: '-40%' },
  },
];

// The models and the product photo already live in the case-study data, so
// the home panel and the case study can never show different files.
const stageModels = getCaseStudy(PROJECT_ID).stages.flatMap((stage) => stage.models);
const findModel = (file) =>
  stageModels.find((model) => model.assetPath.endsWith(file)) ?? null;
const product = getProjectById(PROJECT_ID);
const shelfImage = product?.heroImage ?? product?.images?.[0] ?? null;

// ----- Motion: vivid springs vs. the kit's plain 220ms swap -----
const SWAP = { duration: 0.22, ease: ease.inOut };

const vividMotion = {
  sketch: {
    on: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: ease.expoOut } },
    off: { opacity: 0, scale: 0.9, transition: SWAP },
  },
  model: {
    on: (delay) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { ...spring.bouncy, delay },
    }),
    off: { opacity: 0, scale: 0.6, y: 24, transition: SWAP },
  },
  slot: {
    here: ({ delay }) => ({
      opacity: 1,
      scale: 1,
      x: '0%',
      y: '0%',
      transition: { ...spring.soft, delay },
    }),
    gone: ({ gather }) => ({
      opacity: 0,
      scale: 0.35,
      x: gather.x,
      y: gather.y,
      transition: { duration: 0.5, ease: ease.inOut },
    }),
  },
  shelf: {
    on: { opacity: 1, scale: 1, transition: { ...spring.soft, delay: 0.3 } },
    off: { opacity: 0, scale: 0.8, transition: SWAP },
  },
  line: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.expoOut } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.18 } },
  },
};

const calmMotion = {
  sketch: { on: { opacity: 1, transition: SWAP }, off: { opacity: 0, transition: SWAP } },
  model: { on: { opacity: 1, transition: SWAP }, off: { opacity: 0, transition: SWAP } },
  slot: { here: { opacity: 1, transition: SWAP }, gone: { opacity: 0, transition: SWAP } },
  shelf: { on: { opacity: 1, transition: SWAP }, off: { opacity: 0, transition: SWAP } },
  line: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: SWAP },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },
};

// A drawing as inline SVG. The outlines are stroked one after another (vivid
// only, driven by `data-draw` in the CSS), then the whole shape fills as one
// even-odd path — the exact traced drawing.
function SketchArt({ motif, label, shown, drawn, quick }) {
  if (!motif) return null;
  return (
    <svg
      className="sts__art"
      viewBox={motif.viewBox}
      role="img"
      aria-label={label}
      aria-hidden={shown ? undefined : true}
      data-draw={drawn ? 'in' : 'out'}
      data-pace={quick ? 'quick' : undefined}
    >
      <path className="sts__art-fill" fillRule="evenodd" d={motif.fill} />
      <g className="sts__art-lines" aria-hidden="true">
        {motif.paths.map((d, i) => (
          // Late, tiny outlines (the dots) share the last beats of the stagger
          <path key={i} d={d} pathLength="1" style={{ '--i': Math.min(i, 36) }} />
        ))}
      </g>
    </svg>
  );
}

function Slot({ slot, index, motif, step, peek, onPeek, pointer, look, started, replayed, staggered }) {
  const { isVivid } = useTheme();
  const model = findModel(slot.model);
  const x = useTransform(pointer.x, (v) => v * slot.depth);
  const y = useTransform(pointer.y, (v) => v * slot.depth * 0.7);

  const gone = step === 2;
  // Pointing at a slot shows its other state: the model while sketching, the
  // drawing while prototyping.
  const flipped = peek === slot.id && Boolean(model);
  const showSketch = !gone && (step === 0) !== flipped;
  const showModel = !gone && Boolean(model) && (step === 1) !== flipped;
  // A step change cascades across the slots; a peek answers at once.
  const delay = staggered ? 0.08 + index * 0.12 : 0;

  return (
    <motion.div
      className={`sts__slot sts__slot--${slot.id}`}
      variants={look.slot}
      custom={{ delay, gather: slot.gather }}
      initial={false}
      animate={gone ? 'gone' : 'here'}
      onHoverStart={gone ? undefined : () => onPeek(slot.id)}
      onHoverEnd={() => onPeek(null)}
      {...(isVivid && !gone && model ? { 'data-cursor': 'Peek' } : {})}
    >
      <motion.div className="sts__float" style={isVivid ? { x, y } : undefined}>
        <motion.div
          className="sts__layer"
          variants={look.sketch}
          initial={false}
          animate={showSketch ? 'on' : 'off'}
        >
          <SketchArt
            motif={motif}
            label={slot.sketchAlt}
            shown={showSketch}
            drawn={started && showSketch}
            quick={replayed}
          />
        </motion.div>

        {model && (
          <motion.div
            className="sts__layer"
            variants={look.model}
            custom={delay}
            initial={false}
            animate={showModel ? 'on' : 'off'}
            aria-hidden={showModel ? undefined : true}
          >
            <img
              className="sts__model"
              src={model.src}
              alt={model.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function SketchToShelf() {
  const { isVivid } = useTheme();
  const look = isVivid ? vividMotion : calmMotion;
  const canvasRef = useRef(null);
  // Watch the stage, not the panel: on phones the copy stacks above it, and
  // the drawing-in should wait until the drawings are actually on screen.
  const inView = useInView(canvasRef, { once: true, amount: 0.5 });
  const pointer = usePointerParallax(canvasRef, isVivid);

  const [motifs, setMotifs] = useState(null);
  const [step, setStep] = useState(0);
  const [peek, setPeek] = useState(null);
  // What moved last, so a step change cascades and a peek answers instantly
  const [staggered, setStaggered] = useState(true);
  // True once the drawings have been re-entered by hand: redraws run faster
  const [replayed, setReplayed] = useState(false);
  const handsOff = useRef(true); // false once the visitor uses the switch
  const played = useRef(false);

  // The drawings' path data stays out of the main bundle until it's needed.
  useEffect(() => {
    let alive = true;
    import('@/data/sketchMotifs').then((module) => {
      if (!alive) return;
      const ready = {};
      Object.entries(module.default).forEach(([id, motif]) => {
        ready[id] = { ...motif, fill: motif.paths.join('') };
      });
      setMotifs(ready);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Vivid: wait for the panel and its drawings, then play the story once.
  const started = isVivid ? inView && Boolean(motifs) : true;
  useEffect(() => {
    if (!isVivid || !started || played.current) return undefined;
    played.current = true;
    const advance = (to) => () => {
      if (!handsOff.current) return;
      setStaggered(true);
      setStep(to);
    };
    const timers = [setTimeout(advance(1), 3400), setTimeout(advance(2), 6200)];
    return () => timers.forEach(clearTimeout);
  }, [isVivid, started]);

  const choose = (to) => {
    handsOff.current = false;
    setStaggered(true);
    setPeek(null);
    if (to === 0) setReplayed(true);
    setStep(to);
  };

  const onPeek = (id) => {
    setStaggered(false);
    if (id) setReplayed(true);
    setPeek(id);
  };

  const steps = shelfImage ? STEPS : STEPS.slice(0, 2);
  const caseStudyLink = (
    <Button as={Link} to={`/projects/${PROJECT_ID}`} variant="dark" size="lg">
      See how it took shape
    </Button>
  );

  return (
    <div className="sts panel ground-tomato">
      <div className="sts__copy">
        <WipeHeading as="h2" className="sts__title">
          From sketch to <span className="hl">shelf</span>
        </WipeHeading>

        <div className="sts__foot">
          <p className="sts__line" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={steps[step].id}
                className="sts__line-text"
                variants={look.line}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {steps[step].line}
              </motion.span>
            </AnimatePresence>
          </p>

          <div className="sts__switch" role="group" aria-label="Stage of the project">
            {steps.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="sts__step"
                aria-pressed={step === i}
                onClick={() => choose(i)}
              >
                {step === i &&
                  (isVivid ? (
                    <motion.span
                      className="sts__step-bg"
                      layoutId="sts-step"
                      transition={spring.snappy}
                    />
                  ) : (
                    <span className="sts__step-bg" />
                  ))}
                {item.label}
              </button>
            ))}
          </div>

          {isVivid ? <Magnetic>{caseStudyLink}</Magnetic> : caseStudyLink}
        </div>
      </div>

      <div className="sts__stage">
        <div ref={canvasRef} className="sts__canvas">
          {SLOTS.map((slot, i) => (
            <Slot
              key={slot.id}
              slot={slot}
              index={i}
              motif={motifs?.[slot.id]}
              step={step}
              peek={peek}
              onPeek={onPeek}
              pointer={pointer}
              look={look}
              started={started}
              replayed={replayed}
              staggered={staggered}
            />
          ))}

          {shelfImage && (
            <motion.figure
              className="sts__shelf"
              variants={look.shelf}
              initial={false}
              animate={step === 2 ? 'on' : 'off'}
              aria-hidden={step === 2 ? undefined : true}
            >
              <img
                src={shelfImage.src}
                alt={shelfImage.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </motion.figure>
          )}
        </div>
      </div>
    </div>
  );
}

export default SketchToShelf;
