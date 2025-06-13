export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  positions?: string[];
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  image?: string;
}

export interface Statistic {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
}