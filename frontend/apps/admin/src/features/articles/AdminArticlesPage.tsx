import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useArticles, ARTICLES_QUERY } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteArticle } from '../../api/article';

export function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

  const { data: articlesData, isLoading } = useArticles({ page, size: 10, isAdmin: true });
  const { data: categories } = useCategories();

  const filteredArticles = articlesData?.content.filter((article) => {
    const matchesSearch = search === '' || article.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' || article.category?.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY] }),
  });

  const handleDelete = (id: number) => {
    if (confirm('Delete this article? This cannot be undone.')) deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Articles</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Create, edit and publish your content.</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] transition-colors shadow-sm"
        >
          <Plus size={14} />
          New Article
        </Link>
      </div>

      <div className="admin-card p-4 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" size={14} />
          <input
            type="text"
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] focus:outline-none text-[13px] placeholder:text-[#86868b]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
          className="px-3 py-2.5 rounded-xl bg-[#f5f5f7] border border-transparent text-[13px] text-[#1d1d1f] focus:bg-white focus:border-[#e8e8ed] focus:outline-none min-w-[180px]"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id!}>
              {cat.names.EN || cat.names.ZH || ''}
            </option>
          ))}
        </select>
        {(search || categoryFilter !== '') && (
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
            }}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#2c2c2e] text-[13px] text-[#1d1d1f] dark:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="admin-card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#fbfbfd] dark:bg-[#111113] border-b border-[#e8e8ed] dark:border-[#2c2c2e] text-[11px] font-medium tracking-wide text-[#86868b] dark:text-[#98989d]">
          <div className="col-span-6">Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-[13px] text-[#86868b]">Loading articles…</div>
        ) : filteredArticles?.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[13px] text-[#86868b]">No articles found.</p>
            <Link to="/admin/articles/new" className="inline-flex mt-3 text-[13px] font-medium text-[#0047FF] hover:underline">
              Create the first one
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e8e8ed] dark:divide-[#2c2c2e]">
            {filteredArticles?.map((article) => (
              <div
                key={article.id}
                className="px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center hover:bg-[#fbfbfd] dark:hover:bg-[#1c1c1e] transition-colors"
                onDoubleClick={() => (window.location.href = `/admin/articles/${article.id}`)}
              >
                <div className="col-span-6 min-w-0 w-full">
                  <p className="text-[13px] font-medium text-[#1d1d1f] truncate">{article.title}</p>
                  <p className="text-[12px] text-[#86868b] mt-1">
                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''} · {article.viewCount ?? 0} views
                  </p>
                </div>
                <div className="col-span-2 text-[13px] text-[#6e6e73]">{article.category ? article.category.name : '—'}</div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                      article.status === 'PUBLISHED'
                        ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                        : article.status === 'DRAFT'
                          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                          : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#98989d] border-[#e8e8ed] dark:border-[#3a3a3c]'
                    }`}
                  >
                    {article.status ?? '—'}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 w-full md:w-auto">
                  <Link
                    to={`/admin/articles/${article.id}`}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#2c2c2e] border border-transparent hover:border-[#e8e8ed] dark:hover:border-[#3a3a3c] text-[#86868b] hover:text-[#0047FF] transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </Link>
                  <a
                    href={`/article/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#2c2c2e] border border-transparent hover:border-[#e8e8ed] dark:hover:border-[#3a3a3c] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                    title="View"
                  >
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-[#86868b] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {articlesData && articlesData.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8e8ed] dark:border-[#2c2c2e] bg-[#fbfbfd] dark:bg-[#111113]">
            <p className="text-[12px] text-[#86868b]">
              {page * 10 + 1}–{Math.min((page + 1) * 10, articlesData.total)} of {articlesData.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e8e8ed] text-[12px] font-medium text-[#1d1d1f] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f7]"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-[12px] text-[#86868b] px-2">
                {page + 1} / {articlesData.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= articlesData.totalPages - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#e8e8ed] text-[12px] font-medium text-[#1d1d1f] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f5f5f7]"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
