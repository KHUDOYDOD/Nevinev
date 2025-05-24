import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ruTranslation from './locales/ru';
import enTranslation from './locales/en';
import tjTranslation from './locales/tj';
import kzTranslation from './locales/kz';
import uzTranslation from './locales/uz';

export type Language = 'ru' | 'en' | 'tj' | 'kz' | 'uz';

export const languages: Record<Language, string> = {
  ru: 'Русский',
  en: 'English',
  tj: 'Тоҷикӣ',
  kz: 'Қазақша',
  uz: 'O\'zbekcha'
};

export const translations = {
  ru: ruTranslation,
  en: enTranslation,
  tj: tjTranslation,
  kz: kzTranslation,
  uz: uzTranslation
};

interface TranslationState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useTranslation = create<TranslationState>()(
  persist(
    (set, get) => ({
      language: 'ru' as Language,
      setLanguage: (language: Language) => set({ language }),
      t: (key: string) => {
        const language = get().language;
        const keys = key.split('.');
        
        let translation = translations[language];
        for (const k of keys) {
          if (!translation?.[k]) {
            return key;
          }
          translation = translation[k];
        }
        
        return translation as string;
      }
    }),
    {
      name: 'tradepo-language'
    }
  )
);
