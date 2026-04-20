/**
 * Header Component
 * Technical Minimalism navigation with hairline borders
 */
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Archive, Home, FileText, User } from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTranslation } from '../../context/TranslationContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'home', icon: <Home className="w-4 h-4" /> },
  { path: '/articles', label: 'articles', icon: <FileText className="w-4 h-4" /> },
  { path: '/archive', label: 'archive', icon: <Archive className="w-4 h-4" /> },
  { path: '/about', label: 'about', icon: <User className="w-4 h-4" /> },
];

/**
 * Header - Technical minimalism navigation
 */
export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[0.5px] border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-black">
              ARORMS
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              /BLOG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={[
                      'px-4 py-2 text-[11px] font-mono uppercase tracking-wider',
                      'border-[0.5px] transition-all duration-200',
                      isActive
                        ? 'border-black bg-black text-white'
                        : 'border-transparent text-gray-600 hover:border-gray-200 hover:text-black'
                    ].join(' ')}
                  >
                    {t(`nav.${item.label}`)}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher className="!p-1.5" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-[0.5px] border-gray-200 hover:border-black transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-[0.5px] border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={[
                    'flex items-center gap-3 px-4 py-3 text-[11px] font-mono uppercase tracking-wider',
                    'border-[0.5px] transition-all duration-200',
                    isActive
                      ? 'border-black bg-black !text-white'
                      : 'border-gray-100 text-gray-600 hover:border-gray-300'
                  ].join(' ')}
                >
                  {item.icon}
                  {t(`nav.${item.label}`)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
