import logoColorful from '@/assets/images/logo-colorful.png';
import logoWhite from '@/assets/images/logo-white.png';
import logoBlue from '@/assets/images/logo-blue.png';
import logoOrange from '@/assets/images/logo-orange.png';
import logoYellow from '@/assets/images/logo-yellow.png';

const logoMap = {
  colorful: logoColorful,
  white: logoWhite,
  blue: logoBlue,
  orange: logoOrange,
  yellow: logoYellow,
};

function Logo({
  variant = 'white',
  size = 56,
  title = 'Sha Design Studio',
  className = '',
}) {
  const logoSrc = logoMap[variant] || logoMap.white;

  return (
    <img
      src={logoSrc}
      width={size}
      height="auto"
      alt={title}
      className={className}
    />
  );
}

export default Logo;
