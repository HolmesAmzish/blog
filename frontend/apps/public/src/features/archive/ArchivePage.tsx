import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ECharts } from 'echarts';
import { useCategoryTree } from '../../hooks/useCategories';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const ArchivePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { resolved } = useTheme();
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  const { data: categoryTree, isLoading: catLoading } = useCategoryTree(language);
  const isLoading = catLoading;

  useEffect(() => {
    if (!chartRef.current || isLoading) return;
    let disposed = false;

    import('echarts').then(echarts => {
      if (disposed || !chartRef.current) return;
      chartInstance.current = echarts.init(chartRef.current);
      const treeData = categoryTree ? [categoryTree] : [];
      const isDark = resolved === 'dark';
      const textColor = isDark ? '#fff' : '#000';
      const lineColor = isDark ? '#2d2d2d' : '#e5e7eb';

      chartInstance.current.setOption({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item', triggerOn: 'mousemove', backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)', borderColor: lineColor, borderWidth: 0.5, textStyle: { color: textColor, fontFamily: 'monospace', fontSize: 11 } },
        series: [{
          type: 'tree', data: treeData, top: '5%', left: '10%', bottom: '5%', right: '20%',
          symbolSize: 8, symbol: 'circle',
          itemStyle: { color: isDark ? '#fff' : '#000', borderColor: '#0047FF', borderWidth: 1 },
          label: { position: 'left', verticalAlign: 'middle', align: 'right', fontFamily: 'monospace', fontSize: 11, color: textColor },
          leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' }, itemStyle: { color: '#0047FF' } },
          expandAndCollapse: true, initialTreeDepth: -1,
          lineStyle: { color: lineColor, width: 1 },
        }],
      } as any);

      // Click category node -> jump to /articles?categoryId=<id>
      // Root node id === -1 (synthetic ARORMS.BLOG) should be ignored
      chartInstance.current.on('click', (params: any) => {
        const node = params?.data as { id?: number; name?: string } | undefined;
        const id = node?.id;
        if (id === undefined || id === null || id === -1) return;
        navigate(`/articles?categoryId=${id}`);
      });

      const onResize = () => chartInstance.current?.resize();
      window.addEventListener('resize', onResize);
      return () => { window.removeEventListener('resize', onResize); };
    });

    return () => { disposed = true; chartInstance.current?.off('click'); chartInstance.current?.dispose(); chartInstance.current = null; };
  }, [categoryTree, isLoading, t, resolved, navigate]);

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
        </div>
      </div>
    </div>
  );
};
