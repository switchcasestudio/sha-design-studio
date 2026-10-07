import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';
import './ThemeSwitcher.css';

const OPTIONS = [
  { value: 'regular', label: 'Regular' },
  { value: 'vivid', label: 'Animated' },
];

/* Floating pill at the bottom of the screen for comparing site themes.
   Only rendered when the switcher was unlocked with `?themes`. */
function ThemeSwitcher() {
  const { theme, setTheme, switcherEnabled, reduced } = useTheme();
  if (!switcherEnabled) return null;

  return (
    <div className="theme-switcher" role="group" aria-label="Select a theme">
      <span className="theme-switcher__label">Select a theme</span>
      <div className="theme-switcher__track">
        {OPTIONS.map((opt) => {
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className="theme-switcher__option"
              aria-pressed={active}
              onClick={() => setTheme(opt.value)}
            >
              {active && (
                <motion.span
                  layoutId="theme-switcher-thumb"
                  className="theme-switcher__thumb"
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                />
              )}
              <span className="theme-switcher__text">{opt.label}</span>
            </button>
          );
        })}
      </div>
      {reduced && theme === 'vivid' && (
        <span className="theme-switcher__note">
          Reduced motion is on in this device&apos;s settings
        </span>
      )}
    </div>
  );
}

export default ThemeSwitcher;
