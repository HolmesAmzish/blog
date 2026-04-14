/**
 * Language Switcher Component
 * Allows users to switch between supported languages
 */
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGE_CONFIG, type SupportedLanguage } from '../../context/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../../context/TranslationContext';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Language Switcher - Minimalist monospace style
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = LANGUAGE_CONFIG[language];

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-wider
          border-[0.5px] border-gray-200 text-gray-600 hover:border-black hover:text-black
          transition-all duration-200
        `}
        aria-label={t('nav.toggleMenu')}
        aria-expanded={isOpen}
      >
        <Globe className="w-3 h-3" />
        <span>{currentConfig.label}</span>
        <ChevronDown className="w-2 h-2" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-32 bg-white border-[0.5px] border-gray-200 shadow-lg rounded-sm overflow-hidden">
            <div className="py-1">
              {(Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[]).map((lang) => {
                const config = LANGUAGE_CONFIG[lang];
                const isActive = language === lang;

                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`
                      w-full px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider
                      border-b-[0.5px] border-gray-100 last:border-0
                      hover:bg-[#0047FF] hover:text-white
                      ${isActive ? 'bg-[#0047FF] text-white' : 'text-gray-600'}
                    `}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
