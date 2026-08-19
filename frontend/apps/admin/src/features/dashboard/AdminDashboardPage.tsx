import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useUsers } from '../../hooks/useUsers';
import { FileText, FolderTree, Tags, Users, Eye, ArrowUpRight, TrendingUp, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#f5f5f7] border border-[#e8e8ed]/60 flex items-center justify-center text-[#1d1d1f]">
          <Icon size={16} />
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-full">
          <TrendingUp size={12} /> Stable
        </span>
      </div>
      <div className="text-[11px] tracking-wide font-medium text-[#86868b] mb-1">{title}</div>
      <div className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] leading-none">{value}</div>
      <div className="text-[12px] text-[#86868b] mt-2">{sub}</div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ page: 0, size: 100 });
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data: users } = useUsers();

  const totalArticles = articlesData?.total || 0;
  const publishedArticles = articlesData?.content.filter((a) => a.status === 'PUBLISHED').length || 0;
  const draftArticles = articlesData?.content.filter((a) => a.status === 'DRAFT').length || 0;
  const totalViews = articlesData?.content.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Dashboard</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Overview of your content. Stay focused.</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] transition-colors shadow-sm"
        >
          <PenLine size={14} />
          New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Articles" value={totalArticles} sub={`${publishedArticles} published · ${draftArticles} drafts`} icon={FileText} />
        <StatCard title="Categories" value={categories?.length || 0} sub="Organized" icon={FolderTree} />
        <StatCard title="Tags" value={tags?.length || 0} sub="For discovery" icon={Tags} />
        <StatCard title="Users" value={users?.length || 0} sub="Access & roles" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[13px] font-semibold text-[#1d1d1f]">Analytics</h2>
              <span className="text-[11px] text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-full">Last 30 days</span>
            </div>
            <div className="flex items-end gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#86868b] text-[11px] font-medium tracking-wide">
                  <Eye size={12} /> Total views
                </div>
                <div className="text-[32px] font-semibold tracking-tight text-[#1d1d1f] leading-none mt-2">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-[12px] text-[#86868b] mt-1">+12% vs last week</div>
              </div>
              <div className="flex-1 h-[64px] flex items-end gap-1.5 ml-4">
                {[18, 28, 22, 36, 30, 44, 38, 52, 40, 48, 56, 42].map((h, i) => (
                  <div key={i} className="flex-1 rounded-full bg-gradient-to-t from-[#0047FF]/15 to-[#0047FF]" style={{ height: h }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#f5f5f7]">
              <div className="rounded-xl bg-[#f5f5f7] p-3">
                <div className="text-[11px] text-[#86868b]">Published</div>
                <div className="text-[18px] font-semibold text-[#1d1d1f]">{publishedArticles}</div>
              </div>
              <div className="rounded-xl bg-[#f5f5f7] p-3">
                <div className="text-[11px] text-[#86868b]">Drafts</div>
                <div className="text-[18px] font-semibold text-amber-600">{draftArticles}</div>
              </div>
              <div className="rounded-xl bg-[#f5f5f7] p-3">
                <div className="text-[11px] text-[#86868b]">Archived</div>
                <div className="text-[18px] font-semibold text-[#6e6e73]">
                  {articlesData?.content.filter((a) => a.status === 'ARCHIVED').length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e8e8ed] dark:border-[#2c2c2e]">
              <h2 className="text-[13px] font-semibold text-[#1d1d1f]">Recent articles</h2>
              <Link to="/admin/articles" className="text-[12px] font-medium text-[#0047FF] hover:text-[#0036CC] inline-flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            {articlesLoading ? (
              <div className="p-8 text-center text-[13px] text-[#86868b]">Loading…</div>
            ) : (
              <div className="divide-y divide-[#e8e8ed] dark:divide-[#2c2c2e]">
                {articlesData?.content.slice(0, 5).map((article) => (
                  <div key={article.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#fbfbfd] dark:hover:bg-[#1c1c1e] transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-[#1d1d1f] truncate pr-4">{article.title}</p>
                      <p className="text-[12px] text-[#86868b] mt-1">
                        {article.category ? article.category.name : 'Uncategorized'} · {article.viewCount} views ·{' '}
                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                        article.status === 'PUBLISHED'
                          ? 'bg-green-50 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                          : article.status === 'DRAFT'
                            ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                            : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#98989d] border-[#e8e8ed] dark:border-[#3a3a3c]'
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                ))}
                {(!articlesData || articlesData.content.length === 0) && (
                  <div className="p-8 text-center text-[13px] text-[#86868b]">No articles yet. Create your first one.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="admin-card p-5">
            <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-3">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/admin/articles/new"
                className="rounded-xl border border-[#e8e8ed] p-4 hover:border-[#0047FF]/30 hover:bg-[#0047FF]/[0.03] transition-colors group"
              >
                <FileText size={18} className="text-[#1d1d1f] group-hover:text-[#0047FF]" />
                <div className="text-[13px] font-medium text-[#1d1d1f] mt-2">Write</div>
                <div className="text-[11px] text-[#86868b]">Markdown</div>
              </Link>
              <Link
                to="/admin/pictures"
                className="rounded-xl border border-[#e8e8ed] p-4 hover:border-[#0047FF]/30 hover:bg-[#0047FF]/[0.03] transition-colors group"
              >
                <Eye size={18} className="text-[#1d1d1f] group-hover:text-[#0047FF]" />
                <div className="text-[13px] font-medium text-[#1d1d1f] mt-2">Upload</div>
                <div className="text-[11px] text-[#86868b]">Images</div>
              </Link>
              <Link to="/admin/categories" className="rounded-xl border border-[#e8e8ed] p-4 hover:bg-[#f5f5f7] transition-colors">
                <FolderTree size={18} className="text-[#1d1d1f]" />
                <div className="text-[13px] font-medium text-[#1d1d1f] mt-2">Categories</div>
                <div className="text-[11px] text-[#86868b]">{categories?.length ?? 0} items</div>
              </Link>
              <Link to="/admin/tags" className="rounded-xl border border-[#e8e8ed] p-4 hover:bg-[#f5f5f7] transition-colors">
                <Tags size={18} className="text-[#1d1d1f]" />
                <div className="text-[13px] font-medium text-[#1d1d1f] mt-2">Tags</div>
                <div className="text-[11px] text-[#86868b]">{tags?.length ?? 0} items</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
