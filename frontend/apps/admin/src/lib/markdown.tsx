/**
 * Markdown → HTML rendering for the admin app.
 *
 * The admin is the only place where markdown is rendered: on save, the edit
 * page calls renderMarkdownToHtml() and stores the result in the translation's
 * `content` column, so the public app can inject pre-rendered HTML directly
 * without shipping the markdown vendor (react-markdown/remark/rehype/katex JS).
 *
 * - renderMarkdownToHtml: react-markdown WITHOUT component overrides, rendered
 *   to a static markup string. Output is clean semantic HTML whose only
 *   classes are the ones the public stylesheet targets (language-*, hljs-*,
 *   katex, etc.).
 * - MarkdownView: the same react-markdown pipeline WITH styled component
 *   overrides, used for the in-app editing preview. KaTeX CSS is imported
 *   here so both paths display math correctly.
 */
import Markdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';

const REMARK_PLUGINS = [remarkGfm, remarkMath];
const REHYPE_PLUGINS = [rehypeKatex, rehypeHighlight];

export const renderMarkdownToHtml = (markdown: string): string =>
    renderToStaticMarkup(
        <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
            {markdown}
        </Markdown>
    );

export const MarkdownView: React.FC<{ markdown: string }> = ({markdown}) => (
    <div className="markdown-content text-[13px] leading-relaxed text-foreground">
        <Markdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={{
                h1: ({children}) => <h1 className="text-xl font-bold mt-6 mb-3">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold mt-5 mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>,
                p: ({children}) => <p className="mb-3">{children}</p>,
                code: ({children, className}) => !className ? (
                    <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-[12px]">{children}</code>
                ) : (
                    <pre className="border border-border rounded-xl p-3 overflow-x-auto mb-3 bg-muted"><code
                        className={className}>{children}</code></pre>
                ),
                blockquote: ({children}) => <blockquote
                    className="border-l-2 border-primary pl-3 italic text-muted-foreground my-3">{children}</blockquote>,
                ul: ({children}) => <ul className="list-disc list-outside mb-3 pl-6">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-outside mb-3 pl-6">{children}</ol>,
                li: ({children}) => <li className="mb-1">{children}</li>,
                a: ({children, href}) => <a href={href} className="text-primary hover:underline"
                                            target={href?.startsWith('http') ? '_blank' : undefined}
                                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
                table: ({children}) => <table className="w-full border-collapse mb-3 text-[12px]">{children}</table>,
                th: ({children}) => <th
                    className="border border-border px-2 py-1.5 text-left font-medium bg-muted">{children}</th>,
                td: ({children}) => <td className="border border-border px-2 py-1.5">{children}</td>,
            }}
        >
            {markdown}
        </Markdown>
    </div>
);