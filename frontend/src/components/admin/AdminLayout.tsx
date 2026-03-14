/**
 * Admin Layout Component
 * Layout wrapper for admin pages with sidebar navigation
 */
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Tags, 
  Users, 
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Navigation items for admin sidebar
 */
const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/articles', label: 'Articles', icon: FileText },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  { path: '/admin/tags', label: 'Tags', icon: Tags },
  { path: '/admin/users', label: 'Users', icon: Users },
];

/**
 * Admin Layout Component
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/admin" className="text-xl font-bold tracking-tight font-mono">
            ARORMS<span className="text-[#0047FF]">_</span>ADMIN
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-[#0047FF] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to site */}
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-t border-gray-800">
          <div className="px-4 py-2 text-xs font-mono text-gray-500 uppercase">
            {user?.username}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}