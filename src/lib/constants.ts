import { TeamMember } from "@/types/Index";
import localizedConstants, { COMPANY_LOGO } from "@/lib/localized-constants";
import { Service, Statistic, Testimonial } from "@/lib/localization/types";

// Export English constants for backward compatibility
// These will be used by components that haven't been updated to use the new system yet
const enConstants = localizedConstants.en;

// Export company info for backward compatibility
export const COMPANY_NAME = enConstants.COMPANY_NAME;
export const COMPANY_TAGLINE = enConstants.COMPANY_TAGLINE;
export const COMPANY_DESCRIPTION = enConstants.COMPANY_DESCRIPTION;
export const COMPANY_ADDRESS = enConstants.COMPANY_ADDRESS;
export const COMPANY_PHONE = enConstants.COMPANY_PHONE;

// Re-export non-localized constants
export { COMPANY_LOGO };

// Define constants that were previously exported from localized-constants.ts
export const SITE_NAVIGATION = enConstants.SITE_NAVIGATION;
export const CLIENTS = enConstants.CLIENTS;

// Export services for backward compatibility
export const SERVICES: Service[] = enConstants.SERVICES;

// Export statistics for backward compatibility
export const STATISTICS: Statistic[] = enConstants.STATISTICS;

// Export testimonials for backward compatibility
export const TESTIMONIALS: Testimonial[] = enConstants.TESTIMONIALS;

// Export benefits for backward compatibility
export const BENEFITS = enConstants.BENEFITS;

// Export value props for backward compatibility
export const VALUE_PROPS = enConstants.VALUE_PROPS;

// Export social links for backward compatibility
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1FwYWyqPpw/?mibextid=wwXIfr",
  linkedin: "https://www.linkedin.com/company/bohconcepts/",
  instagram: "https://www.instagram.com/bohconcepts_?igsh=MWt6bHo4cnM1cnZodw==",
  youtube: "https://www.youtube.com/bohconcepts",
};

// Export contact info for backward compatibility
export const CONTACT_INFO = {
  phone: "425.279.0173",
  address: "2018 156th Ave NE Building F, Bellevue WA, 98007",
};

// Export company values for backward compatibility
export const COMPANY_VALUES = [
  {
    id: "1",
    title: "Accountable",
    description:
      "We take responsibility at each step of our partnership. We do the right thing, even when no one is working.",
  },
  {
    id: "2",
    title: "Committed",
    description:
      "We are dedicated to ensuring our partners's promises to their guests, colleagues, and owners are always fulfilled.",
  },
  {
    id: "3",
    title: "Diverse",
    description:
      "We welcome different perspectives and backgrounds. This fuels innovation, deepens connections between people, and empowers us to accomplish our goals.",
  },
  {
    id: "4",
    title: "Adaptable",
    description:
      "We are flexible and fluid in our service delivery to our partners.",
  },
  {
    id: "5",
    title: "Collaborative",
    description:
      "We acknowledge that each of us plays an integral role in the company. We learn and grow by relying on each other and trusting in our partners.",
  },
  {
    id: "6",
    title: "Present",
    description:
      "Our focused approach to our service delivery is paramount to the success of our partnership.",
  },
  {
    id: "7",
    title: "Empathetic",
    description:
      "In serving our colleagues, partners, and guests, we are respectful and thoughtful of our individual and collective experiences.",
  },
];

// Export team members for backward compatibility
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Kelvis Quaynor",
    position: "President & CEO, Founder",
    bio: "Founder and CEO of BOH Concepts.",
    image: "/images/team/kelvis.jpg",
  },
  {
    id: "2",
    name: "Michael Asnani",
    position: "Chief Operating Officer, Partner",
    bio: "COO and Partner at BOH Concepts.",
    image: "/images/team/michael.jpg",
  },
  {
    id: "3",
    name: "Ben Quaynor",
    position: "Chief Financial Officer, Partner",
    bio: "CFO and Partner at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "4",
    name: "Myrna Harris",
    position: "Sr. Director of People & Culture",
    bio: "Senior HR Consultant at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "5",
    name: "Ayesa Makatiani",
    position: "Finance Director",
    bio: "Finance Director at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "6",
    name: "Noella Muhamiriza",
    position: "Talent Acquisition Manager",
    bio: "Talent Acquisition Manager at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "7",
    name: "Linette Baneth",
    position: "People and Culture Manager",
    bio: "People and Culture Manager at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "8",
    name: "Rafey Askaryar",
    position: "HR Finance Generalist",
    bio: "HR Finance Generalist at BOH Concepts.",
    image:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

// Clients are already exported from the import statement above
