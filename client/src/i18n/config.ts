import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './ru';
import en from './en';
import tj from './tj';
import kz from './kz';
import uz from './uz';

export const resources = {
  ru: { translation: ru },
  en: { translation: en },
  tj: { translation: tj },
  kz: { translation: kz },
  uz: { translation: uz }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    }
  });

export default i18n;
export type LanguageType = 'ru' | 'en' | 'tj' | 'kz' | 'uz';
