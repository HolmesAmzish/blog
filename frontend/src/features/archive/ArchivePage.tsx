/**
 * Archive Page
 * ECharts tree visualization of blog structure
 * Root -> Categories -> Articles
 */
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useCategoryTree } from '../../hooks/useCategories';
import { useArticles } from '../../hooks/useArticles';
import type { ArchiveTreeNode, CategoryDTO, ArticleListItem } from '../../types';
import { useTranslation } from '../../context/TranslationContext';

/**
 * Recursively build tree nodes from CategoryDTO
 */
const buildCategoryNodes = (categories: CategoryDTO[], articles: ArticleListItem[]): ArchiveTreeNode[] => {
  const nodes: ArchiveTreeNode[] = [];

  categories.forEach((category) => {
    const categoryNode: ArchiveTreeNode = {
      name: category.name,
      children: [],
    };

    // Find articles in this category
    if (category.id) {
      const categoryArticles = articles.filter(
        (article) => article.category?.id === category.id
      );

      categoryArticles.forEach((article) => {
        categoryNode.children?.push({
          name: article.title,
          value: article.viewCount ?? 0,
          article: article,
        });
      });
    }

    // Recursively build children nodes
    if (category.children && category.children.length > 0) {
      categoryNode.children?.push(...buildCategoryNodes(category.children, articles));
    }

    // Always add node if it has children (categories or articles)
    // Or if it has articles directly
    if (categoryNode.children && categoryNode.children.length > 0) {
      nodes.push(categoryNode);
    } else if (category.id) {
      // Add category even if no articles, but only if it has no children
      // Actually, we want to show ALL categories, so add it
      nodes.push(categoryNode);
    }
  });

  return nodes;
};

/**
 * Transform category and article data to ECharts tree format
 */
const buildTreeData = (categoryTree: CategoryDTO | undefined, articles: ArticleDTO[]): ArchiveTreeNode => {
  const root: ArchiveTreeNode = {
    name: 'ARORMS.BLOG',
    children: [],
  };

  if (!categoryTree || !categoryTree.children) return root;

  // Build nodes from root categories
  root.children = buildCategoryNodes(categoryTree.children, articles);

  // Add uncategorized articles
  const uncategorizedArticles = articles.filter(
    (article) => !article.category
  );

  if (uncategorizedArticles.length > 0) {
    const uncategorizedNode: ArchiveTreeNode = {
      name: 'UNCATEGORIZED',
      children: uncategorizedArticles.map((article) => ({
        name: article.title,
        value: article.viewCount,
        article: article,
      })),
    };
    root.children.push(uncategorizedNode);
  }

  return root;
};

/**
 * ArchivePage - ECharts tree visualization
 */
export const ArchivePage: React.FC = () => {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { data: categoryTree, isLoading: categoriesLoading } = useCategoryTree();
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    page: 0,
    size: 1000, // Get all articles
  });

  const articles = articlesData?.content || [];

  useEffect(() => {
    if (!chartRef.current || categoriesLoading || articlesLoading) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    const treeData = buildTreeData(categoryTree, articles);

    // Type-ignored option for ECharts compatibility
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 0.5,
        textStyle: {
          color: '#000',
          fontFamily: 'monospace',
          fontSize: 11,
        },
        formatter: (params: any) => {
          const data = params.data;
          if (!data) return '';
          if (data.article) {
            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
                <div style="color: #666;">Views: ${data.value}</div>
              </div>
            `;
          }
          return data.name;
        },
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          top: '5%',
          left: '10%',
          bottom: '5%',
          right: '20%',
          symbolSize: 8,
          symbol: 'circle',
          itemStyle: {
            color: '#000',
            borderColor: '#0047FF',
            borderWidth: 1,
          },
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#000',
            formatter: (params: any) => {
              const data = params.data;
              if (!data) return '';
              return data.article
                ? `{article|${data.name}}`
                : `{category|${data.name}}`;
            },
            rich: {
              category: {
                fontWeight: 'bold',
                color: '#000',
              },
              article: {
                color: '#666',
              },
            },
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
            itemStyle: {
              color: '#0047FF',
            },
          },
          emphasis: {
            focus: 'descendant',
            itemStyle: {
              color: '#0047FF',
              borderColor: '#000',
              borderWidth: 2,
            },
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
          expandAndCollapse: true,
          initialTreeDepth: -1,
          lineStyle: {
            color: '#e5e7eb',
            width: 1,
          },
        },
      ],
    } as any;

    chartInstance.current.setOption(option as any);

    // Handle click events
    chartInstance.current.on('click', (params: any) => {
      const data = params.data;
      if (!data) return;
      if (data.article) {
        window.location.href = `/article/${data.article.slug}`;
      }
    });

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [categoryTree, articles, categoriesLoading, articlesLoading]);

  const isLoading = categoriesLoading || articlesLoading;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 pb-6 border-b-[0.5px] border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              //
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              {t('archive.archive')}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {t('archive.archive')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 font-mono">
            {t('home.heroDescription')}
          </p>
        </div>

        {/* Chart container */}
        <div className="border-[0.5px] border-gray-200 bg-white">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0047FF] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[11px] font-mono text-gray-500">
                  {t('archive.archive')}...
                </p>
              </div>
            </div>
          ) : (
            <div
              ref={chartRef}
              className="w-full h-[600px]"
              style={{ minHeight: '600px' }}
            />
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-black border border-[#0047FF]" />
            <span>{t('articleDetail.category')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0047FF]" />
            <span>{t('home.latestArticles')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
