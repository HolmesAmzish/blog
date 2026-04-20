/**
 * Home Page
 * Technical minimalism landing with glitch loading effect
 */
import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSiteStatistics } from '../../api/siteStatistics';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * HomePage - Landing page with latest articles
 */
export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data, isLoading, error } = useArticles({ page: 0, size: 6, language });
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['siteStatistics'],
    queryFn: fetchSiteStatistics,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // Format number helper
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Stats data from API
  const stats = statistics ? [
    { label: 'home.stats.articles', value: statistics.totalArticles },
    { label: 'home.stats.categories', value: statistics.totalCategories },
    { label: 'home.stats.tags', value: statistics.totalTags },
    { label: 'home.stats.views', value: formatNumber(statistics.totalArticleView) },
  ] : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-[0.5px] border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Title and description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-[#0047FF]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  {t('home.systemInit')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-6 leading-none">
                BLOG
                <span className="text-[#0047FF]">.</span>
                CACC
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-md font-mono">
                {t('home.heroDescription')}
              </p>
              <div className="flex gap-3">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[#0047FF] transition-colors duration-200"
                >
                  {t('home.readArticles')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/archive"
                  className="inline-flex items-center gap-2 px-6 py-3 border-[0.5px] border-gray-200 text-black text-[11px] font-mono uppercase tracking-wider hover:border-black transition-colors duration-200"
                >
                  {t('home.viewArchive')}
                </Link>
              </div>
            </div>

            {/* Right: Stats grid */}
            <div className="grid grid-cols-2 gap-[0.5px] bg-gray-200 border-[0.5px] border-gray-200">
              {statsLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white p-6 flex flex-col items-center justify-center">
                    <div className="h-8 w-16 bg-gray-100 mb-1 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))
              ) : stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-6 flex flex-col items-center justify-center"
                >
                  <span className="text-3xl font-bold text-black mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    {t(stat.label)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                //
              </span>
              <h2 className="text-lg font-bold tracking-tight text-black">
                {t('home.latestArticles')}
              </h2>
            </div>
            <Link
              to="/articles"
              className="text-[11px] font-mono text-gray-600 hover:text-[#0047FF] transition-colors flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Articles grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border-[0.5px] border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-100 mb-4" />
                  <div className="h-6 bg-gray-100 mb-2" />
                  <div className="h-4 bg-gray-100 w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border-[0.5px] border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600 font-mono">
                ERROR: {error.message}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.content.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
