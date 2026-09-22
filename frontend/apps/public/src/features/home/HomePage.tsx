import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { TrafficMap } from '../../components/ui/TrafficMap';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data, isLoading, error } = useArticles({ page: 0, size: 6, language });

  const latestArticles = data?.content.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <section className="border-b-[0.5px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-black dark:border-white">
        <div className="mx-auto py-16 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-8 md:grid-rows-[60px_60px_60px_60px_60px_60px] md:gap-[0.5px]">
            <div className="col-span-full bg-white dark:bg-black flex items-center justify-start md:col-span-5 md:row-span-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black dark:text-white leading-[0.85]">
                BLOG<span className="text-[#0047FF]">.</span>CACC
              </h1>
            </div>
            <div className="hidden bg-white dark:bg-black md:block md:col-span-3 md:row-span-3" />
            <div className="flex flex-col justify-between gap-8 bg-white dark:bg-black md:col-span-4 md:col-start-1 md:row-span-3 md:row-start-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('home.heroDescription')}</p>
              <div className="flex gap-2">
                <Link to="/articles" className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono uppercase tracking-wider hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors duration-200">
                  {t('home.readArticles')} <ArrowRight className="w-3 h-3" />
                </Link>
                <Link to="/archive" className="inline-flex items-center gap-1 px-4 py-2 border-[0.5px] border-black dark:border-white text-black dark:text-white text-[10px] font-mono uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200">
                  {t('home.viewArchive')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">{t('home.latestArticles')}</h2>
            <Link to="/articles" className="text-[11px] font-mono text-gray-600 dark:text-gray-300 hover:text-[#0047FF] transition-colors flex items-center gap-1">
              {t('home.viewAll')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.5px] bg-gray-200 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-800">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-black p-6 animate-pulse">
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 mb-4 w-48" />
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 mb-2 w-2/3" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border-[0.5px] border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">ERROR: {error.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.5px] bg-gray-200 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-800">
              {latestArticles.map((article, idx) => (
                <div key={article.id} className="bg-white dark:bg-black p-6 md:p-8">
                  <ArticleCard article={article} index={idx} className="border-t-0 py-0" showTags={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">{t('home.trafficDistribution')}</h2>
          </div>
          <TrafficMap />
        </div>
      </section>
    </div>
  );
};
