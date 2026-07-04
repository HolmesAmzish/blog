/**
 * Theme Switcher Component
 * Dropdown to pick between system / light / dark
 */
import { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/TranslationContext';

const THEME_ICONS: Record<Theme, React.ReactNode> = {
  system: <Monitor className="w-3 h-3" />,
  light: <Sun className="w-3 h-3" />,
  dark: <Moon className="w-3 h-3" />,
};

const THEME_ORDER: Theme[] = ['system', 'light', 'dark'];

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (next: Theme) => {
    setTheme(next);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-wider
          border-[0.5px] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300
          hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white
          transition-all duration-200
        `}
        aria-label={t('theme.toggle')}
        aria-expanded={isOpen}
      >
        {THEME_ICONS[theme]}
        <span>{t(`theme.${theme}`)}</span>
        <ChevronDown className="w-2 h-2" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-32 bg-white dark:bg-black border-[0.5px] border-gray-200 dark:border-gray-700 shadow-lg rounded-sm overflow-hidden">
            <div className="py-1">
              {THEME_ORDER.map((opt) => {
                const isActive = theme === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`
                      w-full px-4 py-2 text-left text-[10px] font-mono uppercase tracking-wider
                      flex items-center gap-2
                      border-b-[0.5px] border-gray-100 dark:border-gray-800 last:border-0
                      hover:bg-[#0047FF] hover:text-white
                      ${isActive ? 'bg-[#0047FF] text-white' : 'text-gray-600 dark:text-gray-300'}
                    `}
                  >
                    {THEME_ICONS[opt]}
                    {t(`theme.${opt}`)}
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