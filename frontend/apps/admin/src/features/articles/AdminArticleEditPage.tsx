import {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchArticleById, fetchArticles, createArticle, updateArticle} from '../../api/article';
import {upsertArticleTranslation} from '../../api/articleTranslation';
import {fetchCategories} from '../../api/category';
import {fetchTags} from '../../api/tag';
import {ARTICLES_QUERY} from '../../hooks/useArticles';
import {useArticleTranslations, useTranslateArticle, ARTICLE_TRANSLATIONS_QUERY} from '../../hooks/useArticleTranslations';
import {MarkdownView, renderMarkdownToHtml} from '../../lib/markdown';
import type {Article, ArticleUpsertRequest, ArticleTranslationUpsertRequest, Language} from '@/types';
import {Save, ArrowLeft, Eye, EyeOff, Languages, Loader2} from 'lucide-react';

type TranslationForm = { title: string; summary: string; originalContent: string; isAiTranslated: boolean };
const LANGUAGES: Language[] = ['EN', 'ZH'];
const EMPTY_TRANSLATION: TranslationForm = {title: '', summary: '', originalContent: '', isAiTranslated: false};

export function AdminArticleEditPage() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const articleId = isEdit ? Number(id) : null;

    const [translations, setTranslations] = useState<Record<Language, TranslationForm>>({
        ZH: EMPTY_TRANSLATION,
        EN: EMPTY_TRANSLATION,
    });
    const [translationIds, setTranslationIds] = useState<Record<Language, number | null>>({ZH: null, EN: null});
    const translationsHydrated = useRef(false);
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [tagIds, setTagIds] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<Language>('EN');
    const [previewMode, setPreviewMode] = useState(false);

    const {data: article} = useQuery<Article | undefined>({
        queryKey: ['article', id],
        queryFn: () => fetchArticleById(Number(id)),
        enabled: isEdit,
    });
    // Translations are decoupled from the article entity: loaded per article
    // from /api/admin/articles/{id}/translations (markdown source only)
    const {data: articleTranslations} = useArticleTranslations(articleId);
    const {data: categories} = useQuery({queryKey: ['categories'], queryFn: () => fetchCategories()});
    const {data: tags} = useQuery({queryKey: ['tags'], queryFn: () => fetchTags()});

    useEffect(() => {
        if (article) {
            setSlug(article.slug);
            setStatus(article.status ?? 'DRAFT');
            setCategoryId(article.category?.id ?? null);
            setTagIds(article.tags?.map((t) => t.id as number) || []);
        }
    }, [article]);

    useEffect(() => {
        // Hydrate once only: a background refetch must not clobber unsaved edits
        if (!articleTranslations || translationsHydrated.current) return;
        translationsHydrated.current = true;
        const next: Record<Language, TranslationForm> = {ZH: EMPTY_TRANSLATION, EN: EMPTY_TRANSLATION};
        const nextIds: Record<Language, number | null> = {ZH: null, EN: null};
        articleTranslations.forEach((trans) => {
            next[trans.language] = {
                title: trans.title,
                summary: trans.summary || '',
                originalContent: trans.originalContent || '',
                isAiTranslated: trans.isAiTranslated || false,
            };
            nextIds[trans.language] = trans.id;
        });
        setTranslations(next);
        setTranslationIds(nextIds);
    }, [articleTranslations]);

    const mutation = useMutation({
        mutationFn: async (data: ArticleUpsertRequest) => {
            const requestSlug = data.slug;
            const filledLanguages = LANGUAGES.filter((lang) => translations[lang].title.trim());
            // render markdown → HTML client-side; the backend stores both
            const translationRequests: Array<ArticleTranslationUpsertRequest> = await Promise.all(
                filledLanguages.map(async (lang) => ({
                    id: translationIds[lang],
                    language: lang,
                    title: translations[lang].title,
                    summary: translations[lang].summary || null,
                    originalContent: translations[lang].originalContent,
                    content: renderMarkdownToHtml(translations[lang].originalContent),
                    isAiTranslated: translations[lang].isAiTranslated,
                }))
            );

            if (isEdit) {
                // metadata and each translation are updated independently
                await updateArticle(Number(id), data);
                await Promise.all(translationRequests.map((req) => upsertArticleTranslation(Number(id), req)));
                return;
            }

            // create is metadata-only; the backend returns no id, so resolve it via the admin list
            await createArticle(data);
            const list = await fetchArticles(0, 100);
            const created = list.content.find((a) => a.slug === requestSlug);
            if (!created) throw new Error('Article created but could not be resolved by slug');
            await Promise.all(translationRequests.map((req) => upsertArticleTranslation(created.id, req)));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [ARTICLES_QUERY]});
            if (isEdit) queryClient.invalidateQueries({queryKey: [ARTICLE_TRANSLATIONS_QUERY, articleId]});
            navigate('/admin/articles');
        },
    });

    // AI translation: fill the editor with LLM output; saving (and therefore
    // markdown → HTML rendering) stays a separate manual step
    const translateMutation = useTranslateArticle();

    const generateSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!LANGUAGES.some((lang) => translations[lang].title.trim())) return;
        const requestSlug = slug || generateSlug(translations.EN.title) || generateSlug(translations[activeTab].title);
        const request: ArticleUpsertRequest = {
            id: isEdit ? Number(id) : null,
            slug: requestSlug,
            status,
            categoryId,
            tagIds,
        };
        mutation.mutate(request);
    };

    const handleTranslationChange = (field: keyof TranslationForm, value: string) =>
        setTranslations((prev) => ({...prev, [activeTab]: {...prev[activeTab], [field]: value}}));

    const handleTagToggle = (tagId: number) =>
        setTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));

    const handleAiTranslate = () => {
        if (articleId === null) return;
        translateMutation.mutate(
            {articleId, language: activeTab},
            {
                onSuccess: (result) => {
                    setTranslations((prev) => ({
                        ...prev,
                        [activeTab]: {
                            title: result.title,
                            summary: result.summary || '',
                            originalContent: result.content || '',
                            isAiTranslated: true,
                        },
                    }));
                },
            }
        );
    };

    const currentTranslation = translations[activeTab];
    // AI translate is offered for an empty translation only, and only when a
    // saved human-written translation exists to translate from
    const canAiTranslate = articleId !== null
        && translationIds[activeTab] === null
        && !!articleTranslations?.some((t) => t.language !== activeTab && !t.isAiTranslated);

    return (
        <div className="max-w-[1120px] mx-auto space-y-5 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/articles')}
                        className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                        <ArrowLeft size={16} className="text-foreground"/>
                    </button>
                    <div>
                        <h1 className="text-[18px] font-semibold tracking-tight text-foreground leading-none">
                            {isEdit ? 'Edit article' : 'New article'}
                        </h1>
                        <p className="text-[12px] text-muted-foreground mt-1">{isEdit ? 'Update content and metadata' : 'Write in Markdown. Keep it simple.'}</p>
                    </div>
                </div>
                <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-[12px] font-medium text-foreground hover:bg-muted"
                >
                    {previewMode ? <EyeOff size={14}/> : <Eye size={14}/>}
                    {previewMode ? 'Edit' : 'Preview'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
                <div className="space-y-5">
                    <div className="admin-card p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="inline-flex p-1 rounded-full bg-muted border border-border/60">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => setActiveTab(lang)}
                                        className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                                            activeTab === lang ? 'bg-foreground text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {lang === 'ZH' ? '中文' : 'English'}
                                    </button>
                                ))}
                            </div>
                            {canAiTranslate && (
                                <button
                                    type="button"
                                    onClick={handleAiTranslate}
                                    disabled={translateMutation.isPending}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium text-foreground hover:bg-muted disabled:opacity-60 transition-colors"
                                >
                                    {translateMutation.isPending
                                        ? <Loader2 size={14} className="animate-spin"/>
                                        : <Languages size={14}/>}
                                    {translateMutation.isPending ? 'Translating…' : 'AI translate'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label
                                    className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Title
                                    · {activeTab}</label>
                                <input
                                    type="text"
                                    value={currentTranslation.title}
                                    onChange={(e) => handleTranslationChange('title', e.target.value)}
                                    className="w-full text-[18px] font-medium text-foreground placeholder:text-muted-foreground bg-transparent border-0 border-b border-border rounded-none px-0 py-2 focus:outline-none focus:border-primary"
                                    placeholder="Enter title…"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Summary</label>
                                <textarea
                                    value={currentTranslation.summary}
                                    onChange={(e) => handleTranslationChange('summary', e.target.value)}
                                    rows={2}
                                    className="w-full text-[13px] text-foreground placeholder:text-muted-foreground bg-muted border border-transparent focus:bg-card focus:border-border rounded-xl px-3 py-2.5 focus:outline-none resize-none"
                                    placeholder="One-line summary…"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[11px] font-medium tracking-wide text-muted-foreground">Content
                                        · Markdown</label>
                                    <label
                                        className="inline-flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currentTranslation.isAiTranslated}
                                            onChange={(e) =>
                                                setTranslations((prev) => ({
                                                    ...prev,
                                                    [activeTab]: {...prev[activeTab], isAiTranslated: e.target.checked}
                                                }))
                                            }
                                            className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        AI translated
                                    </label>
                                </div>
                                {previewMode ? (
                                    <div
                                        className="min-h-[420px] rounded-xl bg-muted border border-border p-4">
                                        {currentTranslation.originalContent
                                            ? <MarkdownView markdown={currentTranslation.originalContent}/>
                                            : <span className="text-[13px] text-muted-foreground">No content yet…</span>}
                                    </div>
                                ) : (
                                    <textarea
                                        value={currentTranslation.originalContent}
                                        onChange={(e) => handleTranslationChange('originalContent', e.target.value)}
                                        rows={20}
                                        className="w-full text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground bg-card border border-border rounded-xl px-3 py-3 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 resize-y min-h-[420px] font-mono"
                                        placeholder="Write your article in Markdown…"
                                    />
                                )}
                            </div>
                        </div>
                        {translateMutation.isError && (
                            <p className="text-[12px] text-red-600 mt-3">Translation failed. Check the LLM service and try again.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 lg:sticky lg:top-[76px]">
                    <div className="admin-card p-4">
                        <label
                            className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Slug</label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full text-[13px] bg-muted border border-transparent focus:bg-card focus:border-border rounded-xl px-3 py-2.5 focus:outline-none"
                            placeholder="article-url-slug"
                        />
                        <p className="text-[11px] text-muted-foreground mt-2">Auto-generated if empty.</p>
                    </div>

                    <div className="admin-card p-4">
                        <label
                            className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as typeof status)}
                            className="w-full text-[13px] bg-muted border border-transparent focus:bg-card focus:border-border rounded-xl px-3 py-2.5 focus:outline-none"
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>

                    <div className="admin-card p-4">
                        <label
                            className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Category</label>
                        <select
                            value={categoryId || ''}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full text-[13px] bg-muted border border-transparent focus:bg-card focus:border-border rounded-xl px-3 py-2.5 focus:outline-none"
                        >
                            <option value="">No category</option>
                            {categories?.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.names.EN || cat.names.ZH || ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-card p-4">
                        <label
                            className="block text-[11px] font-medium tracking-wide text-muted-foreground mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags?.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id as number)}
                                    className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                                        tagIds.includes(tag.id as number)
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-card text-muted-foreground border-border hover:border-border'
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            {tags?.length === 0 &&
                                <span className="text-[12px] text-muted-foreground">No tags yet.</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={mutation.isPending || !LANGUAGES.some((l) => translations[l].title.trim())}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white text-[13px] font-medium rounded-full hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Save size={14}/>
                        {mutation.isPending ? 'Saving…' : isEdit ? 'Update article' : 'Create article'}
                    </button>
                    {mutation.isError &&
                        <p className="text-[12px] text-red-600 text-center">Failed to save. Check required fields.</p>}
                </div>
            </form>
        </div>
    );
}