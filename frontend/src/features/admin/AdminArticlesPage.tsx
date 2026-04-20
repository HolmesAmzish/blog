/**
 * Admin Articles Page
 * Article management for admin panel
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import type { ArticleStatus } from '../../types';

/**
 * Admin Articles Page Component
 */
export function AdminArticlesPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

  const { data: articlesData, isLoading } = useArticles({ page, size: 10, isAdmin: true });
  const { data: categories } = useCategories();

  const filteredArticles = articlesData?.content.filter((article) => {
    const matchesSearch = search === '' ||
      article.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' || article.category?.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              ARTICLES
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage your blog articles
            </p>
          </div>
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Article
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#0047FF]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | '')}
              className="px-4 py-2 border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#0047FF] bg-white"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2 border border-gray-200 text-sm font-mono focus:outline-none focus:border-[#0047FF] bg-white"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id!}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
              className="px-4 py-2 border border-gray-200 text-sm font-mono text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
            <div className="col-span-5 text-xs font-mono uppercase tracking-wider text-gray-500">
              Title
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500">
              Category
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500">
              Status
            </div>
            <div className="col-span-1 text-xs font-mono uppercase tracking-wider text-gray-500">
              Views
            </div>
            <div className="col-span-2 text-xs font-mono uppercase tracking-wider text-gray-500 text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              Loading articles...
            </div>
          ) : filteredArticles?.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-mono text-sm">
              No articles found
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredArticles?.map((article) => (
                <div key={article.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                  <div className="col-span-5">
                    <p className="text-sm font-mono text-black font-medium">
                      {article.title}
                    </p>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="col-span-2 text-sm font-mono text-gray-600">
                    {article.categoryName || '—'}
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs font-mono uppercase ${
                      article.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-700'
                        : article.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-sm font-mono text-gray-600">
                    {article.viewCount}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Link
                      to={`/article/${article.slug}`}
                      className="p-2 text-gray-400 hover:text-black transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/admin/articles/${article.id}`}
                      className="p-2 text-gray-400 hover:text-[#0047FF] transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {articlesData && articlesData.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <p className="text-sm font-mono text-gray-500">
                Showing {page * 10 + 1} - {Math.min((page + 1) * 10, articlesData.totalElements)} of {articlesData.totalElements}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 text-sm font-mono border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= articlesData.totalPages - 1}
                  className="px-3 py-1 text-sm font-mono border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}