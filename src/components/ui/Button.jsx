import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import './Button.css';

function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        className
      )}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export default Button;
