import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Filter } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ArticleSummaryVo } from '@/types';

interface ArticleGroup { month: string; articles: ArticleSummaryVo[]; }

const groupArticlesByMonth = (articles: ArticleSummaryVo[]): ArticleGroup[] => {
  const groups: Record<string, ArticleSummaryVo[]> = {};
  articles.forEach(a => {
    if (!a.createdAt) return;
    const d = new Date(a.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  });
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([month, arts]) => ({
    month, articles: arts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()),
  }));
};

const formatMonth = (m: string) => {
  const [y, mo] = m.split('-');
  return new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

const formatDate = (s: string | null) => s ? new Date(s).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '';

const ArticleSummaryVoComp: React.FC<{ article: ArticleSummaryVo }> = ({ article }) => (
  <Link to={`/article/${article.slug}`} className="block py-3 hover:bg-black dark:hover:bg-white group duration-300 border-b border-gray-300 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className="relative flex-1 group-hover:px-4 duration-300">
        <h3 className="text-left text-base group-hover:text-white dark:group-hover:text-black font-semibold tracking-tight text-black dark:text-white">{article.title}</h3>
        <div className="max-h-0 group-hover:max-h-16 overflow-hidden transition-[max-height] duration-300 ease-out">
          <p className="text-sm text-white dark:text-black pt-1">{article.summary}</p>
        </div>
      </div>
      {article.tags && article.tags.length > 0 && (
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0 group-hover:opacity-0 transition-opacity">
          {article.tags.map(t => `#${t.name}`).join(' ')}
        </span>
      )}
      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 shrink-0 group-hover:opacity-0 transition-opacity">
        {formatDate(article.createdAt)}
      </span>
    </div>
  </Link>
);

export const ArticleListPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const size = 40;

  const { data, isLoading, error } = useArticles({ page, size, categoryId: selectedCategory, language, keyword: searchKeyword || undefined });
  const { data: categories } = useCategories(language);

  const groupedArticles = data?.content ? groupArticlesByMonth(data.content) : [];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b-[0.5px] border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{t('articles.allArticles')}</h1>
        </div>

        <div className="mb-10 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">{t('articles.search')}</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-xs">
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setSearchKeyword(searchInput.trim()); setPage(0); } }}
                  placeholder="keyword..."
                  className="w-full px-3 py-2 text-xs font-mono border-[0.5px] border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors" />
                {searchInput && <button onClick={() => { setSearchInput(''); setSearchKeyword(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white text-xs font-mono">×</button>}
              </div>
              <button onClick={() => { setSearchKeyword(searchInput.trim()); setPage(0); }}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-mono uppercase tracking-wider hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors">{t('articles.search')}</button>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500">{t('articles.filterByCategory')}</span>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => { setSelectedCategory(undefined); setPage(0); }}
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-[0.5px] transition-all ${selectedCategory === undefined ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300 hover:border-gray-400'}`}>{t('articles.all')}</button>
              {categories?.map(c => (
                <button key={c.id} onClick={() => { setSelectedCategory(c.id ?? undefined); setPage(0); }}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-[0.5px] transition-all ${selectedCategory === c.id ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300 hover:border-gray-400'}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-12">{[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 mb-2 animate-pulse" />
              <div className="border-t border-gray-200 dark:border-gray-800">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="py-3 border-b border-gray-200 dark:border-gray-800 animate-pulse">
                    <div className="h-5 bg-gray-100 dark:bg-gray-800 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}</div>
        ) : error ? (
          <div className="border-[0.5px] border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-6 text-center">
            <p className="text-sm text-red-600 dark:text-red-400 font-mono">{t('articles.error')}: {error.message}</p>
          </div>
        ) : groupedArticles.length === 0 ? (
          <div className="border-[0.5px] border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{t('articles.noArticles')}</p>
          </div>
        ) : (
          <div className="space-y-12">{groupedArticles.map(g => (
            <div key={g.month} className="mb-12">
              <h2 className="pb-2 text-xs text-gray-600 dark:text-gray-400 font-mono">{formatMonth(g.month)}</h2>
              <div className="border-t border-gray-500 dark:border-gray-600">
                {g.articles.map(a => <ArticleSummaryVoComp key={a.id} article={a} />)}
              </div>
            </div>
          ))}</div>
        )}

        {data && (
          <div className="mt-6 text-center">
            <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
              {t('articles.showing')} {data.content.length} {t('articles.of')} {data.total} {t('articles.articles')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};