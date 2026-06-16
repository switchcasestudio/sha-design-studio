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
/**
 * Group a project's images into its product collections (e.g. the activity
 * center's Black & White / Boho Chic / … color worlds). Each image's
 * `assetPath` lives under a folder named after the product `slug`, so the
 * grouping is derived from that. Returns [] for single-collection projects so
 * the UI can fall back to the flat image list.
 */
function buildCollections(project) {
  const products = project.products ?? [];
  if (products.length < 2) return [];

  const collections = products
    .map((product) => ({
      slug: product.slug,
      title: product.title,
      sourceUrl: product.sourceUrl,
      images: (project.images ?? [])
        .filter((image) => (image.assetPath ?? '').includes(`/${product.slug}/`))
        .map(normalizeImage)
        .filter(Boolean),
    }))
    .filter((collection) => collection.images.length > 0);

  // Only meaningful when there's more than one collection to switch between.
  return collections.length > 1 ? collections : [];
}

export const projects = [...shaProjects]
  .sort((a, b) => a.order - b.order)
  .map((project) => ({
    ...project,
    heroImage: normalizeImage(project.heroImage),
    images: (project.images ?? []).map(normalizeImage).filter(Boolean),
    collections: buildCollections(project),
  }));

/** Projects flagged as featured in the source data. */
export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}
