/**
 * Admin Dashboard Page
 * Overview page with statistics and quick actions
 */
import { useArticles } from '../../hooks/useArticles';
import { useCategories } from '../../hooks/useCategories';
import { useTags } from '../../hooks/useTags';
import { useUsers } from '../../hooks/useUsers';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { FileText, FolderTree, Tags, Users, Eye, TrendingUp } from 'lucide-react';

/**
 * Stat Card Component
 */
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ComponentType<{ size: number }>;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-black font-mono">
            {value}
          </p>
        </div>
        <div className={`p-3 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

/**
 * Admin Dashboard Page Component
 */
export function AdminDashboardPage() {
  const { data: articlesData, isLoading: articlesLoading } = useArticles({ page: 0, size: 100 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: users, isLoading: usersLoading } = useUsers();

  const totalArticles = articlesData?.totalElements || 0;
  const publishedArticles = articlesData?.content.filter(a => a.status === 'PUBLISHED').length || 0;
  const totalViews = articlesData?.content.reduce((sum, a) => sum + a.viewCount, 0) || 0;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
            DASHBOARD
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-1">
            Overview of your blog statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Articles"
            value={totalArticles}
            icon={FileText}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Categories"
            value={categories?.length || 0}
            icon={FolderTree}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Tags"
            value={tags?.length || 0}
            icon={Tags}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Users"
            value={users?.length || 0}
            icon={Users}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Article Stats */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-4">
              Article Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-mono text-gray-600">Published</span>
                <span className="text-sm font-mono font-bold text-green-600">{publishedArticles}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-mono text-gray-600">Drafts</span>
                <span className="text-sm font-mono font-bold text-yellow-600">
                  {articlesData?.content.filter(a => a.status === 'DRAFT').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-mono text-gray-600">Archived</span>
                <span className="text-sm font-mono font-bold text-gray-600">
                  {articlesData?.content.filter(a => a.status === 'ARCHIVED').length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* View Stats */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-4">
              View Statistics
            </h2>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[#0047FF]/10">
                <Eye className="text-[#0047FF]" size={32} />
              </div>
              <div>
                <p className="text-3xl font-bold font-mono text-black">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-sm font-mono text-gray-500">Total Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-500">
              Recent Articles
            </h2>
          </div>
          {articlesLoading ? (
            <div className="p-6 text-center text-gray-500 font-mono text-sm">
              Loading...
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {articlesData?.content.slice(0, 5).map((article) => (
                <div key={article.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-mono text-black font-medium">
                      {article.title}
                    </p>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      {article.categoryName || 'Uncategorized'} • {article.viewCount} views
                    </p>
                  </div>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}