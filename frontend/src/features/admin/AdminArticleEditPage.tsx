/**
 * Admin Article Edit Page
 * Create or edit article
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchArticleById, createArticle, updateArticle } from '../../api/article';
import { fetchCategories } from '../../api/category';
import { fetchTags } from '../../api/tag';
import type { ArticleDTO, ArticleRequest } from '../../types';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const initialForm: ArticleRequest = {
  title: '',
  summary: '',
  content: '',
  originalContent: '',
  slug: '',
  language: 'ZH',
  status: 'DRAFT',
  categoryId: null,
  tagIds: [],
};

export function AdminArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<ArticleRequest>(initialForm);
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
    queryFn: fetchCategories,
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  // Populate form when editing
  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        summary: article.summary || '',
        content: article.content || '',
        originalContent: article.originalContent || '',
        slug: article.slug,
        language: article.language,
        status: article.status,
        categoryId: article.categoryId,
        tagIds: article.tags?.map((t) => t.id as number) || [],
      });
    }
  }, [article]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data: ArticleRequest) => {
      if (isEdit) {
        return updateArticle(Number(id), data);
      }
      return createArticle(data);
    },
    onSuccess: () => {
      navigate('/admin/articles');
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    // Auto-generate slug if empty
    const dataToSubmit = {
      ...form,
      slug: form.slug || generateSlug(form.title),
    };

    mutation.mutate(dataToSubmit);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((t) => t !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

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
            {/* Left: Title & Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full text-xl font-mono text-black border-0 border-b border-gray-200 pb-2 focus:border-[#0047FF] focus:outline-none"
                  placeholder="Enter article title..."
                  required
                />
              </div>

              {/* Summary */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={form.summary ?? ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full font-mono text-gray-700 border-0 focus:outline-none resize-none"
                  placeholder="Brief summary of the article..."
                />
              </div>

              {/* Content */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Content (Markdown)
                </label>
                {previewMode ? (
                  <div className="prose prose-sm max-w-none min-h-[400px] font-mono text-gray-700">
                    {form.content || 'No content yet...'}
                  </div>
                ) : (
                  <textarea
                    name="content"
                    value={form.content ?? ''}
                    onChange={handleChange}
                    rows={20}
                    className="w-full font-mono text-sm text-gray-700 border-0 focus:outline-none resize-none"
                    placeholder="Write your article content in Markdown..."
                  />
                )}
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
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                  placeholder="article-url-slug"
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Auto-generated from title if empty
                </p>
              </div>

              {/* Status */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Language */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="w-full font-mono text-sm text-gray-700 border border-gray-200 px-3 py-2 focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="ZH">中文</option>
                  <option value="EN">English</option>
                </select>
              </div>

              {/* Category */}
              <div className="bg-white border border-gray-200 p-6">
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value ? Number(e.target.value) : null,
                    }))
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
                        form.tagIds.includes(tag.id as number)
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
                disabled={mutation.isPending || !form.title.trim()}
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