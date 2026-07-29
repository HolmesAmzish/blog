import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ECharts } from 'echarts';
import { useCategoryTree } from '../../hooks/useCategories';
import { useArticles } from '../../hooks/useArticles';
import type { ArchiveTreeNode, CategoryTreeNode, ArticleListItem } from '@blog/types';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const buildCategoryNodes = (categories: CategoryTreeNode[], articles: ArticleListItem[]): ArchiveTreeNode[] =>
  categories.map(category => {
    const node: ArchiveTreeNode = { name: category.name, children: [] };
    const children = node.children!;
    const categoryArticles = articles.filter(a => a.category?.id === category.id);
    categoryArticles.forEach(a => children.push({ name: a.title, value: a.viewCount ?? 0, article: a }));
    if (category.children?.length) children.push(...buildCategoryNodes(category.children, articles));
    return children.length ? node : { ...node };
  }).filter(n => n.children?.length);

const buildTreeData = (categoryTree: CategoryTreeNode | undefined, articles: ArticleListItem[], uncategorizedLabel: string): ArchiveTreeNode => {
  const root: ArchiveTreeNode = { name: 'ARORMS.BLOG', children: [] };
  if (!categoryTree?.children) return root;
  root.children = buildCategoryNodes(categoryTree.children, articles);
  const uncategorized = articles.filter(a => !a.category);
  if (uncategorized.length) root.children.push({ name: uncategorizedLabel, children: uncategorized.map(a => ({ name: a.title, value: a.viewCount ?? 0, article: a })) });
  return root;
};

export const ArchivePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { resolved } = useTheme();
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  const { data: categoryTree, isLoading: catLoading } = useCategoryTree(language);
  const { data: articlesData, isLoading: artLoading } = useArticles({ page: 0, size: 1000, language });
  const isLoading = catLoading || artLoading;
  const articles = articlesData?.content || [];

  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    let disposed = false;

    import('echarts').then(echarts => {
      if (disposed || !chartRef.current) return;
      chartInstance.current = echarts.init(chartRef.current);
      const treeData = buildTreeData(categoryTree, articles, t('archive.uncategorized'));
      const isDark = resolved === 'dark';
      const textColor = isDark ? '#fff' : '#000';
      const lineColor = isDark ? '#2d2d2d' : '#e5e7eb';

      chartInstance.current.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', triggerOn: 'mousemove', backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', borderColor: lineColor, borderWidth: 0.5, textStyle: { color: textColor, fontFamily: 'monospace', fontSize: 11 } },
        series: [{
          type: 'tree', data: [treeData], top: '5%', left: '10%', bottom: '5%', right: '20%',
          symbolSize: 8, symbol: 'circle',
          itemStyle: { color: isDark ? '#fff' : '#000', borderColor: '#0047FF', borderWidth: 1 },
          label: { position: 'left', verticalAlign: 'middle', align: 'right', fontFamily: 'monospace', fontSize: 11, color: textColor },
          leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' }, itemStyle: { color: '#0047FF' } },
          expandAndCollapse: true, initialTreeDepth: -1,
          lineStyle: { color: lineColor, width: 1 },
        }],
      } as any);

      chartInstance.current.on('click', (params: any) => { if (params.data?.article) navigate(`/article/${params.data.article.slug}`); });
      const onResize = () => chartInstance.current?.resize();
      window.addEventListener('resize', onResize);
      return () => { window.removeEventListener('resize', onResize); };
    });

    return () => { disposed = true; chartInstance.current?.dispose(); chartInstance.current = null; };
  }, [categoryTree, articles, isLoading, t, navigate, resolved]);

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
          ) : (
            <div ref={chartRef} className="w-full h-[600px]" style={{ minHeight: '600px' }} key={language} />
          )}
        </div>
        <div className="mt-6 flex items-center gap-6 text-[10px] font-mono text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-black dark:bg-white border border-[#0047FF]" /> Category</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0047FF]" /> Article</span>
        </div>
      </div>
    </div>
  );
};