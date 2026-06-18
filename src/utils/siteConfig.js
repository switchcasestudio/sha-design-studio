/**
 * Site-wide configuration.
 * Update brand details, navigation, and contact info here in one place.
 */

export const siteConfig = {
  name: 'Sha Design Studio',
  tagline: 'Designing Playful Thoughtful Products',
  description:
    'Industrial design for toys and baby products by Shiran Bar. Simple, smart, and full of wonder.',
  designer: 'Shiran Bar',
  email: 'hello@shadesignstudio.com',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
  },
};

// Nav label unified to "Work" across navbar, footer and the page H1 (was
// "Projects" here / "Work" in footer / "Portfolio" as the H1 — three names for
// one destination). Route stays /projects.
export const navigation = [
  { label: 'Work', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export const footerNavigation = {
  menu: [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/projects' },
    { label: 'About', href: '/about' },
    // Contact lives on its own route now (the form was moved out of the footer)
    { label: 'Inquire', href: '/inquire' },
  ],
  social: [
    { label: 'Instagram', href: siteConfig.social.instagram },
    { label: 'Facebook', href: siteConfig.social.facebook },
  ],
};
