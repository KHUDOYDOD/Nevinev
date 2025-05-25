import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageType } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "header" | "footer";
}

interface LanguageOption {
  code: LanguageType;
  label: string;
}

const LanguageSwitcher = ({ variant = "header" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: LanguageOption[] = [
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
    { code: "tj", label: "Тоҷикӣ" },
    { code: "kz", label: "Қазақша" },
    { code: "uz", label: "O'zbekcha" },
  ];

  const handleLanguageChange = (langCode: LanguageType) => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  if (variant === "footer") {
    return (
      <div className="flex space-x-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`text-sm ${
              language === lang.code
                ? "text-white"
                : "text-gray-400 hover:text-white"
            } transition`}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-8 px-2"
        >
          <span>{currentLanguage?.code.toUpperCase()}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={
              language === lang.code ? "bg-muted font-medium" : "font-normal"
            }
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
