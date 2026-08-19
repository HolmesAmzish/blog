import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Users,
  Image,
  LogOut,
  ArrowLeft,
  Search,
  Menu,
  X,
  Command,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.ts';
import { useTheme, type Theme } from '@/context/ThemeContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navGroups = [
  {
    title: 'Overview',
    items: [{ path: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Content',
    items: [
      { path: '/admin/articles', label: 'Articles', icon: FileText },
      { path: '/admin/categories', label: 'Categories', icon: FolderTree },
      { path: '/admin/tags', label: 'Tags', icon: Tags },
      { path: '/admin/pictures', label: 'Pictures', icon: Image },
    ],
  },
  {
    title: 'System',
    items: [{ path: '/admin/users', label: 'Users', icon: Users }],
  },
];

function NavLink({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] leading-none transition-all ${
        active
          ? 'bg-[#0047FF] text-white shadow-sm shadow-blue-200 dark:shadow-none'
          : 'text-[#6e6e73] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e]'
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
      <span className={active ? 'font-medium' : 'font-normal'}>{label}</span>
    </Link>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const opts: { v: Theme; icon: ReactNode; label: string }[] = [
    { v: 'system', icon: <Monitor size={12} />, label: 'Auto' },
    { v: 'light', icon: <Sun size={12} />, label: 'Light' },
    { v: 'dark', icon: <Moon size={12} />, label: 'Dark' },
  ];
  return (
    <div className="flex items-center p-1 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#e8e8ed] dark:border-[#2c2c2e]">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => setTheme(o.v)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            theme === o.v
              ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm border border-[#e8e8ed] dark:border-[#3a3a3c]'
              : 'text-[#86868b] dark:text-[#98989d] hover:text-[#1d1d1f] dark:hover:text-white'
          }`}
          title={o.label}
        >
          {o.icon}
          <span className="hidden xl:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const currentLabel =
    navGroups.flatMap((g) => g.items).find((i) => isActive(i.path))?.label ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black flex">
      {mobileOpen && (
        <button
          aria-label="close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen w-[272px] bg-white dark:bg-[#0a0a0a] border-r border-[#e8e8ed] dark:border-[#1c1c1e] flex flex-col shrink-0 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-[64px] px-6 flex items-center justify-between shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black text-[11px] font-bold tracking-tight">A</span>
            </div>
            <div className="leading-none">
              <div className="text-[13px] font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                ARORMS<span className="text-[#0047FF]">.</span>
              </div>
              <div className="text-[11px] text-[#86868b] dark:text-[#98989d] tracking-wide font-medium -mt-0.5">ADMIN</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] text-[#86868b]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-transparent dark:border-[#2c2c2e] hover:border-[#e8e8ed] dark:hover:border-[#2c2c2e] transition-colors group cursor-pointer">
            <Search size={14} className="text-[#86868b] dark:text-[#98989d] group-hover:text-[#6e6e73] dark:group-hover:text-white" />
            <span className="flex-1 text-[13px] text-[#86868b] dark:text-[#98989d]">Search…</span>
            <span className="hidden xl:flex items-center gap-1 text-[11px] text-[#a1a1a6] dark:text-[#6e6e73] border border-[#e8e8ed] dark:border-[#2c2c2e] bg-white dark:bg-[#2c2c2e] px-1.5 py-0.5 rounded">
              <Command size={10} />K
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[11px] font-medium tracking-wide text-[#86868b] dark:text-[#6e6e73]">{group.title}</div>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      icon={item.icon}
                      label={item.label}
                      active={isActive(item.path)}
                      onClick={() => setMobileOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-[#f5f5f7] dark:border-[#1c1c1e] space-y-3">
          <div className="flex justify-center">
            <ThemeSwitcher />
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#6e6e73] dark:text-[#98989d] hover:bg-[#f5f5f7] dark:hover:bg-[#1c1c1e] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-[#e8e8ed]/60 dark:border-[#2c2c2e]">
            <div className="w-8 h-8 rounded-full bg-[#0a0a0a] dark:bg-white flex items-center justify-center text-white dark:text-black text-[12px] font-medium shrink-0">
              {(user?.username?.[0] ?? 'A').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-[#1d1d1f] dark:text-white truncate leading-none">
                {user?.username ?? 'Admin'}
              </div>
              <div className="text-[11px] text-[#86868b] dark:text-[#98989d] truncate">Administrator</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#2c2c2e] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-[56px] bg-[#f5f5f7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#e8e8ed]/60 dark:border-[#1c1c1e] flex items-center gap-4 px-4 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white dark:hover:bg-[#1c1c1e] border border-transparent hover:border-[#e8e8ed] dark:hover:border-[#2c2c2e] text-[#1d1d1f] dark:text-white"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-[#86868b] dark:text-[#98989d] hidden sm:inline">Admin</span>
            <span className="text-[#d2d2d7] dark:text-[#2c2c2e] hidden sm:inline">/</span>
            <span className="font-medium text-[#1d1d1f] dark:text-white">{currentLabel}</span>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
