/**
 * ArticleCard Component
 * Technical Minimalism style - inspired by aino.agency
 * Features: hairline borders, monospace metadata, sharp corners
 */
import { Link } from 'react-router-dom';
import { Calendar, Eye, Tag } from 'lucide-react';
import type { ArticleListItem } from '../../types';

interface ArticleCardProps {
  article: ArticleListItem;
}

/**
 * Format date to readable string
 */
const formatDate = (article: ArticleListItem): string => {
  const dateString = article.createdAt || article.updatedAt;
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * ArticleCard - Displays article preview in technical minimalism style
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Get category localized name - ArticleListItem has resolved title/summary, but category needs i18n
  const categoryName = article.category?.name || null;

  return (
    <article className="group border-[0.5px] border-gray-200 bg-white transition-all duration-200 hover:border-[#0047FF] hover:shadow-sm">
      {/* Top border accent */}
      <div className="h-[1px] w-full bg-black group-hover:bg-[#0047FF] transition-colors duration-200" />

      <div className="p-6">
        {/* Metadata row - Monospace font for technical feel */}
        <div className="flex items-center gap-4 mb-4 text-[10px] font-mono uppercase tracking-wider text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {(article.viewCount || 0).toString().padStart(4, '0')}
          </span>
          {categoryName && (
            <span className="px-2 py-0.5 border-[0.5px] border-gray-200">
              {categoryName}
            </span>
          )}
        </div>

        {/* Title - Large, bold, tight leading */}
        <h2 className="text-xl font-bold tracking-tight text-black mb-3 leading-tight group-hover:text-[#0047FF] transition-colors duration-200">
          <Link to={`/article/${article.slug}`} className="block">
            {article.title}
          </Link>
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3 h-3 text-gray-400" />
            {article.tags?.map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="text-[10px] font-mono text-gray-500 hover:text-[#0047FF] transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="h-[0.5px] w-full bg-gray-100" />
    </article>
  );
};
