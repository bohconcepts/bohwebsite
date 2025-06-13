import { Language } from "../../contexts/LanguageContext";
import translations from "../../lib/translations";
import { localizedConstants } from "./index";

/**
 * Translates raw text to the specified language
 * @param text The raw text to translate
 * @param language The target language
 * @returns The translated text if available, otherwise the original text
 */
export const translateText = (text: string, language: Language): string => {
  if (!text) return "";

  // First check if the text exists as a direct key in translations
  if (translations[language] && translations[language][text as keyof typeof translations[typeof language]]) {
    return translations[language][text as keyof typeof translations[typeof language]] as string;
  }

  // Then check if it exists in localized constants
  const normalizedText = text.trim().toLowerCase();
  const constants = localizedConstants[language];
  
  for (const [_, value] of Object.entries(constants)) {
    // Skip complex objects like arrays
    if (typeof value !== 'string') continue;
    
    if (value.toLowerCase() === normalizedText) {
      return value;
    }
  }

  // If not found in current language, try English as fallback
  if (language !== 'en') {
    if (translations.en && translations.en[text as keyof typeof translations.en]) {
      return translations.en[text as keyof typeof translations.en] as string;
    }
  }

  // Return the original text if no translation found
  return text;
};

/**
 * Translates text with variable interpolation
 * @param text The text template with {variable} placeholders
 * @param variables Object containing variable values to interpolate
 * @param language The target language
 * @returns The translated and interpolated text
 */
export const translateWithVariables = (
  text: string, 
  variables: Record<string, string | number>,
  language: Language
): string => {
  let translatedText = translateText(text, language);
  
  // Replace variables in the translated text
  Object.entries(variables).forEach(([key, value]) => {
    translatedText = translatedText.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  
  return translatedText;
};

/**
 * Adds a new translation key to all language dictionaries
 * @param key The translation key
 * @param translations Object with translations for each language
 */
export const addTranslation = (
  key: string,
  translations: Partial<Record<Language, string>>
): void => {
  // This is just a utility function that would need to be implemented
  // with your backend or file system to actually save the translations
  console.log(`Adding translation for key: ${key}`, translations);
  // In a real implementation, this would update your translation files
};

/**
 * Detects missing translations for a given text across all supported languages
 * @param text The text to check
 * @returns Object with missing languages
 */
export const detectMissingTranslations = (
  text: string
): Partial<Record<Language, boolean>> => {
  const missingTranslations: Partial<Record<Language, boolean>> = {};
  const languages: Language[] = ['en', 'es', 'fr'];
  
  languages.forEach(lang => {
    // Check if translation exists
    const hasTranslation = 
      (translations[lang] && (translations[lang] as Record<string, string>)[text]) || 
      Object.values(localizedConstants[lang]).some(
        value => typeof value === 'string' && value === text
      );
    
    if (!hasTranslation) {
      missingTranslations[lang] = true;
    }
  });
  
  return missingTranslations;
};
