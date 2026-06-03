/**
 * Project data access layer.
 *
 * `projects.js` is the raw export from the Sha Design Studio data handoff
 * (single source of truth — do not edit by hand). This module normalizes it
 * for the app: image `assetPath` values ("src/assets/images/...") are
 * resolved to Vite-bundled local asset URLs in one place.
 */
import shaProjects from './projects';

// Eagerly resolve every local project image to its bundled URL.
const imageUrls = import.meta.glob(
  '../assets/images/projects/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

function resolveAssetUrl(assetPath) {
  if (!assetPath) return null;
  // Exported paths are relative to the repo root ("src/assets/...");
  // glob keys are relative to this file ("../assets/...").
  const key = assetPath.replace(/^src\/assets\//, '../assets/');
  return imageUrls[key] ?? null;
}

function normalizeImage(image) {
  if (!image) return null;
  const src = resolveAssetUrl(image.assetPath);
  if (!src) return null;
  return {
    src,
    alt: image.alt,
    caption: image.caption,
    width: image.width,
    height: image.height,
    aspectRatio: image.aspectRatio,
  };
}

/** All projects, ordered, with images resolved to local bundled URLs. */
export const projects = [...shaProjects]
  .sort((a, b) => a.order - b.order)
  .map((project) => ({
    ...project,
    heroImage: normalizeImage(project.heroImage),
    images: (project.images ?? []).map(normalizeImage).filter(Boolean),
  }));

/** Projects flagged as featured in the source data. */
export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}
