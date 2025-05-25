import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getLanguageName } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'tj', name: 'Тоҷикӣ' },
  { code: 'kz', name: 'Қазақша' },
  { code: 'uz', name: 'O\'zbekcha' }
];

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'subtle';
  className?: string;
}

export function LanguageSelector({ variant = 'outline', className }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'ru');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant as any} size="sm" className={className}>
          {currentLang.toUpperCase()}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              currentLang === lang.code ? 'bg-primary/10 font-medium' : ''
            }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
