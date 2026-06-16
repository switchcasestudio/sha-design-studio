/* ==========================================================================
   GSAP setup — single registration point for the one scroll-pinned section.

   GSAP + ScrollTrigger is a deliberate, scoped exception to the site's
   "Framer Motion only" rule: Framer Motion can't truly pin an element, and the
   pin is the core of the home assemble. Everything else stays on Framer Motion.
   ========================================================================== */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
