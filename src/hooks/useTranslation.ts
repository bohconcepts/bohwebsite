import { useLanguage } from "../contexts/LanguageContext";
import { translateText, translateWithVariables } from "../lib/localization/translateUtils";

/**
 * Custom hook for translation functionality
 * Provides methods to translate text and text with variables
 */
const useTranslation = () => {
  const { language } = useLanguage();

  /**
   * Translates a text string to the current language
   * @param text The text to translate
   * @returns The translated text
   */
  const translate = (text: string): string => {
    return translateText(text, language);
  };

  /**
   * Translates a text string with variable interpolation
   * @param text The text to translate (with {variable} placeholders)
   * @param variables Object containing variable values to interpolate
   * @returns The translated text with variables replaced
   */
  const translateWithVars = (
    text: string,
    variables: Record<string, string | number>
  ): string => {
    return translateWithVariables(text, variables, language);
  };

  return {
    translate,
    translateWithVars,
    language,
  };
};

export default useTranslation;
