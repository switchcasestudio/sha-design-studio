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

export const navigation = [
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export const footerNavigation = {
  menu: [
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/projects' },
    { label: 'About', href: '/about' },
    // In-page anchor: the contact form lives in the footer, there is no /contact route
    { label: 'Contact', href: '#contact' },
  ],
  social: [
    { label: 'Instagram', href: siteConfig.social.instagram },
    { label: 'Facebook', href: siteConfig.social.facebook },
  ],
};
