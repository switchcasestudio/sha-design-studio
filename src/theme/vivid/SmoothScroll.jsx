import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTheme } from '../ThemeContext';

/* Inertial smooth scrolling for the vivid theme only (Lenis). Lenis drives the
   native window scroll, so GSAP ScrollTrigger pins keep working; we just feed
   Lenis from GSAP's ticker and update ScrollTrigger on every Lenis scroll.
   Touch keeps native scrolling. Other vivid code can reach the instance via
   getLenis() (e.g. to stop it while a menu is open). */
let lenis = null;

// eslint-disable-next-line react-refresh/only-export-components
export function getLenis() {
  return lenis;
}

function SmoothScroll() {
  const { isVivid } = useTheme();

  useEffect(() => {
    if (!isVivid) return undefined;

    const instance = new Lenis({ lerp: 0.1, anchors: true });
    lenis = instance;
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [isVivid]);

  return null;
}

export default SmoothScroll;
