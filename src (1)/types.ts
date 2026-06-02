export interface Subtopic {
  title: string;
  img: string | null;
  items: string[];
}

export interface Area {
  name: string;
  color: string;
  colorSoft: string;
  icon: string;
  img: string;
  desc: string;
  subtopics: Subtopic[];
  testimonial: string;
  testimonialAuthor: string;
}

export interface AreaGroup {
  [key: string]: Area;
}

export interface NewsContent {
  date: string;
  headline: string;
  link?: string;
  linkAlt?: string;
  body: string;
  body2?: string;
}

export interface NewsSectionTexts {
  title: string;
  item1: NewsContent;
  item2: NewsContent;
  nl: {
    title: string;
    subtitle: string;
    namePh: string;
    emailPh: string;
    btn: string;
    ok: string;
    disclaimer: string;
  };
}

export interface AboutSectionTexts {
  title: string;
  subtitle: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  testimonial: string;
  testimonialAuthor: string;
  testimonialRole: string;
}

export interface AreasSectionTexts {
  title: string;
  learnMore: string;
}

export interface ResearchContent {
  date: string;
  headline: string;
  author: string;
  cta: string;
  body1: string;
  body2?: string;
  body3?: string;
}

export interface ResearchSectionTexts {
  title: string;
  item1: ResearchContent;
}

export interface ContactSectionTexts {
  title: string;
  subtitle: string;
  body: string;
  cta1: string;
  cta2: string;
}

export interface FooterSectionTexts {
  tagline: string;
  rights: string;
}

export interface NavTexts {
  home: string;
  news: string;
  about: string;
  areas: string;
  research: string;
  contact: string;
}

export interface ModalTexts {
  close: string;
  testimonialLabel: string;
}

export interface LocalizedTexts {
  nav: NavTexts;
  hero: {
    tag1: string;
    tag2: string;
    tag3: string;
    subtitle: string;
    cta: string;
    ctaSub: string;
  };
  news: NewsSectionTexts;
  about: AboutSectionTexts;
  areas: AreasSectionTexts;
  research: ResearchSectionTexts;
  contact: ContactSectionTexts;
  footer: FooterSectionTexts;
  modal: ModalTexts;
}

export interface DynamicNewsItem {
  id: string;
  date: { pt: string; en: string };
  headline: { pt: string; en: string };
  body: { pt: string; en: string };
  body2?: { pt: string; en: string };
  linkUrl?: string;
  linkText?: { pt: string; en: string };
  linkAltUrl?: string;
  linkAltText?: { pt: string; en: string };
  isAward?: boolean;
  isFeaturedBook?: boolean;
  visible?: boolean;
  createdAt: number;
  customBadgeText?: { pt: string; en: string };
  customBadgeColor?: string;
  customFields?: { label: { pt: string; en: string }; value: { pt: string; en: string } }[];
}

export interface DynamicResearchItem {
  id: string;
  date: { pt: string; en: string };
  headline: { pt: string; en: string };
  author: { pt: string; en: string };
  body: { pt: string; en: string };
  body2?: { pt: string; en: string };
  imgUrl?: string;
  ctaUrl?: string;
  ctaText?: { pt: string; en: string };
  isFeatured?: boolean;
  visible?: boolean;
  createdAt: number;
  customBadgeText?: { pt: string; en: string };
  customBadgeColor?: string;
  customFields?: { label: { pt: string; en: string }; value: { pt: string; en: string } }[];
}

export interface SectionBlock {
  id: string;
  type: 'text' | 'features_grid' | 'accordion' | 'stats' | 'image' | 'cta';
  title?: { pt: string; en: string };
  subtitle?: { pt: string; en: string };
  body?: { pt: string; en: string };
  alignment?: 'left' | 'center' | 'right';
  bgImageUrl?: string;
  items?: Array<{
    id: string;
    title?: { pt: string; en: string };
    subtitle?: { pt: string; en: string };
    body?: { pt: string; en: string };
    icon?: string;
    imgUrl?: string;
    ctaText?: { pt: string; en: string };
    ctaUrl?: string;
    value?: string;
  }>;
}

export interface NavbarItem {
  id: string;
  label: { pt: string; en: string };
  target: string;
  isExternal?: boolean;
  visible?: boolean;
  order: number;
  bgImageUrl?: string;
  sectionTitle?: { pt: string; en: string };
  sectionBody?: { pt: string; en: string };
  ctaText?: { pt: string; en: string };
  ctaUrl?: string;
  blocks?: SectionBlock[];
}

export interface HeroStat {
  value: string;
  label_pt: string;
  label_en: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'ok' | 'err' | 'info';
}
