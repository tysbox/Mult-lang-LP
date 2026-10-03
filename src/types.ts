export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  bgImage: string;
  alt: string;
}

export interface SectionContent {
  id: string;
  preheading?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}   

export interface GalleryItem {
  image: string;
  alt: string;
  title: string;
  description: string;
}

export interface GallerySectionContent {
  id: string;
  title: string;
  description: string;
  items: GalleryItem[];
  dividerPattern?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteData {
  nav: NavItem[];
  hero: HeroContent;
  founder: SectionContent;
  journeys: SectionContent;
  intro: SectionContent;
  galleries: GallerySectionContent[];
  faq: {
    title: string;
    description: string;
    items: FAQItem[];
  };
  contact: {
    title: string;
    description: string;
  };
}