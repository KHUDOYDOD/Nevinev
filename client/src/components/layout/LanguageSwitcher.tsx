import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

import { LanguageType } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "header" | "footer";
}

interface LanguageOption {
  code: LanguageType;
  label: string;
  flagEmoji: string;
}

const LanguageSwitcher = ({ variant = "header" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Используем локальное состояние для хранения выбранного языка
  const [currentLang, setCurrentLang] = useState<LanguageType>(() => {
    const savedLang = localStorage.getItem("i18nextLng");
    return (savedLang as LanguageType) || "ru";
  });

  const languages: LanguageOption[] = [
    { code: "ru", label: "Русский", flagEmoji: "🇷🇺" },
    { code: "en", label: "English", flagEmoji: "🇬🇧" },
    { code: "tj", label: "Тоҷикӣ", flagEmoji: "🇹🇯" },
    { code: "kz", label: "Қазақша", flagEmoji: "🇰🇿" },
    { code: "uz", label: "O'zbekcha", flagEmoji: "🇺🇿" },
  ];

  const handleLanguageChange = (langCode: LanguageType) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    localStorage.setItem("i18nextLng", langCode);
    setIsOpen(false);
  };

  // Закрыть меню при клике вне его
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const selectedLanguage = languages.find((lang) => lang.code === currentLang);

  if (variant === "footer") {
    return (
      <div className="flex space-x-2">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`text-sm px-2 py-1 rounded-md ${
              currentLang === lang.code
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            } transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">{lang.flagEmoji}</span>
            <span>{lang.code.toUpperCase()}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Переключить язык"
      >
        <Globe className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-gradient-to-b from-indigo-800/95 to-purple-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    currentLang === lang.code
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  } transition-all`}
                  whileHover={{ x: 5 }}
                >
                  <span className="mr-2 text-base">{lang.flagEmoji}</span>
                  <span>{lang.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;