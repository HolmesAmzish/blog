import { useParams, Link } from 'react-router-dom';
import { useArticleBySlug } from '../../hooks/useArticles';
import { useLanguage } from '../../context/LanguageContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import { Calendar, Eye, Tag, ArrowLeft } from 'lucide-react';

const formatDate = (s: string | null): string => s ? new Date(s).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '---';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { data: article, isLoading, error } = useArticleBySlug(slug ?? null, language);

  if (isLoading) return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-[0.5px] border-gray-200 dark:border-gray-800 p-8 animate-pulse">
          <div className="h-8 bg-gray-100 dark:bg-gray-800 mb-4 w-3/4" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 mb-8 w-1/2" />
          <div className="space-y-3">
            <div className="h-3 bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !article) return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-[0.5px] border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-8 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono mb-4">ERROR: {error?.message || 'Article not found'}</p>
          <Link to="/articles" className="inline-flex items-center gap-2 text-[11px] font-mono text-black dark:text-white hover:text-[#0047FF]"><ArrowLeft className="w-4 h-4" /> BACK TO ARTICLES</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/articles" className="inline-flex items-center gap-2 text-[11px] font-mono text-gray-500 dark:text-gray-400 hover:text-[#0047FF] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> BACK TO ARTICLES
        </Link>

        <header className="mb-8 pb-8 border-b-[0.5px] border-gray-200 dark:border-gray-800">
          {article.isAiTranslated && (
            <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-950 dark:bg-opacity-30 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                {language === 'ZH' ? '本文由 AI 翻译' : 'This article was translated by AI for reference only'}
              </p>
            </div>
          )}
          {article.category && (
            <Link to={`/articles?category=${article.category.id}`} className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-wider border-[0.5px] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0047FF] hover:text-[#0047FF] transition-colors mb-4">
              {article.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-6 leading-tight">{article.title || 'Untitled'}</h1>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(article.createdAt)}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount.toString().padStart(4, '0')} VIEWS</span>
          </div>
        </header>

        <article className="prose prose-lg max-w-none">
          {article.content ? (
            <div className="markdown-content">
              <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-black dark:text-white mt-8 mb-4 pb-2 border-b-[0.5px] border-gray-200 dark:border-gray-800">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-black dark:text-white mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold text-black dark:text-white mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                  code: ({ children, className }) => !className ? (
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 text-sm font-mono text-[#0047FF] rounded">{children}</code>
                  ) : (
                    <pre className="border-[0.5px] border-gray-200 dark:border-gray-800 p-4 overflow-x-auto mb-4"><code className={className}>{children}</code></pre>
                  ),
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-[#0047FF] pl-4 italic text-gray-600 dark:text-gray-400 my-4">{children}</blockquote>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-4 text-gray-700 dark:text-gray-300 pl-6">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-4 text-gray-700 dark:text-gray-300 pl-6">{children}</ol>,
                  li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
                  a: ({ children, href }) => <a href={href} className="text-[#0047FF] hover:underline" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
                }}
              >{article.content}</Markdown>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 font-mono text-center py-12">NO CONTENT AVAILABLE</p>
          )}
        </article>

        {article.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t-[0.5px] border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">TAGS</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link key={tag.id} to={`/articles?tag=${tag.id}`} className="px-3 py-1.5 text-[11px] font-mono border-[0.5px] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0047FF] hover:text-[#0047FF] transition-colors">#{tag.name}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};