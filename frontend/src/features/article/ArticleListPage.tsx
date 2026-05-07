/**
 * Article List Page
 * Chronological list grouped by month with reveal-on-hover animation
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Filter } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ArticleListItem } from '../../types';

interface ArticleGroup {
  month: string;
  articles: ArticleListItem[];
}

const groupArticlesByMonth = (articles: ArticleListItem[]): ArticleGroup[] => {
  const groups: Record<string, ArticleListItem[]> = {};

  articles.forEach((article) => {
    if (!article.createdAt) return;
    const date = new Date(article.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(article);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, monthArticles]) => ({
      month,
      articles: monthArticles.sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      ),
    }));
};

const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

interface ArticleListItemProps {
  article: ArticleListItem;
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {

  return (
    <Link
      to={`/article/${article.slug}`}
      className="block py-3 hover:bg-black group duration-300 border-b border-gray-300"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-1 h-5 overflow-hidden">
          <h3 className="tracking-tight group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 leading-normal">
            {article.title}
          </h3>
          <p className="text-sm px-4 text-gray-500 group-hover:text-white transition-opacity duration-300 absolute inset-0 group-hover:opacity-100 opacity-0 line-clamp-1">
            {article.summary}
          </p>
        </div>
        {article.tags && article.tags.length > 0 && (
          <span className="text-xs font-mono text-gray-500 shrink-0 group-hover:opacity-0 transition-opacity">
            {article.tags.map(t => `#${t.name}`).join(' ')}
          </span>
        )}
        <span className="text-xs font-mono text-gray-500 shrink-0 group-hover:opacity-0 transition-opacity">
          {formatDate(article.createdAt)}
        </span>
      </div>
    </Link>
  );
};

interface MonthGroupProps {
  group: ArticleGroup;
}

const MonthGroup: React.FC<MonthGroupProps> = ({ group }) => {
  return (
    <div className="mb-12">
      <h2 className="pb-2 text-xs text-gray-600 font-mono">
        {formatMonth(group.month)}
      </h2>
      <div className="border-t border-gray-500">
        {group.articles.map((article) => (
          <ArticleListItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

/**
 * ArticleListPage - Chronological article listing grouped by month
 */
export const ArticleListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const size = 40;

  const { data, isLoading, error } = useArticles({
    page,
    size,
    categoryId: selectedCategory,
    language,
    keyword: searchKeyword || undefined,
  });

  const { data: categories } = useCategories(language);

  const totalPages = data?.totalPages ?? 0;

  const groupedArticles = data?.content ? groupArticlesByMonth(data.content) : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-12 pb-6 border-b-[0.5px] border-gray-200">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {t('articles.allArticles')}
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-6">
          {/* Keyword search */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                {t('articles.search')}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchKeyword(searchInput.trim());
                      setPage(0);
                    }
                  }}
                  placeholder="keyword..."
                  className="w-full px-3 py-2 text-xs font-mono border-[0.5px] border-gray-200 bg-white text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
                />
                {searchInput && (
                  <button
                    onClick={() => { setSearchInput(''); setSearchKeyword(''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-mono"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                onClick={() => { setSearchKeyword(searchInput.trim()); setPage(0); }}
                className="px-4 py-2 bg-black text-white text-[10px] font-mono uppercase tracking-wider hover:bg-[#0047FF] transition-colors duration-200"
              >
                {t('articles.search')}
              </button>
            </div>
          </div>

          {/* Category filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
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
                  }
                `}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles list grouped by month */}
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-6 w-32 bg-gray-100 mb-6 animate-pulse" />
                <div className="border-t border-b border-gray-100 divide-y divide-gray-50">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="py-4 px-4 animate-pulse">
                      <div className="h-5 bg-gray-100 w-3/4 mb-2" />
                      <div className="h-4 bg-gray-50 w-1/4" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="border-[0.5px] border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600 font-mono">
              {t('articles.error')}: {error.message}
            </p>
          </div>
        ) : groupedArticles.length === 0 ? (
          <div className="border-[0.5px] border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500 font-mono">
              {t('articles.noArticles')}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedArticles.map((group) => (
              <MonthGroup key={group.month} group={group} />
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
              ←
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
              →
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