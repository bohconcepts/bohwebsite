import { Language } from "@/contexts/LanguageContext";
import { LocalizedConstants, COMPANY_LOGO } from "./localization/types";
import { enConstants } from "./localization/en-constants";
import { esConstants } from "./localization/es-constants";
import { frConstants } from "./localization/fr-constants";

// Map of all localized constants
const localizedConstants: Record<Language, LocalizedConstants> = {
  en: enConstants,
  es: esConstants,
  fr: frConstants,
};

export type { LocalizedConstants };
export { COMPANY_LOGO };
export default localizedConstants;
