/**
 * Admin Article Edit Page
 * Create or edit article with multilingual support
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchArticleById, createArticle, updateArticle } from '../../api/article';
import { fetchCategories } from '../../api/category';
import { fetchTags } from '../../api/tag';
import { ARTICLES_QUERY } from '../../hooks/useArticles';
import type { ArticleDTO, ArticleCreateRequest, ArticleUpdateRequest, ArticleTranslationUpsertRequest, Language } from '../../types';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type TranslationForm = {
  title: string;
  summary: string;
  content: string;
};

const LANGUAGES: Language[] = ['EN', 'ZH'];

export function AdminArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [translations, setTranslations] = useState<Record<Language, TranslationForm>>({
    ZH: { title: '', summary: '', content: '' },
    EN: { title: '', summary: '', content: '' },
  });

  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<Language>('ZH');
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch article if editing
  const { data: article } = useQuery<ArticleDTO | undefined>({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(Number(id)),
    enabled: isEdit,
  });

  // Fetch categories and tags
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Populate form when editing
  useEffect(() => {
    if (article) {
      // Build translations from article's translations map
      const newTranslations: Record<Language, TranslationForm> = {
        ZH: { title: '', summary: '', content: '' },
        EN: { title: '', summary: '', content: '' },
      };
      Object.entries(article.translations).forEach(([lang, trans]) => {
        const language = lang as Language;
        newTranslations[language] = {
          title: trans.title,
          summary: trans.summary || '',
          content: trans.content || '',
        };
      });

      setTranslations(newTranslations);
      setSlug(article.slug);
      setStatus(article.status);
      setCategoryId(article.category?.id ?? null);
      setTagIds(article.tags?.map((t) => t.id as number) || []);
    }
  }, [article]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data: ArticleCreateRequest | ArticleUpdateRequest) => {
      if (isEdit) {
        return updateArticle(Number(id), data as ArticleUpdateRequest);
      }
      return createArticle(data as ArticleCreateRequest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY] });
      navigate('/admin/articles');
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one language has a title
    const hasContent = LANGUAGES.some(
      (lang) => translations[lang].title.trim()
    );
    if (!hasContent) return;

    const translationsRequest: Array<ArticleTranslationUpsertRequest> = [];
    LANGUAGES.forEach((lang) => {
      if (translations[lang].title.trim()) {
        translationsRequest.push({
          id: null,
          language: lang,
          title: translations[lang].title,
          summary: translations[lang].summary || null,
          content: translations[lang].content || null,
        });
      }
    });

    const requestSlug = slug || generateSlug(translations.EN.title) || generateSlug(translations[activeTab].title);

    if (isEdit) {
      const request: ArticleUpdateRequest = {
        id: Number(id),
        slug: requestSlug,
        status,
        categoryId,
        tagIds,
        translations: translationsRequest,
      };
      mutation.mutate(request);
    } else {
      const request: ArticleCreateRequest = {
        slug: requestSlug,
        status,
        categoryId,
        tagIds,
        translations: translationsRequest,
      };
      mutation.mutate(request);
    }
  };

  const handleTranslationChange = (field: keyof TranslationForm, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const currentTranslation = translations[activeTab];

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/articles')}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
                {isEdit ? 'EDIT ARTICLE' : 'NEW ARTICLE'}
              </h1>
              <p className="text-gray-500 text-sm font-mono mt-1">
                {isEdit ? 'Update article content' : 'Create a new article'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-mono hover:bg-gray-50 transition-colors"
          >
            {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Title & Content with Language Tabs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Language Tabs */}
              <div className="bg-white border border-gray-200 p-4">
                <div className="flex gap-2 mb-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveTab(lang)}
                      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
                        activeTab === lang
                          ? 'bg-[#0047FF] text-white border-[#0047FF]'
                          : 'border-gray-300 text-gray-600 hover:border-[#0047FF]'
                      }`}
                    >
                      {lang === 'ZH' ? '中文' : 'English'}
                    </button>
                  ))}
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    Title ({activeTab === 'ZH' ? '中文' : 'English'}) *
                  </label>
                  <input
                    type="text"
                    value={currentTranslation.title}
                    onChange={(e) => handleTranslationChange('title', e.target.value)}
                    className="w-full text-xl font-mono text-black border-0 border-b border-gray-200 pb-2 focus:border-[#0047FF] focus:outline-none"
                    placeholder={`Enter article title in ${activeTab === 'ZH' ? 'Chinese' : 'English'}...`}
                    required
                  />
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    Summary ({activeTab === 'ZH' ? '中文' : 'English'})
                  </label>
                  <textarea
                    value={currentTranslation.summary}
                    onChange={(e) => handleTranslationChange('summary', e.target.value)}
                    rows={3}
                    className="w-full font-mono text-gray-700 border-0 focus:outline-none resize-none"
                    placeholder="Brief summary of the article..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                    Content ({activeTab === 'ZH' ? '中文' : 'English'}) - Markdown
                  </label>
                  {previewMode ? (
                    <div className="prose prose-sm max-w-none min-h-[400px] font-mono text-gray-700">
                      {currentTranslation.content || 'No content yet...'}
                    </div>
                  ) : (
                    <textarea
                      value={currentTranslation.content}
                      onChange={(e) => handleTranslationChange('content', e.target.value)}
                      rows={20}
                      className="w-full font-mono text-sm text-gray-700 border-0 focus:outline-none resize-none"
                      placeholder="Write your article content in Markdown..."
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Settings */}
            <div className="space-y-6">
              {/* Slug */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                  placeholder="article-url-slug"
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Auto-generated from first non-empty title if empty
                </p>
              </div>

              {/* Status */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Category */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={categoryId || ''}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="">No Category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id as number)}
                      className={`px-3 py-1 text-xs font-mono border transition-colors ${
                        tagIds.includes(tag.id as number)
                          ? 'bg-[#0047FF] text-white border-[#0047FF]'
                          : 'border-gray-300 text-gray-600 hover:border-[#0047FF]'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={mutation.isPending || !LANGUAGES.some((l) => translations[l].title.trim())}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {mutation.isPending ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
              </button>

              {mutation.isError && (
                <p className="text-red-500 text-xs font-mono text-center">
                  Error saving article
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
