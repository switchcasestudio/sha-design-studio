import { cn } from '@/utils/cn';
import { useTheme } from '@/theme/ThemeContext';
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
 *
 * Vivid theme: the hover colour sweeps up from below as a circle, the label
 * rolls up to a copy of itself, and the pill springs a little larger.
 */
function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const { isVivid } = useTheme();

  return (
    <Component
      className={cn('btn', `btn--${variant}`, `btn--${size}`, className)}
      {...props}
    >
      {isVivid ? (
        <span className="btn__roll">
          <span className="btn__roll-face">{children}</span>
          <span className="btn__roll-face btn__roll-copy" aria-hidden="true">
            {children}
          </span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
}

export default Button;
