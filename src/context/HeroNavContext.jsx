import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tracks whether the "hero navigation" mode is active: true only on the home
 * page while the viewer is still within the hero (not scrolled past it). In that
 * state the header's text nav is hidden and the playful shape-nav lives in the
 * hero; once scrolled past, they cross-fade — shapes out, header nav in.
 */
const HeroNavContext = createContext({ heroActive: false });

export const useHeroNav = () => useContext(HeroNavContext);

export function HeroNavProvider({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Off the home page there's no hero, so the header nav is always the nav.
    if (!isHome) {
      setPastHero(true);
      return undefined;
    }
    // Hand off once the hero is well on its way out (hero is 100vh). The hero
    // content sits low on mobile, so wait until ~two-thirds scrolled — by then
    // the shape-nav is near the top edge and fades as it actually leaves, rather
    // than vanishing while still mid-screen.
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const heroActive = isHome && !pastHero;

  return (
    <HeroNavContext.Provider value={{ heroActive }}>
      {children}
    </HeroNavContext.Provider>
  );
}
