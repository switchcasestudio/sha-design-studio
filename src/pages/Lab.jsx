import ParticleMorph from '@/components/lab/ParticleMorph';
import LetterShapeMorph from '@/components/lab/LetterShapeMorph';
import { SHA_MORPHS } from '@/components/lab/brandMorphs';
import './Lab.css';

// Prototype playground (not linked in nav) for the Config-style motion graphics:
// the wordmark's letters bloom into real brand motifs and flow back — pure
// Canvas-2D, no dependency, no asset.
function Lab() {
  return (
    <div className="lab-page">
      <header className="lab-page__head container">
        <h1 className="lab-page__title">Motion lab</h1>
        <p className="lab-page__sub">
          Config-style letters ⇄ brand shapes — all code, no Rive/asset.
        </p>
      </header>

      <section className="lab-block container">
        <span className="lab-block__tag">★ Letters ⇄ brand motifs</span>
        <div className="lab-stage lab-stage--cream">
          <LetterShapeMorph text="Sha Design Studio" morphs={SHA_MORPHS} />
        </div>
        <p className="lab-block__note">
          The dots spell the wordmark; the <strong>a</strong> blooms into the
          orange heart, the <strong>g</strong> into the blue flower, the{' '}
          <strong>o</strong> into the yellow star — the real brand SVGs — then
          flow back, each on its own beat.
        </p>
      </section>

      <section className="lab-block container">
        <span className="lab-block__tag">Word morph (assemble / disperse)</span>
        <div className="lab-stage lab-stage--cream">
          <ParticleMorph text="Playful" color="#e54b2a" background="#f5f0e1" />
        </div>
        <div className="lab-stage lab-stage--ink">
          <ParticleMorph text="Sha" color="#f2c94c" background="#1a1a1a" />
        </div>
      </section>
    </div>
  );
}

export default Lab;
