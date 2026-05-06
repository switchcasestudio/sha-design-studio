/**
 * Sha Design Studio logo.
 * Placeholder SVG that mimics the look of the brand mark in the screenshots.
 * Replace with the official SVG when available — drop it in src/assets/icons/logo.svg
 * and import it here.
 */
function Logo({ size = 56, variant = 'orange', title = 'Sha Design Studio' }) {
  const fill = variant === 'cream' ? 'var(--color-cream)' : 'var(--color-orange)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Stylized abstract mark — placeholder approximation */}
      <rect x="10" y="35" width="22" height="40" rx="6" fill={fill} />
      <rect x="40" y="20" width="10" height="55" rx="4" fill={fill} />
      <rect x="58" y="20" width="10" height="55" rx="4" fill={fill} />
      <rect x="76" y="35" width="14" height="40" rx="6" fill={fill} />
      <circle cx="21" cy="82" r="6" fill={fill} />
      <rect x="40" y="82" width="28" height="6" rx="3" fill={fill} />
    </svg>
  );
}

export default Logo;
