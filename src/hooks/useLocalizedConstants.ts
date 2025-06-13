import { useLanguage } from "@/contexts/LanguageContext";
import localizedConstants from "@/lib/localized-constants";

/**
 * Hook to access localized constants based on the current language
 * @returns All localized constants for the current language
 */
export function useLocalizedConstants() {
  const { language } = useLanguage();
  
  // Return the constants for the current language
  return localizedConstants[language];
}

/**
 * Helper functions to get specific constants
 */
export function useCompanyInfo() {
  const constants = useLocalizedConstants();
  return {
    name: constants.COMPANY_NAME,
    tagline: constants.COMPANY_TAGLINE,
    description: constants.COMPANY_DESCRIPTION,
    address: constants.COMPANY_ADDRESS,
    phone: constants.COMPANY_PHONE,
  };
}

export function useServices() {
  const constants = useLocalizedConstants();
  return constants?.SERVICES || [];
}

export function useStatistics() {
  const constants = useLocalizedConstants();
  return constants?.STATISTICS || [];
}

export function useTestimonials() {
  const constants = useLocalizedConstants();
  return constants?.TESTIMONIALS || [];
}

export function useBenefits() {
  const constants = useLocalizedConstants();
  return constants?.BENEFITS || [];
}

export function useValueProps() {
  const constants = useLocalizedConstants();
  return constants?.VALUE_PROPS || [];
}

export function useCompanyValues() {
  const constants = useLocalizedConstants();
  return constants?.COMPANY_VALUES || [];
}

export function useTeamMembers() {
  const constants = useLocalizedConstants();
  return constants?.TEAM_MEMBERS || [];
}

export function useContactInfo() {
  const constants = useLocalizedConstants();
  return {
    ...constants.CONTACT_INFO,
    email: 'contact@bohconcepts.com' // Adding email since it's used in Footer
  };
}

export function useSocialLinks() {
  const constants = useLocalizedConstants();
  return {
    ...constants.SOCIAL_LINKS,
    twitter: 'https://twitter.com/bohconcepts' // Adding twitter since it's used in Footer
  };
}

export function useClients() {
  const constants = useLocalizedConstants();
  return constants?.CLIENTS || [];
}

export function usePricingPlans() {
  const constants = useLocalizedConstants();
  return constants?.PRICING_PLANS || [];
}

export function useFramework() {
  const constants = useLocalizedConstants();
  return constants?.FRAMEWORK || [];
}

export function useSiteNavigation() {
  const constants = useLocalizedConstants();
  return constants.SITE_NAVIGATION || [];
}
