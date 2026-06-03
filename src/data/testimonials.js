/**
 * Client testimonials for the "Kind Words" section.
 *
 * Shape:
 *  - name     (required) client name
 *  - title    (optional) client role/title — rendered only when set
 *  - comment  (required) the quote, without surrounding quotation marks
 *  - image    (optional) client photo — import the asset and reference it,
 *             e.g. `import jaya from '@/assets/images/testimonials/jaya.jpg'`
 */
export const testimonials = [
  {
    id: 'jaya-dixon',
    name: 'Jaya Dixon',
    title: null,
    comment:
      'Channing made an extra effort to add elements that were personal to us. She made sure our space reflected us as individuals and as a family.',
    image: null,
  },
];

export default testimonials;
