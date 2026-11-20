/* ==========================================================================
   Site motion. The site ships one look: the animated ("vivid") one, Shiran's
   pick. It honours the visitor's reduced-motion setting by falling back to
   the calm paths — every vivid effect is gated on `useTheme().isVivid` in JS,
   or on `html[data-motion='vivid']` in CSS (index.html sets that attribute;
   CSS that moves things adds its own reduced-motion query).

   There used to be a second, switchable "regular" theme with a floating
   switcher (`?themes`). Both were retired on 2026-11-20. The calm code paths
   stay: they are what reduced-motion visitors get.
   ========================================================================== */
import { createContext, useContext } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ThemeContext = createContext({ isVivid: true, reduced: false });

export function ThemeProvider({ children }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <ThemeContext.Provider value={{ isVivid: !reduced, reduced }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
