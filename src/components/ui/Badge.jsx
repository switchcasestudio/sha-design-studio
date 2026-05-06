import { cn } from '@/utils/cn';
import './Badge.css';

/**
 * Decorative badge — the flower or cloud-shaped labels seen on portfolio
 * thumbnails ("Way cool!", "Sorter", "Activity center", "Hello!", "Gymini").
 *
 * shape: flower | cloud
 * color: orange | yellow | blue
 */
function Badge({
  shape = 'flower',
  color = 'orange',
  children,
  className,
  ...props
}) {
  return (
    <span
      className={cn('badge', `badge--${shape}`, `badge--${color}`, className)}
      {...props}
    >
      <span className="badge__text">{children}</span>
    </span>
  );
}

export default Badge;
