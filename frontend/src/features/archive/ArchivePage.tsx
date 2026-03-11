/**
 * Archive Page
 * ECharts tree visualization of blog structure
 * Root -> Categories -> Articles
 */
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useCategoryTree } from '../../hooks/useCategories';
import { useArticles } from '../../hooks/useArticles';
import type { ArchiveTreeNode, CategoryDTO, ArticleDTO } from '../../types';

/**
 * Transform category and article data to ECharts tree format
 */
const buildTreeData = (categories: CategoryDTO[] | undefined, articles: ArticleDTO[]): ArchiveTreeNode => {
  const root: ArchiveTreeNode = {
    name: 'ARORMS.BLOG',
    children: [],
  };

  if (!categories) return root;

  // Add categories as first level
  categories.forEach((category) => {
    const categoryNode: ArchiveTreeNode = {
      name: category.name,
      children: [],
    };

    // Find articles in this category
    const categoryArticles = articles.filter(
      (article) => article.categoryId === category.id
    );

    // Add articles as children
    categoryArticles.forEach((article) => {
      categoryNode.children?.push({
        name: article.title,
        value: article.viewCount,
        article: article,
      });
    });

    // Only add category if it has articles
    if (category.children && category.children.length > 0) {
      // Recursively add subcategories
      category.children.forEach((child) => {
        const childNode: ArchiveTreeNode = {
          name: child.name,
          children: [],
        };

        const childArticles = articles.filter(
          (article) => article.categoryId === child.id
        );

        childArticles.forEach((article) => {
          childNode.children?.push({
            name: article.title,
            value: article.viewCount,
            article: article,
          });
        });

        if (childNode.children && childNode.children.length > 0) {
          categoryNode.children?.push(childNode);
        }
      });
    }

    if (categoryNode.children && categoryNode.children.length > 0) {
      root.children?.push(categoryNode);
    }
  });

  // Add uncategorized articles
  const uncategorizedArticles = articles.filter(
    (article) => !article.categoryId
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
    root.children?.push(uncategorizedNode);
  }

  return root;
};

/**
 * ArchivePage - ECharts tree visualization
 */
export const ArchivePage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useCategoryTree();
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    page: 0,
    size: 1000, // Get all articles
  });

  useEffect(() => {
    if (!chartRef.current || categoriesLoading || articlesLoading) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    const treeData = buildTreeData(categories || [], articlesData?.content || []);

    const option: echarts.EChartsOption = {
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
        formatter: (params: unknown) => {
          const data = params.data as ArchiveTreeNode;
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
            formatter: (params: unknown) => {
              const data = params.data as ArchiveTreeNode;
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
          lineStyle: {
            color: '#e5e7eb',
            width: 1,
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle click events
    chartInstance.current.on('click', (params: unknown) => {
      const data = params.data as ArchiveTreeNode;
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
  }, [categories, articlesData, categoriesLoading, articlesLoading]);

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
              TREE.STRUCTURE
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            ARCHIVE
          </h1>
          <p className="mt-2 text-sm text-gray-600 font-mono">
            Interactive visualization of all articles organized by category.
            Click on any article to read.
          </p>
        </div>

        {/* Chart container */}
        <div className="border-[0.5px] border-gray-200 bg-white">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0047FF] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[11px] font-mono text-gray-500">
                  LOADING ARCHIVE DATA...
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
            <span>CATEGORY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0047FF]" />
            <span>ARTICLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
