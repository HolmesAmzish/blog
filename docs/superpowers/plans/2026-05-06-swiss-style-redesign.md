# Swiss Style Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `HomePage.tsx` and `ArticleCard.tsx` to adopt Swiss Style / International Typographic Style with a 12-column grid, Mondrian decorative blocks, and de-carded article index rows.

**Architecture:** Replace card-based article previews with horizontal index entries using hairline borders. Restructure homepage into an asymmetric 12-column grid with a typographic Hero (left 8 cols) and a Mondrian color-block module (right 4 cols). Integrate stats as a compact ruler directly within the Hero.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, TanStack Query (data fetching preserved), Vite.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `frontend/src/components/ui/ArticleCard.tsx` | Modify | De-card article preview into a horizontal index row with metadata, large title, summary, and hover effects. |
| `frontend/src/index.css` | Modify | Add optional `.swiss-grid-guide` debug utility (already has `::selection` blue). |
| `frontend/src/features/home/HomePage.tsx` | Modify | Full layout: 12-col grid Hero, Mondrian block, integrated stats ruler, 4-article list with new ArticleCard. |

---

### Task 1: Rewrite ArticleCard.tsx (De-carded Index Row)

**Files:**
- Modify: `frontend/src/components/ui/ArticleCard.tsx`

**Context:** The current `ArticleCard` is a bordered card with a top accent line, internal padding, and shadow on hover. We replace it with a flat, hairline-divided index entry. No shadows, no radius, no background color.

- [ ] **Step 1: Replace ArticleCard implementation**

Replace the entire file content with:

```tsx
/**
 * ArticleCard Component
 * Swiss Style Index Row — flat, hairline-divided, typography-first
 */
import { Link } from 'react-router-dom';
import type { ArticleListItem } from '../../types';

interface ArticleCardProps {
  article: ArticleListItem;
  index?: number;
}

const formatDate = (article: ArticleListItem): string => {
  const dateString = article.createdAt || article.updatedAt;
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  const categoryName = article.category?.name || null;
  const displayIndex = index !== undefined ? String(index + 1).padStart(2, '0') : null;

  return (
    <article className="group border-t-[0.5px] border-gray-200 py-6 md:py-8 transition-colors duration-200">
      {/* Top metadata row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-gray-500">
        {displayIndex && (
          <span className="w-8 text-gray-400">[{displayIndex}]</span>
        )}
        <span>{formatDate(article)}</span>
        <span className="text-gray-300">|</span>
        <span>VIEWS: {(article.viewCount || 0).toString().padStart(4, '0')}</span>
        {categoryName && (
          <>
            <span className="text-gray-300">|</span>
            <span className="px-2 py-0.5 border-[0.5px] border-gray-200">
              {categoryName}
            </span>
          </>
        )}
        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            {article.tags.map((tag) => (
              <span key={tag.id} className="text-gray-500">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-black uppercase leading-tight group-hover:text-[#0047FF] transition-colors duration-200">
        <Link to={`/article/${article.slug}`} className="block">
          {article.title}
        </Link>
      </h2>

      {/* Summary */}
      {article.summary && (
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2 max-w-2xl">
          {article.summary}
        </p>
      )}
    </article>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors in `ArticleCard.tsx`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/ArticleCard.tsx
git commit -m "feat: refactor ArticleCard into Swiss Style index row"
```

---

### Task 2: Add Swiss Grid Debug Utility to index.css

**Files:**
- Modify: `frontend/src/index.css`

**Context:** Add an optional `.swiss-grid-guide` class that renders faint vertical lines to visualize the 12-column grid during development. This is a debug aid, not user-facing.

- [ ] **Step 1: Append utility class**

Append to the end of `frontend/src/index.css`:

```css
/* Swiss grid debug guide */
.swiss-grid-guide {
  background-image: linear-gradient(to right, #f3f4f6 1px, transparent 1px);
  background-size: calc(100% / 12) 100%;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/index.css
git commit -m "feat: add swiss-grid-guide debug utility"
```

---

### Task 3: Rewrite HomePage.tsx (Swiss Style Layout)

**Files:**
- Modify: `frontend/src/features/home/HomePage.tsx`

**Context:** This is the core task. Replace the existing two-column Hero + separate stats section with a strict 12-column grid. Left 8 cols hold the typographic Hero + integrated stats ruler + description + CTAs. Right 4 cols hold a Mondrian-style decorative grid of color blocks with mono labels and Lorem ipsum. Article list below shows only 4 items in a single column using the new `ArticleCard`.

**Key constraints:**
- Do NOT modify `useArticles` logic.
- Do NOT touch header/footer.
- Keep all existing translation keys.
- Images are replaced by color blocks.

- [ ] **Step 1: Replace HomePage.tsx content**

Replace the entire file with:

```tsx
/**
 * Home Page
 * Swiss Style / International Typographic Style
 */
import { useArticles } from '../../hooks/useArticles';
import { ArticleCard } from '../../components/ui/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchSiteStatistics } from '../../api/siteStatistics';
import { useQuery } from '@tanstack/react-query';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data, isLoading, error } = useArticles({ page: 0, size: 6, language });
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['siteStatistics'],
    queryFn: fetchSiteStatistics,
    staleTime: 60 * 60 * 1000,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = statistics
    ? [
        { label: 'home.stats.articles', value: statistics.totalArticles },
        { label: 'home.stats.categories', value: statistics.totalCategories },
        { label: 'home.stats.tags', value: statistics.totalTags },
        { label: 'home.stats.views', value: formatNumber(statistics.totalArticleView) },
      ]
    : [];

  const latestArticles = data?.content.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b-[0.5px] border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-4">
            {/* Left: Typography Hero + Stats + CTAs */}
            <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Main Title */}
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black leading-[0.85]">
                  BLOG
                  <span className="text-[#0047FF]">.</span>
                  CACC
                </h1>

                {/* Stats Ruler */}
                <div className="mt-6 pt-4 border-t-[0.5px] border-black flex flex-wrap gap-x-6 gap-y-2">
                  {statsLoading
                    ? [...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2 animate-pulse">
                          <div className="h-6 w-10 bg-gray-100" />
                          <div className="h-3 w-16 bg-gray-100" />
                        </div>
                      ))
                    : stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2">
                          <span className="text-xl font-bold text-black">{stat.value}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                            {t(stat.label)}
                          </span>
                        </div>
                      ))}
                </div>

                {/* Description */}
                <p className="mt-6 text-sm text-gray-600 leading-relaxed max-w-md font-mono">
                  {t('home.heroDescription')}
                </p>

                {/* CTAs */}
                <div className="flex gap-3 mt-6">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[#0047FF] transition-colors duration-200"
                  >
                    {t('home.readArticles')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/archive"
                    className="inline-flex items-center gap-2 px-6 py-3 border-[0.5px] border-gray-200 text-black text-[11px] font-mono uppercase tracking-wider hover:border-black transition-colors duration-200"
                  >
                    {t('home.viewArchive')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Mondrian Grid Module */}
            <div className="col-span-12 lg:col-span-4 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 grid-rows-3 h-full min-h-[300px] gap-[0.5px] bg-black border-[0.5px] border-black">
                {/* Cell 1: Brand Blue */}
                <div className="bg-[#0047FF] p-2 flex items-end">
                  <span className="text-[9px] font-mono text-white">FIG. A</span>
                </div>

                {/* Cell 2: White + Lorem ipsum, spans 2 rows */}
                <div className="bg-white row-span-2 p-2">
                  <p className="text-[9px] font-mono leading-tight text-black/60">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                    ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>

                {/* Cell 3: Light Gray */}
                <div className="bg-gray-100 p-2 flex items-start justify-end">
                  <span className="text-[9px] font-mono text-black">IMG_01</span>
                </div>

                {/* Cell 4: White, spans 2 cols */}
                <div className="bg-white col-span-2 col-start-1 p-2 flex items-end justify-between">
                  <span className="text-[9px] font-mono text-black">01/04</span>
                  <span className="text-[9px] font-mono text-black">RGB(0,71,255)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[0.5px] border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                //
              </span>
              <h2 className="text-lg font-bold tracking-tight text-black">
                {t('home.latestArticles')}
              </h2>
            </div>
            <Link
              to="/articles"
              className="text-[11px] font-mono text-gray-600 hover:text-[#0047FF] transition-colors flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Articles list */}
          {isLoading ? (
            <div className="space-y-0">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border-t-[0.5px] border-gray-200 py-6 animate-pulse"
                >
                  <div className="h-3 bg-gray-100 mb-4 w-48" />
                  <div className="h-6 bg-gray-100 mb-2 w-2/3" />
                  <div className="h-4 bg-gray-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border-[0.5px] border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-600 font-mono">
                ERROR: {error.message}
              </p>
            </div>
          ) : (
            <div>
              {latestArticles.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx} />
              ))}
              {/* Bottom border for last item */}
              <div className="border-b-[0.5px] border-gray-200" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run visual verification**

Run: `cd frontend && npm run dev`
Open: `http://localhost:5173`
Verify:
- Hero uses 12-column grid (8:4 split on desktop).
- Title is massive, tight leading, black with blue dot.
- Stats appear as a horizontal ruler under the title.
- Mondrian grid on the right has color blocks, mono labels, and Lorem text.
- Article list shows exactly 4 items in flat index rows with hairline borders.
- Hover on article title turns it blue.
- No cards, no shadows, no rounded corners anywhere.
- Mobile layout stacks vertically and remains readable.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/home/HomePage.tsx
git commit -m "feat: rewrite HomePage with Swiss Style 12-col grid and Mondrian module"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] 12-column asymmetric grid — Task 3
- [x] Extreme typography contrast (title `text-9xl`) — Task 3
- [x] No shadows, no radius, hairline borders only — Tasks 1 & 3
- [x] Stats integrated into Hero as ruler — Task 3
- [x] Mondrian grid with color blocks + Lorem — Task 3
- [x] ArticleCard de-carded into index row — Task 1
- [x] Only 4 articles displayed — Task 3 (`slice(0, 4)`)
- [x] No pseudo-tech labels — Task 3 (removed `home.systemInit` / Terminal)
- [x] Preserve `useArticles` and `useQuery` logic — Tasks 1 & 3
- [x] Responsive behavior — Task 3 (col-span classes)

**Placeholder scan:** No TBD/TODO/fill-in-details found. All code blocks are complete.

**Type consistency:** `ArticleCardProps` updated to include optional `index`. `HomePage` passes `index` to `ArticleCard`. Types match existing `ArticleListItem`.
