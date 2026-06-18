import TrailingCursorText from '@/components/ui/TrailingCursorText';

/**
 * Scratch page to preview the cursor-trailing text component in isolation.
 * Move the cursor around — the tagline trails behind it.
 */
function Playground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#e9e9e9',
        cursor: 'crosshair',
      }}
    >
      <TrailingCursorText />
    </div>
  );
}

export default Playground;
