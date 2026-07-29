import { Link, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { useTranslation } from '../../context/TranslationContext';

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/articles', label: t('nav.articles') },
    { path: '/archive', label: t('nav.archive') },
    { path: '/about', label: t('nav.about') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b-[0.5px] border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-sm font-bold tracking-tighter text-black dark:text-white uppercase font-mono">
          ARORMS
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-mono uppercase tracking-wider transition-colors duration-200 ${
                pathname === link.path
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}