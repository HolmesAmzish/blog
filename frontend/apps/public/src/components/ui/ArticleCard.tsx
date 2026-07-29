import { Link } from 'react-router-dom';
import type { ArticleListItem } from '@blog/types';

interface ArticleCardProps {
  article: ArticleListItem;
  index?: number;
  className?: string;
  showTags?: boolean;
}

const formatDate = (article: ArticleListItem): string => {
  const dateString = article.createdAt || article.updatedAt;
  if (!dateString) return '---';
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index, className = '', showTags = true }) => {
  const categoryName = article.category?.name || null;
  const displayIndex = index !== undefined ? String(index + 1).padStart(2, '0') : null;

  return (
    <article className={`group border-gray-200 dark:border-gray-800 py-6 md:py-2 transition-colors duration-200 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {displayIndex && <span className="w-8 text-gray-400 dark:text-gray-500">[{displayIndex}]</span>}
        <span>{formatDate(article)}</span>
        {categoryName && (
          <>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="px-2 py-0.5 border-[0.5px] border-gray-200 dark:border-gray-700">{categoryName}</span>
          </>
        )}
        {showTags && article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            {article.tags.map(tag => <span key={tag.id} className="text-gray-500 dark:text-gray-400">#{tag.name}</span>)}
          </div>
        )}
      </div>
      <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-black dark:text-white uppercase leading-tight group-hover:text-[#0047FF] transition-colors duration-200">
        <Link to={`/article/${article.slug}`} className="block">{article.title}</Link>
      </h2>
      {article.summary && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 max-w-2xl">{article.summary}</p>
      )}
    </article>
  );
};