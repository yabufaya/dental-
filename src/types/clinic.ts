export type Language = 'en' | 'am';

export interface ClinicStats {
  satisfactionRate: number;
  smilesTransformed: number;
  patientRating: number;
  yearsExperience: number;
  specialistCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  nameAm?: string;
  title: string;
  titleAm?: string;
  specialty: string;
  specialtyAm?: string;
  qualifications: string;
  languages: string[];
  yearsExp: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  bio: string;
  bioAm?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  titleAm?: string;
  plainDesc: string;
  plainDescAm?: string;
  longDesc: string;
  longDescAm?: string;
  priceFromETB: number;
  durationMin: number;
  iconName: string;
  imageUrl?: string;
  isFeatured: boolean;
  procedureSteps: string[];
  procedureStepsAm?: string[];
  whoNeedsIt: string;
  whoNeedsItAm?: string;
  aftercare: string[];
  aftercareAm?: string[];
  faqs: { q: string; a: string; qAm?: string; aAm?: string }[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientNameAm?: string;
  avatarUrl?: string;
  treatment: string;
  treatmentAm?: string;
  rating: number;
  quote: string;
  quoteAm?: string;
  date: string;
  beforeUrl?: string;
  afterUrl?: string;
  beforeAfterAlt?: string;
  consent: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleAm?: string;
  excerpt: string;
  excerptAm?: string;
  content: string;
  contentAm?: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface OpeningHours {
  mon: { open: string; close: string };
  tue: { open: string; close: string };
  wed: { open: string; close: string };
  thu: { open: string; close: string };
  fri: { open: string; close: string };
  sat: { open: string; close: string };
  sun: { open: string; close: string } | null;
}

export interface ClinicSettings {
  name: string;
  nameAm: string;
  slogan: string;
  sloganAm: string;
  sloganSub: string;
  sloganSubAm: string;
  phone: string;
  emergencyPhone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  address: string;
  addressAm: string;
  landmark: string;
  landmarkAm: string;
  lat: number;
  lng: number;
  placeId?: string;
  hours: OpeningHours;
  paymentMethods: string[];
  accessibility: string[];
  registrationNumber: string;
}
