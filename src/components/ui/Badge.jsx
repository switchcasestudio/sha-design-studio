import { motion } from 'motion/react';
import { cn } from '@/utils/cn';
import './Badge.css';

function Badge({
  shape = 'flower',
  color = 'orange',
  children,
  className,
  ...props
}) {
  return (
    <motion.span
      className={cn('badge', `badge--${shape}`, `badge--${color}`, className)}
      whileHover={{ scale: 1.1, rotate: 8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      {...props}
    >
      <span className="badge__text">{children}</span>
    </motion.span>
  );
}

export default Badge;
