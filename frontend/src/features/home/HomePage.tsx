/**
 * Home Page
 * Swiss Style / International Typographic Style
 */
import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSiteStatistics } from '../../api/siteStatistics';
import { TrafficMap } from '../../components/ui/TrafficMap';
import { useQuery } from '@tanstack/react-query';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data, isLoading, error } = useArticles({ page: 0, size: 6, language });
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['siteStatistics'],
    queryFn: fetchSiteStatistics,
    staleTime: 60 * 60 * 1000,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = statistics
    ? [
        { label: 'home.stats.articles', value: statistics.totalArticles },
        { label: 'home.stats.categories', value: statistics.totalCategories },
        { label: 'home.stats.tags', value: statistics.totalTags },
        { label: 'home.stats.views', value: formatNumber(statistics.totalArticleView) },
      ]
    : [];

  const latestArticles = data?.content.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section — Swiss Square Grid 8×6 */}
      <section className="border-b-[0.5px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-black dark:border-white">
        <div className=" mx-auto py-16 md:py-24">
          {/* 8 cols × 6 rows, each cell 60px tall, no inner padding */}
          <div className="grid grid-cols-8 grid-rows-[60px_60px_60px_60px_60px_60px] gap-[0.5px]">

            {/* Row 1: Title col 1-5 (span 3 rows), empty col 6-7, Blue block col 8 (span 2 rows) */}
            <div className="col-span-5 row-span-3 bg-white dark:bg-black flex items-center justify-start">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black dark:text-white leading-[0.85]">
                BLOG<span className="text-[#0047FF]">.</span>CACC
              </h1>
            </div>
            {/* Empty space */}
            <div className="col-span-3 row-span-3 bg-white dark:bg-black" />

            {/* Row 3: Stats col 2-4 */}
            <div className="col-span-3 bg-white dark:bg-black flex flex-wrap content-center gap-x-4 gap-y-2">
              {statsLoading
                ? [...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 animate-pulse">
                      <div className="h-5 w-8 bg-gray-100 dark:bg-gray-800" />
                      <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800" />
                    </div>
                  ))
                : stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-1">
                      <span className="text-base font-bold text-black dark:text-white">{stat.value}</span>
                      <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {t(stat.label)}
                      </span>
                    </div>
                  ))}
            </div>
            <div className="col-span-2 bg-white dark:bg-black" />

            {/* Row 4: Description + CTAs col 1-4 (span 2 rows) */}
            <div className="col-span-4 row-span-2 bg-white dark:bg-black flex flex-col justify-between">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('home.heroDescription')}
              </p>
              <div className="flex gap-2">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-mono uppercase tracking-wider hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors duration-200"
                >
                  {t('home.readArticles')}
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/archive"
                  className="inline-flex items-center gap-1 px-4 py-2 border-[0.5px] border-black dark:border-white text-black dark:text-white text-[10px] font-mono uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
                >
                  {t('home.viewArchive')}
                </Link>
              </div>
            </div>
            <div className="col-span-4 bg-white dark:bg-black" />

            {/* Row 5: empty */}
            <div className="col-span-4 bg-white dark:bg-black" />
            <div className="col-span-4 bg-white dark:bg-black" />

          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
                {t('home.latestArticles')}
              </h2>
            </div>
            <Link
              to="/articles"
              className="text-[11px] font-mono text-gray-600 dark:text-gray-300 hover:text-[#0047FF] transition-colors flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Articles grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.5px] bg-gray-200 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-800">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-black p-6 animate-pulse"
                >
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 mb-4 w-48" />
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 mb-2 w-2/3" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border-[0.5px] border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                ERROR: {error.message}
              </p>
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

      {/* Traffic Distribution Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">
              {t('home.trafficDistribution')}
            </h2>
          </div>

          {/* Map */}
          <TrafficMap />
        </div>
      </section>
    </div>
  );
};
