/**
 * Article List Page
 * Paginated article listing with category filter
 */
import { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';

/**
 * ArticleListPage - Paginated article listing
 */
export const ArticleListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const size = 9;

  const { data, isLoading, error } = useArticles({
    page,
    size,
    categoryId: selectedCategory,
    language: language, // Use global language from context
  });

  const { data: categories } = useCategories(language);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 pb-6 border-b-[0.5px] border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              //
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              {t('articles.allArticles')}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {t('articles.allArticles')}
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                {t('articles.filterByCategory')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(undefined);
                  setPage(0);
                }}
                className={`
                  px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider
                  border-[0.5px] transition-all duration-200
                  ${selectedCategory === undefined
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }
                `}
              >
                {t('articles.all')}
              </button>
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id ?? undefined);
                    setPage(0);
                  }}
                  className={`
                    px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider
                    border-[0.5px] transition-all duration-200
                    ${selectedCategory === category.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
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
              {t('articles.error')}: {error.message}
            </p>
          </div>
        ) : data?.content.length === 0 ? (
          <div className="border-[0.5px] border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500 font-mono">
              {t('articles.noArticles')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.content.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 border-[0.5px] border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`
                    min-w-[32px] h-8 px-2 text-[10px] font-mono
                    border-[0.5px] transition-all duration-200
                    ${page === i
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }
                  `}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-2 border-[0.5px] border-gray-200 text-gray-600 hover:border-black hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Results info */}
        {data && (
          <div className="mt-6 text-center">
            <p className="text-[10px] font-mono text-gray-400">
              {t('articles.showing')} {data.content.length} {t('articles.of')} {data.totalElements} {t('articles.articles')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
