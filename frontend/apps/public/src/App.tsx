/**
 * App Component — public routes only
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

const ArticleListPage = lazy(() => import('./features/article/ArticleListPage').then(m => ({ default: m.ArticleListPage })));
const ArticleDetailPage = lazy(() => import('./features/article/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const ArchivePage = lazy(() => import('./features/archive/ArchivePage').then(m => ({ default: m.ArchivePage })));
const AboutPage = lazy(() => import('./features/about/AboutPage').then(m => ({ default: m.AboutPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TranslationProvider>
          <BrowserRouter>
            {!loadingComplete && (
              <LoadingScreen onComplete={() => setLoadingComplete(true)} duration={2000} />
            )}
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
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">404</h1>
                          <p className="text-gray-600 dark:text-gray-300 font-mono mb-6">PAGE NOT FOUND</p>
                          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black text-[11px] font-mono uppercase tracking-wider hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors">GO HOME</a>
                        </div>
                      </div>
                    } />
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
