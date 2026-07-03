import { useRef } from 'react';
import { siteConfig } from '@/utils/siteConfig';
import HeadlineMorph from '@/components/ui/HeadlineMorph';
import HeroNav from '@/components/ui/HeroNav';
import HeroToys from '@/components/sections/HeroToys';
import './HomeAssemble.css';

// 100vh brand hero: just the centred wordmark. Its letters morph between glyphs
// and brand motifs (HeadlineMorph) and a cursor follower trails inside the
// section (bound in Layout). The decorative scattered motifs were removed — the
// type-driven effect carries the playfulness on its own.
function HomeAssemble() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="home-assemble">
      {/* Product photos scattered like toys in the hero's empty cream pockets —
          decorative, draggable, and the first hint of real work on the page. */}
      <HeroToys />

      <div className="home-assemble__inner">
        <p className="home-assemble__brand">Designing Playful Products</p>
        {/* Solid wordmark whose letters playfully pop between the glyph and brand
            motifs, each on its own random clock. */}
        <h1 className="home-assemble__headline">
          {/* Drop red motifs here so the shapes never blend into the red
              wordmark — only blue/yellow shapes pop in the hero. */}
          <HeadlineMorph text={siteConfig.name} excludeColors={['red']} />
        </h1>
      </div>

      {/* The site nav, living in the hero as labelled brand shapes scattered
          around the section. Fades up into the header nav as the viewer scrolls
          past the hero. */}
      <HeroNav />
    </section>
  );
}

export default HomeAssemble;
