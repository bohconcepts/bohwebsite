import { useLanguage } from "@/contexts/LanguageContext";
import localizedConstants from "@/lib/localized-constants";

export const useLocalizedNavigation = () => {
  const { language } = useLanguage();
  
  // Get the navigation items for the current language
  const navigation = localizedConstants[language].SITE_NAVIGATION;
  
  return navigation;
};
