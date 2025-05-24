import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./translations/ru";
import en from "./translations/en";
import tj from "./translations/tj";
import kz from "./translations/kz";
import uz from "./translations/uz";

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      tj: { translation: tj },
      kz: { translation: kz },
      uz: { translation: uz },
    },
    lng: localStorage.getItem("language") || "ru", // Default language is Russian
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
