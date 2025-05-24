import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages, useTranslation, type Language } from '@/i18n';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  mobile?: boolean;
}

export function LanguageSwitcher({
  variant = 'outline',
  size = 'default',
  mobile = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };
  
  if (mobile) {
    return (
      <div className="flex flex-col space-y-2">
        {Object.entries(languages).map(([code, name]) => (
          <button
            key={code}
            className={`py-2 px-4 text-left rounded-md transition ${
              language === code
                ? 'bg-primary text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => handleSelect(code as Language)}
          >
            {name}
          </button>
        ))}
      </div>
    );
  }
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{languages[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            className={`cursor-pointer ${language === code ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => handleSelect(code as Language)}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
