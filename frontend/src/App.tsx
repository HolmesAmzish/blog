/**
 * App Component
 * Main application with routing and loading screen
 */
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HomePage } from './features/home/HomePage';
import { ArticleListPage } from './features/article/ArticleListPage';
import { ArticleDetailPage } from './features/article/ArticleDetailPage';
import { ArchivePage } from './features/archive/ArchivePage';
import { AdminLoginPage } from './features/admin/AdminLoginPage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { AdminArticlesPage } from './features/admin/AdminArticlesPage';
import { AdminArticleEditPage } from './features/admin/AdminArticleEditPage';
import { AdminCategoriesPage } from './features/admin/AdminCategoriesPage';
import { AdminTagsPage } from './features/admin/AdminTagsPage';
import { AdminUsersPage } from './features/admin/AdminUsersPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

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
      <BrowserRouter>
        {/* Loading Screen */}
        {!loadingComplete && (
          <LoadingScreen
            onComplete={() => setLoadingComplete(true)}
            duration={2000}
          />
        )}

        {/* Main Layout */}
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
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
                path="/about"
                element={
                  <div className="min-h-screen py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="mb-8 pb-6 border-b-[0.5px] border-gray-200">
                        <h1 className="text-3xl font-bold tracking-tight text-black">
                          ABOUT
                        </h1>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          This is a technical blog built with React, TypeScript,
                          Tailwind CSS, and Spring Boot. It features a clean,
                          minimal design inspired by technical documentation and
                          modern web aesthetics.
                        </p>
                      </div>
                    </div>
                  </div>
                }
              />
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-black mb-4">404</h1>
                      <p className="text-gray-600 font-mono mb-6">
                        PAGE NOT FOUND
                      </p>
                      <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[#0047FF] transition-colors"
                      >
                        GO HOME
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
