import { useEffect, useId, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import './TextPath.css';

/**
 * Text running along an SVG path, scrolling forever like a marquee.
 *
 * Two <textPath>s carry the same text, offset by a full path length and
 * animated in lockstep so the loop is seamless. If the text is longer than the
 * path it's compressed to the path length (lengthAdjust) so it always tiles
 * cleanly. Colour comes from the parent via `currentColor`; font from tokens.
 */
function TextPath({
  text = 'Your text goes here',
  path,
  className = '',
  duration = 21,
  reversed = false,
  fontSize = '17px',
  letterSpacing = 'normal',
  viewBox = '0 0 240 240',
  pathScale = 1,
}) {
  const id = useId();
  const pathId = `text-path-${id.replace(/[^a-zA-Z0-9-]/g, '')}`;

  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const textPath1Ref = useRef(null);
  const textPath2Ref = useRef(null);
  const measureRef = useRef(null);

  const [textLengthLimit, setTextLengthLimit] = useState(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (!pathRef.current || !measureRef.current) return;
      const pathLen = pathRef.current.getTotalLength();
      const textLen = measureRef.current.getComputedTextLength();
      setTextLengthLimit(textLen > pathLen ? pathLen : undefined);
      setIsReady(true);
    };
    measure();
    // Re-measure once the brand font loads — its metrics differ from the
    // fallback, which would otherwise mis-size the text.
    if (document.fonts?.ready) document.fonts.ready.then(measure);
  }, [text, path, fontSize, letterSpacing]);

  useGSAP(
    () => {
      // Respect reduced motion: leave the text static on the path.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'none', duration },
      });

      tl.fromTo(
        textPath1Ref.current,
        { attr: { startOffset: '0%' } },
        { attr: { startOffset: reversed ? '-100%' : '100%' } },
        0
      );
      tl.fromTo(
        textPath2Ref.current,
        { attr: { startOffset: reversed ? '100%' : '-100%' } },
        { attr: { startOffset: '0%' } },
        0
      );
    },
    { scope: containerRef, dependencies: [reversed, duration] }
  );

  return (
    <div ref={containerRef} className={`text-path ${className}`.trim()}>
      <svg
        className="text-path__svg"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `scale(${pathScale})` }}
        role="img"
        aria-label={text}
      >
        <defs>
          <path ref={pathRef} id={pathId} d={path} />
        </defs>

        {/* Hidden text, measured against the path length */}
        <text
          ref={measureRef}
          className="text-path__measure"
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          aria-hidden="true"
        >
          {text}
        </text>

        {/* Visible, looping text */}
        <text
          className="text-path__text"
          fontSize={fontSize}
          letterSpacing={letterSpacing}
          style={{ opacity: isReady ? 1 : 0 }}
        >
          <textPath
            ref={textPath1Ref}
            href={`#${pathId}`}
            startOffset="0%"
            textLength={textLengthLimit}
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </textPath>
          <textPath
            ref={textPath2Ref}
            href={`#${pathId}`}
            startOffset={reversed ? '100%' : '-100%'}
            textLength={textLengthLimit}
            lengthAdjust="spacingAndGlyphs"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default TextPath;
