import HeadlineMorph from '@/components/ui/HeadlineMorph';
import './Lab.css';

// Prototype playground (not linked in nav). Solid letters that pop between the
// glyph and brand motifs, each on its own random clock — no scroll, no dots.
function Lab() {
  return (
    <div className="lab-page">
      <header className="lab-page__head container">
        <h1 className="lab-page__title">Motion lab</h1>
        <p className="lab-page__sub">Letters ⇄ brand motifs, on random timers.</p>
      </header>

      <section className="lab-block container">
        <span className="lab-block__tag">★ Headline morph (live on the home hero)</span>
        <div className="lab-stage lab-stage--cream lab-stage--center">
          <span className="lab-headline">
            <HeadlineMorph text="Sha Design Studio" />
          </span>
        </div>
        <p className="lab-block__note">
          Each letter mostly shows the glyph and, on its own random beat, pops
          into one of its brand motifs (heart / flower / star / circle / splat /
          ring) and back. Solid — no particles, no scrolling.
        </p>
      </section>
    </div>
  );
}

export default Lab;
