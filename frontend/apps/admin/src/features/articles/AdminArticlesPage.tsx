import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useArticles, ARTICLES_QUERY} from '../../hooks/useArticles';
import {useCategories} from '../../hooks/useCategories';
import {Plus, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight} from 'lucide-react';
import {deleteArticle} from '../../api/article';

export function AdminArticlesPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<number | ''>('');

    const {data: articlesData, isLoading} = useArticles({page, size: 10, isAdmin: true});
    const {data: categories} = useCategories();

    const filteredArticles = articlesData?.content.filter((article) => {
        const matchesSearch = search === '' || article.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === '' || article.category?.id === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const deleteMutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => queryClient.invalidateQueries({queryKey: [ARTICLES_QUERY]}),
    });

    const handleDelete = (id: number) => {
        if (confirm('Delete this article? This cannot be undone.')) deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Articles</h1>
                    <p className="text-[13px] text-muted-foreground mt-1">Create, edit and publish your content.</p>
                </div>
                <Link
                    to="/admin/articles/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-[13px] font-medium rounded-full hover:bg-primary transition-colors shadow-sm"
                >
                    <Plus size={14}/>
                    New Article
                </Link>
            </div>

            <div className="admin-card p-4 flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14}/>
                    <input
                        type="text"
                        placeholder="Search by title…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted border border-transparent focus:bg-card focus:border-border focus:outline-none text-[13px] placeholder:text-muted-foreground"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value ? Number(e.target.value) : '')}
                    className="px-3 py-2.5 rounded-xl bg-muted border border-transparent text-[13px] text-foreground focus:bg-card focus:border-border focus:outline-none min-w-[180px]"
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
                        className="px-4 py-2.5 rounded-xl bg-card border border-border text-[13px] text-foreground hover:bg-muted transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="admin-card overflow-hidden">
                <div
                    className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted dark:bg-muted border-b border-border text-[11px] font-medium tracking-wide text-muted-foreground">
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-[13px] text-muted-foreground">Loading articles…</div>
                ) : filteredArticles?.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-[13px] text-muted-foreground">No articles found.</p>
                        <Link to="/admin/articles/new"
                              className="inline-flex mt-3 text-[13px] font-medium text-primary hover:underline">
                            Create the first one
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredArticles?.map((article) => (
                            <div
                                key={article.id}
                                className="px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center hover:bg-muted transition-colors"
                                onDoubleClick={() => (window.location.href = `/admin/articles/${article.id}`)}
                            >
                                <div className="col-span-6 min-w-0 w-full">
                                    <p className="text-[13px] font-medium text-foreground truncate">{article.title}</p>
                                    <p className="text-[12px] text-muted-foreground mt-1">
                                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''} · {article.viewCount ?? 0} views
                                    </p>
                                </div>
                                <div
                                    className="col-span-2 text-[13px] text-muted-foreground">{article.category ? article.category.name : '—'}</div>
                                <div className="col-span-2">
 <span
     className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium border ${
         article.status === 'PUBLISHED'
             ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
             : article.status === 'DRAFT'
                 ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                 : 'bg-muted text-muted-foreground border-border'
     }`}
 >
 {article.status ?? '—'}
 </span>
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-1 w-full md:w-auto">
                                    <Link
                                        to={`/admin/articles/${article.id}`}
                                        className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border text-muted-foreground hover:text-primary transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={14}/>
                                    </Link>
                                    <a
                                        href={`/article/${article.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg hover:bg-card border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-colors"
                                        title="View"
                                    >
                                        <Eye size={14}/>
                                    </a>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {articlesData && articlesData.totalPages > 1 && (
                    <div
                        className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted dark:bg-muted">
                        <p className="text-[12px] text-muted-foreground">
                            {page * 10 + 1}–{Math.min((page + 1) * 10, articlesData.total)} of {articlesData.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                            >
                                <ChevronLeft size={14}/> Prev
                            </button>
                            <span className="text-[12px] text-muted-foreground px-2">
 {page + 1} / {articlesData.totalPages}
 </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= articlesData.totalPages - 1}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
                            >
                                Next <ChevronRight size={14}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
