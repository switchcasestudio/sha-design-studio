import './CloudBadge.css';

/**
 * Soft-blue pill badge that labels work cards (home grid + Work overview).
 * Purely visual — positioning is left to the parent's own class.
 */
function CloudBadge({ children, className = '' }) {
  return <span className={`cloud-badge ${className}`.trim()}>{children}</span>;
}

export default CloudBadge;
