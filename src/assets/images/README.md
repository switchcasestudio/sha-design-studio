# Images

Drop project, portrait, and lifestyle images here. Suggested subfolder structure:

```
images/
├── projects/        # Portfolio/project photography
├── portraits/       # Shiran's photos
├── lifestyle/       # Home/studio/work-in-progress shots
└── og/              # Open graph / social sharing images
```

Use **WebP** or **AVIF** for production and provide `.jpg` fallbacks for older browsers.

Reference images in components via Vite's import system:

```jsx
import shapeSorter from '@assets/images/projects/shape-sorter.webp';
```

Or with the `@/` alias:

```jsx
import shapeSorter from '@/assets/images/projects/shape-sorter.webp';
```
