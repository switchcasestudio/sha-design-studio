import markFull from '@/assets/logos/sha-mark.svg';
import markOnPool from '@/assets/logos/sha-mark-on-pool.svg';
import markOnTomato from '@/assets/logos/sha-mark-on-tomato.svg';
import markOnYolk from '@/assets/logos/sha-mark-on-yolk.svg';
import markPaper from '@/assets/logos/sha-mark-paper.svg';
import horizontalFull from '@/assets/logos/sha-horizontal.svg';
import horizontalPaper from '@/assets/logos/sha-horizontal-paper.svg';

// The mark changes its coat for each ground — pick the one named for the
// colour it sits on, never move a version onto another colour.
const MARKS = {
  cream: markFull, // full colour, also on paper / oat / sand
  pool: markOnPool,
  tomato: markOnTomato,
  yolk: markOnYolk,
  night: markPaper, // one colour, on night and photos
};

const LOCKUPS = {
  cream: horizontalFull,
  night: horizontalPaper,
};

// Intrinsic aspect ratios of the kit artwork (width / height)
const RATIO = { mark: 318 / 218, horizontal: 787.15 / 210 };

function Logo({
  ground = 'cream',
  kind = 'mark',
  size = 56,
  title = 'Sha Design Studio',
  className = '',
}) {
  const set = kind === 'horizontal' ? LOCKUPS : MARKS;
  const src = set[ground] || set.cream;

  return (
    <img
      src={src}
      width={size}
      height={Math.round(size / RATIO[kind])}
      alt={title}
      className={className}
    />
  );
}

export default Logo;
