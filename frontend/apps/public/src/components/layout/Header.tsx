import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { useTranslation } from '../../context/TranslationContext';

export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/articles', label: t('nav.articles') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/archive', label: t('nav.archive') },
    { path: '/about', label: t('nav.about') },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b-[0.5px] border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
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
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            className="md:hidden flex h-9 w-9 items-center justify-center border-[0.5px] border-gray-200 dark:border-gray-700 text-black dark:text-white"
            aria-label={t('nav.toggleMenu')}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-nav"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav
        id="public-mobile-nav"
        aria-hidden={!menuOpen}
        className={`md:hidden overflow-hidden bg-white shadow-lg transition-[max-height,opacity,transform] duration-300 ease-out dark:bg-black ${
          menuOpen
            ? 'max-h-80 translate-y-0 opacity-100'
            : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto border-t-[0.5px] border-gray-200 px-4 py-3 dark:border-gray-800">
          {navLinks.map(link => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={menuOpen ? undefined : -1}
                className={`flex items-center justify-between border-b-[0.5px] border-gray-100 py-3 text-[11px] font-mono uppercase tracking-wider transition-colors last:border-b-0 dark:border-gray-800 ${
                  isActive
                    ? 'text-[#0047FF]'
                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-gray-300 dark:text-gray-700">
                  {isActive ? '●' : '→'}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
