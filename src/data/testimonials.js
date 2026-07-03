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
// TODO: verify testimonial attribution before launch. This quote names
// "Channing" and refers to interior "space" — it doesn't match Sha / Shiran
// Bar's toy & baby-product work and reads like placeholder/wrong-domain copy.
// Replace with a real client testimonial (don't invent one).
export const testimonials = [
  {
    id: 'jaya-dixon',
    name: 'Jaya Dixon',
    title: null,
    comment:
      'Channing made an extra effort to add elements that were personal to us. She made sure our space reflected us as individuals and as a family.',
    image: null,
  },
  // Placeholder #2 (client-requested) — fills the mirrored bubble until a
  // real second quote arrives. Replace name + comment before launch.
  {
    id: 'placeholder-second',
    name: 'Your name here',
    title: null,
    comment:
      'A second kind word goes here: a few lines from a brand or studio that shipped a product with Shiran.',
    image: null,
  },
];

export default testimonials;
