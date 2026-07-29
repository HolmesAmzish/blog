import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage, LANGUAGE_CONFIG, type SupportedLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../context/TranslationContext';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-wider border-[0.5px] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-200"
        aria-label={t('nav.toggleMenu')}>
        <Globe className="w-3 h-3" />
        <span>{LANGUAGE_CONFIG[language].label}</span>
        <ChevronDown className="w-2 h-2" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-32 bg-white dark:bg-black border-[0.5px] border-gray-200 dark:border-gray-700 shadow-lg">
            {(Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[]).map(lang => (
              <button key={lang} onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider border-b-[0.5px] border-gray-100 dark:border-gray-800 last:border-0 hover:bg-[#0047FF] hover:text-white ${language === lang ? 'bg-[#0047FF] text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                {LANGUAGE_CONFIG[lang].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};