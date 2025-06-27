import React, { createContext, useState, useContext, ReactNode } from "react";

// Define available languages
export type Language = "en" | "es" | "fr";

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation data
import translations from "@/lib/translations";
import { localizedConstants } from "@/lib/localization";

// Define translation dictionary type with index signature
type TranslationDictionary = {
  [key: string]: string;
};

// Define translations type
type Translations = {
  [key in Language]: TranslationDictionary;
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "en";
  });

  // Wrapper for setLanguage that also updates localStorage
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguageState(newLanguage);
    // No need to reload the entire app, React will re-render with new language
  };

  // Translation function
  const t = (key: string): string => {
    if (!key) return "";

    try {
      // Check if the key exists in localizedConstants (prioritize this)
      if (localizedConstants[language] && key in localizedConstants[language]) {
        const value = localizedConstants[language][key as keyof typeof localizedConstants[typeof language]];
        if (typeof value === 'string') {
          return value;
        }
      }

      // Check if the key exists in the current language translations
      if (translations[language] && key in (translations as Translations)[language]) {
        return (translations as Translations)[language][key];
      }

      // Fallback to English localizedConstants
      if (localizedConstants.en && key in localizedConstants.en) {
        const value = localizedConstants.en[key as keyof typeof localizedConstants.en];
        if (typeof value === 'string') {
          return value;
        }
      }

      // Fallback to English translations
      if (translations.en && key in (translations as Translations).en) {
        return (translations as Translations).en[key];
      }

      // Format the key if no translation is found (convert underscores to spaces and capitalize words)
      if (key.includes('_')) {
        return key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      // Return the key itself if no translation is found and no formatting needed
      return key;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
