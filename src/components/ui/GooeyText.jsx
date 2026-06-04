import { useEffect, useId, useRef } from 'react';
import './GooeyText.css';

/**
 * Gooey morphing text.
 *
 * Two stacked spans cross-blur while an SVG threshold filter
 * (feColorMatrix on the alpha channel) clamps the soft pixels,
 * making the letters appear to melt into each other.
 *
 * All texts are also rendered as invisible sizers in the same grid
 * cell, so the container always reserves space for the tallest
 * phrase — no layout jump between morphs.
 */
function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className = '',
  label,
}) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  // useId can contain ":" which is invalid inside url(#...)
  const filterId = `gooey-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  useEffect(() => {
    const el1 = text1Ref.current;
    const el2 = text2Ref.current;
    if (!el1 || !el2 || texts.length === 0) return undefined;

    // Respect the user's motion preference: show the first phrase, no loop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el1.textContent = texts[0];
      el1.style.opacity = '100%';
      el2.style.opacity = '0%';
      return undefined;
    }

    let rafId;
    let textIndex = texts.length - 1;
    let time = performance.now();
    let morph = 0;
    let cooldown = cooldownTime;

    el1.textContent = texts[textIndex % texts.length];
    el2.textContent = texts[(textIndex + 1) % texts.length];

    const setMorph = (fraction) => {
      el2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      el1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      el1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      el2.style.filter = '';
      el2.style.opacity = '100%';
      el1.style.filter = '';
      el1.style.opacity = '0%';
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);
      const shouldIncrementIndex = cooldown > 0;
      const dt = (now - time) / 1000;
      time = now;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          el1.textContent = texts[textIndex % texts.length];
          el2.textContent = texts[(textIndex + 1) % texts.length];
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [texts, morphTime, cooldownTime]);

  return (
    <span
      className={`gooey-text ${className}`.trim()}
      aria-label={label ?? texts.join(', ')}
    >
      <svg className="gooey-text__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <span
        className="gooey-text__stage"
        style={{ filter: `url(#${filterId})` }}
        aria-hidden="true"
      >
        {/* Invisible sizers reserve room for the tallest phrase */}
        {texts.map((text) => (
          <span key={text} className="gooey-text__sizer">
            {text}
          </span>
        ))}
        <span ref={text1Ref} className="gooey-text__morph" />
        <span ref={text2Ref} className="gooey-text__morph" />
      </span>
    </span>
  );
}

export default GooeyText;
