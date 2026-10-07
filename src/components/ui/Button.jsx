import { cn } from '@/utils/cn';
import './Button.css';

/**
 * Everything you click is a pill. Hover is a 220ms fill swap — no scale, no
 * bounce. Variants:
 *  - capsule  the one big call to action per section (yolk → pool)
 *  - primary  tomato pill (→ ink)
 *  - yellow   yolk pill (→ pool)
 *  - outline  oat pill, the quiet default (→ ink)
 *  - dark     ink pill (→ pool)
 *  - ghost    no fill until hover
 */
function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
