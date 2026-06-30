import { cn } from '@/utils/cn';
import './Marquee.css';

/**
 * Seamless infinite marquee — scrolls its children right-to-left forever.
 * `children` are rendered in two identical groups; the track translates by
 * one group width and loops, so the join is invisible. The duplicate group is
 * aria-hidden so assistive tech reads the set once. Pauses on hover and stops
 * under prefers-reduced-motion.
 *
 * Vanilla-CSS counterpart of the InfiniteSlider the brief referenced.
 *
 * @param {number} speed  seconds for one full loop (higher = slower)
 * @param {string} gap    CSS length between items (default: a brand token)
 */
export function Marquee({
  children,
  speed = 40,
  gap = 'var(--space-16)',
  className,
  ...props
}) {
  return (
    <div className={cn('marquee', className)} {...props}>
      <div
        className="marquee__track"
        style={{ '--marquee-duration': `${speed}s`, '--marquee-gap': gap }}
      >
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
