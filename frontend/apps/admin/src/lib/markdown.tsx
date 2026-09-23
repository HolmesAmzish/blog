/**
 * Markdown → HTML rendering for the admin app.
 *
 * The admin is the only place where markdown is rendered: on save, the edit
 * page calls renderMarkdownToHtml() and stores the result in the translation's
 * `content` column, so the public app can inject pre-rendered HTML directly
 * without shipping the markdown vendor (react-markdown/remark/rehype/katex JS).
 *
 * - renderMarkdownToHtml: serializes the Markdown AST directly to HTML so
 *   KaTeX's inline layout styles are preserved.
 * - MarkdownView: uses react-markdown for the in-app editing preview and
 *   restores the raw HAST styles that React would otherwise discard.
 */
import Markdown from 'react-markdown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import 'katex/dist/katex.min.css';

const REMARK_PLUGINS = [remarkGfm, remarkMath];
const REHYPE_PLUGINS = [rehypeKatex, rehypeHighlight];

const markdownProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify);

const parseInlineStyle = (style: unknown): React.CSSProperties | undefined => {
    if (typeof style !== 'string') return undefined;

    const parsed: Record<string, string> = {};
    for (const declaration of style.split(';')) {
        const separator = declaration.indexOf(':');
        if (separator === -1) continue;

        const property = declaration.slice(0, separator).trim();
        const value = declaration.slice(separator + 1).trim();
        if (!property || !value) continue;

        const key = property.startsWith('--')
            ? property
            : property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
        parsed[key] = value;
    }

    return parsed as React.CSSProperties;
};

export const renderMarkdownToHtml = (markdown: string): string =>
    String(markdownProcessor.processSync(markdown));

export const MarkdownView: React.FC<{ markdown: string }> = ({markdown}) => (
    <div className="markdown-content text-[13px] leading-relaxed text-foreground">
        <Markdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={{
                span: ({node, children, style: _style, ...props}) => (
                    <span {...props} style={parseInlineStyle(node?.properties?.style)}>
                        {children}
                    </span>
                ),
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
