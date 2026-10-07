/* ==========================================================================
   Site theme — "regular" (the brand-kit site as shipped) or "vivid" (the
   animated exploration). Vivid is a layer on top of regular: every vivid
   effect is gated on `useTheme().isVivid` in JS, or on
   `html[data-motion='vivid']` in CSS, so regular renders exactly as before.

   The switcher is for showing Shiran both versions. It appears only after
   visiting any page with `?themes` in the URL (remembered per browser);
   `?themes=off` hides it again and drops back to regular. With the switcher
   on, `?theme=vivid` or `?theme=regular` picks a theme from the link.
   ========================================================================== */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const THEME_KEY = 'sha-theme';
const SWITCHER_KEY = 'sha-theme-switcher';
const THEMES = ['regular', 'vivid'];

const ThemeContext = createContext({
  theme: 'regular',
  isVivid: false,
  reduced: false,
  switcherEnabled: false,
  setTheme: () => {},
});

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value == null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage blocked — the choice just won't persist */
  }
}

function initialSwitcher() {
  if (typeof window === 'undefined') return false;
  const param = new URLSearchParams(window.location.search).get('themes');
  if (param === 'off') {
    write(SWITCHER_KEY, null);
    write(THEME_KEY, null);
    return false;
  }
  if (param !== null) {
    write(SWITCHER_KEY, '1');
    return true;
  }
  return read(SWITCHER_KEY) === '1';
}

export function ThemeProvider({ children }) {
  const [switcherEnabled] = useState(initialSwitcher);
  const [theme, setThemeState] = useState(() => {
    if (!switcherEnabled) return 'regular';
    // `?theme=vivid` opens straight into a theme (handy for sharing links)
    const fromUrl = new URLSearchParams(window.location.search).get('theme');
    if (THEMES.includes(fromUrl)) {
      write(THEME_KEY, fromUrl);
      return fromUrl;
    }
    const saved = read(THEME_KEY);
    return THEMES.includes(saved) ? saved : 'regular';
  });
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    write(THEME_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        // Vivid honours reduced motion by falling back to the regular site.
        isVivid: theme === 'vivid' && !reduced,
        reduced,
        switcherEnabled,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
