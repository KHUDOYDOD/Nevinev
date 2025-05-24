import { createContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/lib/translations';

type LanguageType = 'ru' | 'en' | 'tj' | 'kz' | 'uz';
type TranslationKey = string;

interface LanguageContextType {
  language: LanguageType;
  changeLanguage: (newLanguage: LanguageType) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  changeLanguage: () => {},
  t: () => '',
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageType>('ru');
  
  useEffect(() => {
    // Check if language is stored in localStorage
    const storedLanguage = localStorage.getItem('language') as LanguageType;
    
    // Check URL for language parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLanguage = urlParams.get('lang') as LanguageType;
    
    // Check browser preferred language
    const browserLanguage = navigator.language.split('-')[0] as LanguageType;
    
    // Set language with priority: URL param > localStorage > browser preference > default
    if (urlLanguage && ['ru', 'en', 'tj', 'kz', 'uz'].includes(urlLanguage)) {
      setLanguage(urlLanguage);
      localStorage.setItem('language', urlLanguage);
    } else if (storedLanguage && ['ru', 'en', 'tj', 'kz', 'uz'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    } else if (['ru', 'en', 'tj', 'kz', 'uz'].includes(browserLanguage)) {
      setLanguage(browserLanguage);
      localStorage.setItem('language', browserLanguage);
    }
  }, []);
  
  const changeLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  // Translation function
  const t = (key: TranslationKey): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    
    // Access translations for current language
    let translation = translations[language];
    
    // If translation doesn't exist for current language, fallback to Russian
    if (!translation) {
      translation = translations.ru;
    }
    
    // Navigate through nested objects
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // If key doesn't exist in current language, try Russian
        let fallbackTranslation = translations.ru;
        for (const fk of keys) {
          if (fallbackTranslation && typeof fallbackTranslation === 'object' && fk in fallbackTranslation) {
            fallbackTranslation = fallbackTranslation[fk];
          } else {
            return key; // Return the key itself if no translation found
          }
        }
        return typeof fallbackTranslation === 'string' ? fallbackTranslation : key;
      }
    }
    
    return typeof translation === 'string' ? translation : key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
