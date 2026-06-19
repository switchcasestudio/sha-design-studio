/**
 * Normalize a raw (?raw) brand SVG into a colourable inline string: drop the XML
 * prolog and the <defs><style> fill, then route the path through `currentColor`
 * so a wrapper's CSS `color` tints it. Decouples a shape's geometry from colour.
 */
export function inlineSvg(raw) {
  return raw
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
    .replace(/class="cls-\d+"/g, 'fill="currentColor"')
    .replace(/#(?:[0-9a-fA-F]{3}){1,2}\b/g, 'currentColor')
    .trim();
}
