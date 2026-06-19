import { useRive } from '@rive-app/react-canvas';

/**
 * Thin wrapper around the Rive web runtime — this is the exact pipeline
 * config.figma.com uses (the rive.wasm runtime drawing a .riv to a <canvas>).
 *
 * IMPORTANT: Rive renders nothing without a `.riv` file, which is authored in
 * the Rive editor (rive.app) — you can't generate one from code. The `src` here
 * points at a public Rive *sample* purely to prove the runtime renders in our
 * app. Swap it for a brand-authored `.riv` (e.g. a "Sha" wordmark morph) to ship
 * the real thing, and drive `stateMachines` inputs from scroll/hover.
 */
function RiveStage({ src, stateMachines, artboard, className = '' }) {
  const { RiveComponent } = useRive({
    src,
    stateMachines,
    artboard,
    autoplay: true,
  });

  return <RiveComponent className={`rive-stage ${className}`.trim()} />;
}

export default RiveStage;
