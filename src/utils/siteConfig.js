/**
 * Site-wide configuration.
 * Update brand details, navigation, and contact info here in one place.
 */

export const siteConfig = {
  name: 'Sha Design Studio',
  tagline: 'Designing Thoughtful Products',
  description:
    'Industrial design for toys and baby products by Shiran Bar. Simple, smart, and full of wonder.',
  designer: 'Shiran Bar',
  email: 'hayonshiran@gmail.com',
  // TODO(shiran): replace the instagram + linkedin placeholders with the real
  // studio profile URLs before launch — they currently point at the site roots.
  social: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
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
    { label: 'Work', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    // Contact lives on its own route now (the form was moved out of the footer)
    { label: 'Inquire', href: '/inquire' },
  ],
  social: [
    { label: 'Instagram', href: siteConfig.social.instagram },
    { label: 'Facebook', href: siteConfig.social.facebook },
  ],
};
