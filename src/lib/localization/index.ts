import { Language } from "@/contexts/LanguageContext";
import { LocalizedConstants, COMPANY_LOGO } from "./types";
import { enConstants } from "./en-constants";
import { esConstants } from "./es-constants";
import { frConstants } from "./fr-constants";

// Map of all localized constants
export const localizedConstants: Record<Language, LocalizedConstants> = {
  en: enConstants,
  es: esConstants,
  fr: frConstants,
};

// Export types and constants
export type { LocalizedConstants };
export { COMPANY_LOGO };
