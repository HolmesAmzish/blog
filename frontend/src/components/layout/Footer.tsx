/**
 * Footer Component
 * Technical minimalism footer with grid layout
 */
import { GithubIcon, X, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: <GithubIcon className="w-4 h-4" />, href: 'https://github.com/HolmesAmzish', label: 'github' },
  { icon: <X className="w-4 h-4" />, href: 'https://x.com/HolmesAmzish', label: 'x' },
  { icon: <Mail className="w-4 h-4" />, href: 'mailto:HolmesAmzish86@gmail.com', label: 'email' },
  // { icon: <Rss className="w-4 h-4" />, href: '/rss', label: 'RSS' },
];

/**
 * Footer - Technical minimalism style
 */
export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-[0.5px] border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b-[0.5px] border-gray-100">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-black mb-2">
              ARORMS
            </h3>
            <p className="text-[11px] font-mono text-gray-500 leading-relaxed">
              {t('footer.brandDescription')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-3">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'home', path: '/' },
                { label: 'articles', path: '/articles' },
                { label: 'archive', path: '/archive' },
                { label: 'about', path: '/about' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-[11px] font-mono text-gray-600 hover:text-[#0047FF] transition-colors"
                  >
                    {t(`nav.${item.label}`).toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-3">
              {t('footer.connect')}
            </h4>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border-[0.5px] border-gray-200 text-gray-600 hover:border-[#0047FF] hover:text-[#0047FF] transition-all duration-200"
                  aria-label={t(`footer.${link.label}`)}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-mono text-gray-400">
            © {currentYear} ARORMS. {t('footer.copyright')}
          </p>
          <p className="text-[10px] font-mono text-gray-400">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
};
