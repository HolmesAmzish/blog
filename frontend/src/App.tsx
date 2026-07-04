/**
 * App Component
 * Main application with routing and loading screen
 */
import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { TranslationProvider } from './context/TranslationContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HomePage } from './features/home/HomePage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Lazy load pages to reduce initial bundle size
const ArticleListPage = lazy(() => import('./features/article/ArticleListPage').then(m => ({ default: m.ArticleListPage })));
const ArticleDetailPage = lazy(() => import('./features/article/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const ArchivePage = lazy(() => import('./features/archive/ArchivePage').then(m => ({ default: m.ArchivePage })));
const AboutPage = lazy(() => import('./features/about/AboutPage').then(m => ({ default: m.AboutPage })));

// Admin pages — rarely accessed, always lazy loaded
const AdminLoginPage = lazy(() => import('./features/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./features/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminArticlesPage = lazy(() => import('./features/admin/AdminArticlesPage').then(m => ({ default: m.AdminArticlesPage })));
const AdminArticleEditPage = lazy(() => import('./features/admin/AdminArticleEditPage').then(m => ({ default: m.AdminArticleEditPage })));
const AdminCategoriesPage = lazy(() => import('./features/admin/AdminCategoriesPage').then(m => ({ default: m.AdminCategoriesPage })));
const AdminTagsPage = lazy(() => import('./features/admin/AdminTagsPage').then(m => ({ default: m.AdminTagsPage })));
const AdminUsersPage = lazy(() => import('./features/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminPicturesPage = lazy(() => import('./features/admin/AdminPicturesPage').then(m => ({ default: m.AdminPicturesPage })));

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Main App Component
 */
function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TranslationProvider>
          <BrowserRouter>
            {/* Loading Screen */}
            {!loadingComplete && (
              <LoadingScreen
                onComplete={() => setLoadingComplete(true)}
                duration={2000}
              />
            )}

            {/* Main Layout */}
            <div className="min-h-screen flex flex-col bg-white dark:bg-black">
              <Header />
              <main className="flex-1">
                <Suspense fallback={
                  <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Loading</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/articles" element={<ArticleListPage />} />
                    <Route path="/article/:slug" element={<ArticleDetailPage />} />
                    <Route path="/archive" element={<ArchivePage />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/articles"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminArticlesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/articles/new"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminArticleEditPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/articles/:id"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminArticleEditPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/categories"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminCategoriesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/tags"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminTagsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminUsersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/pictures"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPicturesPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/about"
                      element={<AboutPage />}
                    />
                    <Route
                      path="*"
                      element={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">404</h1>
                            <p className="text-gray-600 dark:text-gray-300 font-mono mb-6">
                              PAGE NOT FOUND
                            </p>
                            <a
                              href="/"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black text-[11px] font-mono uppercase tracking-wider hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors"
                            >
                              GO HOME
                            </a>
                          </div>
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TranslationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
