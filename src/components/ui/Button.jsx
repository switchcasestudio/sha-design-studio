import { cn } from '@/utils/cn';
import './Button.css';

/**
 * Polymorphic button — renders as <button>, <a>, or any other component
 * via the `as` prop.
 *
 * Variants: primary | outline | ghost | dark
 * Sizes:    sm | md | lg
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
      className={cn(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
