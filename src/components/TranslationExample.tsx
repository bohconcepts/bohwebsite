import React from "react";
import useTranslation from "../hooks/useTranslation";
import { useLanguage } from "../contexts/LanguageContext";

interface TranslationExampleProps {
  rawText?: string;
}

const TranslationExample: React.FC<TranslationExampleProps> = ({
  rawText = "Contact Us"
}) => {
  const { translate, translateWithVars, language } = useTranslation();
  const { setLanguage } = useLanguage();

  // Example with variable interpolation
  const workforceCount = {
    africa: 250,
    us: 175
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Translation Example</h2>
      
      <div className="mb-6">
        <p className="font-medium text-gray-700">Current language: <span className="font-bold">{language.toUpperCase()}</span></p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-3 py-1 rounded ${language === "es" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Español
          </button>
          <button
            onClick={() => setLanguage("fr")}
            className={`px-3 py-1 rounded ${language === "fr" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Français
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded">
          <h3 className="font-medium text-gray-800">Simple Translation:</h3>
          <p className="mt-2">
            <span className="text-gray-500">Raw text:</span> {rawText}
          </p>
          <p className="mt-1">
            <span className="text-gray-500">Translated:</span>{" "}
            <span className="font-medium">{translate(rawText)}</span>
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded">
          <h3 className="font-medium text-gray-800">Translation with Variables:</h3>
          <p className="mt-2">
            <span className="text-gray-500">Raw text:</span> africa_workforce_count
          </p>
          <p className="mt-1">
            <span className="text-gray-500">Translated:</span>{" "}
            <span className="font-medium">
              {translateWithVars("africa_workforce_count", { count: workforceCount.africa })}
            </span>
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded">
          <h3 className="font-medium text-gray-800">Multiple Translations:</h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="text-gray-500">Our Services:</span>{" "}
              <span className="font-medium">{translate("Our Premium Staffing Solutions")}</span>
            </p>
            <p>
              <span className="text-gray-500">About Us:</span>{" "}
              <span className="font-medium">{translate("About Us")}</span>
            </p>
            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              <span className="font-medium">{translate("Contact Us")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationExample;
