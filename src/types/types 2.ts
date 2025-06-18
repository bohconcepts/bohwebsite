// Service interface
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  positions?: string[];
}

// Team member interface
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

// Testimonial interface
export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company?: string;
  image?: string;
}

// Navigation item interface
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}
