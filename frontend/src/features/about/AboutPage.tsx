/**
 * About Page
 */
import { useTranslation } from '../../context/TranslationContext';

/**
 * AboutPage - About the blog
 */
export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b-[0.5px] border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {t('about.about')}
          </h1>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {t('about.description')}
          </p>
        </div>
      </div>
    </div>
  );
};
