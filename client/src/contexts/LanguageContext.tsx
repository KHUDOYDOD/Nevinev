import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "i18next";

type LanguageCode = "ru" | "en" | "tj" | "kz" | "uz";

type LanguageContextType = {
  currentLanguage: LanguageCode;
  changeLanguage: (code: LanguageCode) => void;
  languageNames: Record<LanguageCode, string>;
};

const languageNames: Record<LanguageCode, string> = {
  ru: "Русский",
  en: "English",
  tj: "Тоҷикӣ",
  kz: "Қазақша",
  uz: "O'zbekcha",
};

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "ru",
  changeLanguage: () => {},
  languageNames,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage
    const savedLang = localStorage.getItem("language") as LanguageCode;
    return savedLang || "ru"; // Default to Russian
  });

  useEffect(() => {
    // Change i18next language when currentLanguage changes
    i18n.changeLanguage(currentLanguage);
    
    // Save to localStorage
    localStorage.setItem("language", currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (code: LanguageCode) => {
    setCurrentLanguage(code);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
