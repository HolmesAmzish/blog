/**
 * Article Detail Page
 * Markdown rendering with LaTeX and code highlighting
 */
import { useParams, Link } from 'react-router-dom';
import { useArticleBySlug } from '../../hooks/useArticles';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';
import { Calendar, Eye, Tag, ArrowLeft, User } from 'lucide-react';

/**
 * Format date to readable string
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * ArticleDetailPage - Full article with markdown rendering
 */
export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = useArticleBySlug(slug ?? null);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-[0.5px] border-gray-200 p-8 animate-pulse">
            <div className="h-8 bg-gray-100 mb-4 w-3/4" />
            <div className="h-4 bg-gray-100 mb-8 w-1/2" />
            <div className="space-y-3">
              <div className="h-3 bg-gray-100" />
              <div className="h-3 bg-gray-100" />
              <div className="h-3 bg-gray-100 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-[0.5px] border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-600 font-mono mb-4">
              ERROR: {error?.message || 'Article not found'}
            </p>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-[11px] font-mono text-black hover:text-[#0047FF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO ARTICLES
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-[11px] font-mono text-gray-500 hover:text-[#0047FF] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO ARTICLES
        </Link>

        {/* Article header */}
        <header className="mb-8 pb-8 border-b-[0.5px] border-gray-200">
          {/* Category */}
          {article.categoryName && (
            <Link
              to={`/category/${article.categoryId}`}
              className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-wider border-[0.5px] border-gray-200 text-gray-600 hover:border-[#0047FF] hover:text-[#0047FF] transition-colors mb-4"
            >
              {article.categoryName}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount.toString().padStart(4, '0')} VIEWS
            </span>
            {article.authorName && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.authorName.toUpperCase()}
              </span>
            )}
          </div>
        </header>

        {/* Article content */}
        <article className="prose prose-lg max-w-none">
          {article.content ? (
            <div className="markdown-content">
              <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-black mt-8 mb-4 pb-2 border-b-[0.5px] border-gray-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-black mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold text-black mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="px-1.5 py-0.5 bg-gray-100 text-sm font-mono text-[#0047FF] rounded-sm">
                        {children}
                      </code>
                    ) : (
                      <pre className="border-[0.5px] border-gray-200 p-4 overflow-x-auto mb-4">
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#0047FF] pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-gray-700">
                      {children}
                    </ol>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-[#0047FF] hover:underline"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {article.content}
              </Markdown>
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-center py-12">
              NO CONTENT AVAILABLE
            </p>
          )}
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t-[0.5px] border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                TAGS
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="px-3 py-1.5 text-[11px] font-mono border-[0.5px] border-gray-200 text-gray-600 hover:border-[#0047FF] hover:text-[#0047FF] transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
