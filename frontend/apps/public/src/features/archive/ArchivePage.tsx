import { useNavigate } from 'react-router-dom';
import { useCategoryTree } from '../../hooks/useCategories';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { CategoryTree } from '../../components/archive/CategoryTree';

export const ArchivePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { resolved } = useTheme();
  const navigate = useNavigate();

  const { data: categoryTree, isLoading } = useCategoryTree(language);

  const handleNodeClick = (id: number) => {
    navigate(`/articles?categoryId=${id}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b-[0.5px] border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{t('archive.archive')}</h1>
        </div>
        <div className="border-[0.5px] border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin mx-auto mb-4" />
            </div>
          ) : categoryTree ? (
            <CategoryTree
              data={categoryTree}
              isDark={resolved === 'dark'}
              onNodeClick={handleNodeClick}
            />
          ) : null}
        </div>
        <div className="mt-6 flex items-center gap-6 text-[10px] font-mono text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-black dark:bg-white border border-[#0047FF]" /> Category</span>
        </div>
      </div>
    </div>
  );
};
