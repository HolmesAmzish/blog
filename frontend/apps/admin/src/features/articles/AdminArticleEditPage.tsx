import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchArticleById, createArticle, updateArticle } from '../../api/article';
import { fetchCategories } from '../../api/category';
import { fetchTags } from '../../api/tag';
import { ARTICLES_QUERY } from '../../hooks/useArticles';
import type { Article, ArticleUpsertRequest, ArticleTranslationUpsertRequest, Language } from '@/types';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type TranslationForm = { title: string; summary: string; content: string; isAiTranslated: boolean };
const LANGUAGES: Language[] = ['EN', 'ZH'];

export function AdminArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [translations, setTranslations] = useState<Record<Language, TranslationForm>>({
    ZH: { title: '', summary: '', content: '', isAiTranslated: false },
    EN: { title: '', summary: '', content: '', isAiTranslated: false },
  });
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<Language>('EN');
  const [previewMode, setPreviewMode] = useState(false);

  const { data: article } = useQuery<Article | undefined>({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(Number(id)),
    enabled: isEdit,
  });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => fetchCategories() });
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: () => fetchTags() });

  useEffect(() => {
    if (article) {
      const newTranslations: Record<Language, TranslationForm> = {
        ZH: { title: '', summary: '', content: '', isAiTranslated: false },
        EN: { title: '', summary: '', content: '', isAiTranslated: false },
      };
      Object.entries(article.translations).forEach(([lang, trans]) => {
        const language = lang as Language;
        newTranslations[language] = {
          title: trans.title,
          summary: trans.summary || '',
          content: trans.content || '',
          isAiTranslated: trans.isAiTranslated || false,
        };
      });
      setTranslations(newTranslations);
      setSlug(article.slug);
      setStatus(article.status ?? 'DRAFT');
      setCategoryId(article.category?.id ?? null);
      setTagIds(article.tags?.map((t) => t.id as number) || []);
    }
  }, [article]);

  const mutation = useMutation({
    mutationFn: (data: ArticleUpsertRequest) => (isEdit ? updateArticle(Number(id), data) : createArticle(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY] });
      navigate('/admin/articles');
    },
  });

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!LANGUAGES.some((lang) => translations[lang].title.trim())) return;
    const translationsRequest: Array<ArticleTranslationUpsertRequest> = [];
    LANGUAGES.forEach((lang) => {
      if (translations[lang].title.trim()) {
        translationsRequest.push({
          id: null,
          language: lang,
          title: translations[lang].title,
          summary: translations[lang].summary || null,
          content: translations[lang].content || null,
          isAiTranslated: translations[lang].isAiTranslated,
        });
      }
    });
    const requestSlug = slug || generateSlug(translations.EN.title) || generateSlug(translations[activeTab].title);
    const request: ArticleUpsertRequest = {
      id: isEdit ? Number(id) : null,
      slug: requestSlug,
      status,
      categoryId,
      tagIds,
      translations: translationsRequest,
    };
    mutation.mutate(request);
  };

  const handleTranslationChange = (field: keyof TranslationForm, value: string) =>
    setTranslations((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));

  const handleTagToggle = (tagId: number) =>
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));

  const currentTranslation = translations[activeTab];

  return (
    <div className="max-w-[1120px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/articles')}
            className="w-9 h-9 rounded-full bg-white border border-[#e8e8ed] flex items-center justify-center hover:bg-[#f5f5f7] transition-colors"
          >
            <ArrowLeft size={16} className="text-[#1d1d1f]" />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] leading-none">
              {isEdit ? 'Edit article' : 'New article'}
            </h1>
            <p className="text-[12px] text-[#86868b] mt-1">{isEdit ? 'Update content and metadata' : 'Write in Markdown. Keep it simple.'}</p>
          </div>
        </div>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#e8e8ed] text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
        >
          {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="space-y-5">
          <div className="admin-card p-5">
            <div className="inline-flex p-1 rounded-full bg-[#f5f5f7] border border-[#e8e8ed]/60 mb-5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    activeTab === lang ? 'bg-[#1d1d1f] text-white shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  {lang === 'ZH' ? '中文' : 'English'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Title · {activeTab}</label>
                <input
                  type="text"
                  value={currentTranslation.title}
                  onChange={(e) => handleTranslationChange('title', e.target.value)}
                  className="w-full text-[18px] font-medium text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-transparent border-0 border-b border-[#e8e8ed] rounded-none px-0 py-2 focus:outline-none focus:border-[#0047FF]"
                  placeholder={activeTab === 'ZH' ? 'Enter title…' : 'Enter title…'}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Summary</label>
                <textarea
                  value={currentTranslation.summary}
                  onChange={(e) => handleTranslationChange('summary', e.target.value)}
                  rows={2}
                  className="w-full text-[13px] text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 focus:outline-none resize-none"
                  placeholder="One-line summary…"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-medium tracking-wide text-[#86868b]">Content · Markdown</label>
                  <label className="inline-flex items-center gap-2 text-[11px] text-[#6e6e73] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentTranslation.isAiTranslated}
                      onChange={(e) =>
                        setTranslations((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], isAiTranslated: e.target.checked } }))
                      }
                      className="w-3.5 h-3.5 rounded border-[#d2d2d7] text-[#0047FF] focus:ring-[#0047FF]/20"
                    />
                    AI translated
                  </label>
                </div>
                {previewMode ? (
                  <div className="min-h-[420px] rounded-xl bg-[#fbfbfd] border border-[#e8e8ed] p-4 text-[13px] leading-relaxed text-[#1d1d1f] whitespace-pre-wrap">
                    {currentTranslation.content || 'No content yet…'}
                  </div>
                ) : (
                  <textarea
                    value={currentTranslation.content}
                    onChange={(e) => handleTranslationChange('content', e.target.value)}
                    rows={20}
                    className="w-full text-[13px] leading-relaxed text-[#1d1d1f] placeholder:text-[#a1a1a6] bg-white border border-[#e8e8ed] rounded-xl px-3 py-3 focus:outline-none focus:border-[#0047FF]/40 focus:ring-4 focus:ring-[#0047FF]/10 resize-y min-h-[420px] font-mono"
                    placeholder="Write your article in Markdown…"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-[76px]">
          <div className="admin-card p-4">
            <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full text-[13px] bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 focus:outline-none"
              placeholder="article-url-slug"
            />
            <p className="text-[11px] text-[#86868b] mt-2">Auto-generated if empty.</p>
          </div>

          <div className="admin-card p-4">
            <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-full text-[13px] bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 focus:outline-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="admin-card p-4">
            <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Category</label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full text-[13px] bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 focus:outline-none"
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
            <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id as number)}
                  className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${
                    tagIds.includes(tag.id as number)
                      ? 'bg-[#0047FF] text-white border-[#0047FF]'
                      : 'bg-white text-[#6e6e73] border-[#e8e8ed] hover:border-[#d2d2d7]'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
              {tags?.length === 0 && <span className="text-[12px] text-[#86868b]">No tags yet.</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !LANGUAGES.some((l) => translations[l].title.trim())}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Save size={14} />
            {mutation.isPending ? 'Saving…' : isEdit ? 'Update article' : 'Create article'}
          </button>
          {mutation.isError && <p className="text-[12px] text-red-600 text-center">Failed to save. Check required fields.</p>}
        </div>
      </form>
    </div>
  );
}
