import ParticleMorph from '@/components/lab/ParticleMorph';
import RiveStage from '@/components/lab/RiveStage';
import sampleRiv from '@/assets/rive/sample.riv?url';
import './Lab.css';

// Prototype playground (not linked in nav) for the Config-style motion graphics
// exploration. Two approaches side by side:
//   1. ParticleMorph — vanilla Canvas-2D, our own brand word morphing from a
//      particle cloud. No dependency, no asset, fully editable in code.
//   2. RiveStage — the @rive-app/react-canvas runtime (what Figma uses), shown
//      with a placeholder sample .riv to swap for a brand-authored file.
function Lab() {
  return (
    <div className="lab-page">
      <header className="lab-page__head container">
        <h1 className="lab-page__title">Motion lab</h1>
        <p className="lab-page__sub">
          Two ways to do the Config-style shape ⇄ particle morph.
        </p>
      </header>

      <section className="lab-block container">
        <span className="lab-block__tag">1 · Canvas-2D particles (ours)</span>
        <div className="lab-stage lab-stage--cream">
          <ParticleMorph text="Playful" color="#e54b2a" background="#f5f0e1" />
        </div>
        <div className="lab-stage lab-stage--ink">
          <ParticleMorph text="Sha" color="#f2c94c" background="#1a1a1a" />
        </div>
        <p className="lab-block__note">
          Word, font, colour and timing are all code — no external file. Loops:
          assemble → hold → disperse.
        </p>
      </section>

      <section className="lab-block container">
        <span className="lab-block__tag">2 · Rive runtime (what Figma uses)</span>
        <div className="lab-stage lab-stage--cream">
          <RiveStage src={sampleRiv} />
        </div>
        <p className="lab-block__note">
          Placeholder sample .riv. The real version needs a brand-authored .riv
          from the Rive editor; the runtime is now installed and wired.
        </p>
      </section>
    </div>
  );
}

export default Lab;
