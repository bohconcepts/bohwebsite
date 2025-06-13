import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: t('English') },
    { code: 'es', name: t('Spanish') },
    { code: 'fr', name: t('French') },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-black hover:text-black hover:bg-black/10"
        >
          <Globe size={18} />
          <span className="md:inline">{t('Language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => handleLanguageChange(lang.code as Language)}
          >
            <span>{lang.name}</span>
            {language === lang.code && <Check size={16} className="text-brand-orange" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
