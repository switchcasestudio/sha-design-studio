import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names — works with strings, arrays, conditionals, and objects.
 * Uses tailwind-merge to deduplicate Tailwind utility classes (only matters
 * if React Bits components ship with Tailwind classes; harmless otherwise).
 *
 * @example
 *   cn('btn', isActive && 'btn-active', { 'btn-disabled': isDisabled })
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
