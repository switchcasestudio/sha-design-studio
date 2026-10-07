import BrandShape from '@/components/ui/BrandShape';
import './Marquee.css';

/* Endless ticker of big words separated by spinning brand shapes. Pure CSS
   loop; hovering slows it. Decorative — the same words are listed as real
   content elsewhere, so the whole strip is aria-hidden. */
function Marquee({ items, shapes = ['daisy', 'star', 'heart'], className = '' }) {
  const run = items.flatMap((item, i) => [
    <span key={`t-${i}`} className="v-marquee__word">
      {item}
    </span>,
    <BrandShape
      key={`s-${i}`}
      shape={shapes[i % shapes.length]}
      className="v-marquee__shape"
    />,
  ]);

  return (
    <div className={`v-marquee ${className}`.trim()} aria-hidden="true">
      <div className="v-marquee__track">
        <div className="v-marquee__run">{run}</div>
        <div className="v-marquee__run">{run}</div>
      </div>
    </div>
  );
}

export default Marquee;
