import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { TranslationProvider } from './context/TranslationContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLoginPage } from './features/login/AdminLoginPage';
import { AdminDashboardPage } from './features/admin/dashboard/AdminDashboardPage';
import { AdminArticlesPage } from './features/admin/articles/AdminArticlesPage';
import { AdminArticleEditPage } from './features/admin/articles/AdminArticleEditPage';
import { AdminCategoriesPage } from './features/admin/categories/AdminCategoriesPage';
import { AdminTagsPage } from './features/admin/tags/AdminTagsPage';
import { AdminUsersPage } from './features/admin/users/AdminUsersPage';
import { AdminPicturesPage } from './features/admin/pictures/AdminPicturesPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TranslationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AdminLoginPage />} />
              <Route path="/callback" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={<ProtectedRoute><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/articles"
                element={<ProtectedRoute><AdminLayout><AdminArticlesPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/articles/new"
                element={<ProtectedRoute><AdminLayout><AdminArticleEditPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/articles/:id"
                element={<ProtectedRoute><AdminLayout><AdminArticleEditPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/categories"
                element={<ProtectedRoute><AdminLayout><AdminCategoriesPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/tags"
                element={<ProtectedRoute><AdminLayout><AdminTagsPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/users"
                element={<ProtectedRoute><AdminLayout><AdminUsersPage /></AdminLayout></ProtectedRoute>}
              />
              <Route
                path="/admin/pictures"
                element={<ProtectedRoute><AdminLayout><AdminPicturesPage /></AdminLayout></ProtectedRoute>}
              />
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </BrowserRouter>
        </TranslationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;