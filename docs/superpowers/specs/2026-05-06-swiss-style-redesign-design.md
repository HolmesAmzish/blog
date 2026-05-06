# Swiss Style (International Typographic Style) Homepage Redesign

## Overview

Refactor the blog homepage (`HomePage.tsx`) and article card (`ArticleCard.tsx`) to adopt **Swiss Style / International Typographic Style** design principles. The goal is to transform the current "technical minimalism" aesthetic into a rigorous, grid-based, typography-first layout that resembles a modern architectural drawing or typographic poster.

## Goals

- Establish a strict 12-column asymmetric grid for all page components.
- Elevate typography to be the primary visual element (extreme weight/size contrast).
- Remove all decorative shadows, rounded corners, and card-like containers.
- Use `0.5px` hairline borders as the sole structural divider.
- Maintain existing data fetching logic (`useArticles`, `useQuery`).
- Display only 3-4 latest articles on the homepage; use remaining space for Swiss-style decorative elements.

## Non-Goals

- Do not modify backend APIs or data structures.
- Do not change routing or navigation logic.
- Do not implement real images in decorative blocks (use color blocks as placeholders).
- Do not use "pseudo-tech" decorative labels (e.g., "System Initialized", fake terminal output).

## Design Principles

1. **Grid Sovereignty**: Every element must align to the 12-column grid. Asymmetry is intentional and balanced.
2. **Typography as Image**: Headlines are graphic elements, not just text.
3. **Flatness**: No depth, no shadows, no gradients. Only lines, rectangles, and type.
4. **Functional Color**: Black (#000000), White (#FFFFFF), and Brand Blue (#0047FF) only.
5. **Monospace for Data**: All metadata, numbers, dates, and labels use monospace fonts.
6. **Simplicity Over Decoration**: Reject ornamental tech-themed icons and labels. Decoration is geometric (Mondrian blocks), not semantic.

## Scope

### Files to Modify

- `frontend/src/features/home/HomePage.tsx` — Full layout restructuring.
- `frontend/src/components/ui/ArticleCard.tsx` — Complete visual overhaul (index row concept).
- `frontend/src/index.css` — Add supporting utility classes if needed.

### Files to Preserve (Logic Only)

- `frontend/src/hooks/useArticles.ts` — Keep hook logic intact.
- Translation keys and `t()` usage — Maintain existing i18n structure for buttons and stats labels.

## Component Design

### 1. HomePage.tsx — Layout Structure

#### Global Container

- Outer wrapper uses `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`.
- All sections stack vertically, separated by `0.5px` horizontal borders (`border-b-[0.5px] border-gray-200`).

#### Header / Hero Section

- **Structure**: A single `grid grid-cols-12` row.
- **Left (Col 1-8)**:
  - Massive title: `BLOG.CACC`.
  - Font size: `text-7xl md:text-8xl lg:text-9xl`.
  - Line height: `leading-[0.8]` or `leading-[0.85]` for extreme tightness.
  - Font weight: `font-black` (or `font-bold` if `black` unavailable).
  - Letter spacing: `tracking-tighter`.
  - Color: Black. The dot in `BLOG.CACC` uses Brand Blue (`#0047FF`).
  - Below the title: Stats module (see below) integrated directly into the left column.
  - Below stats: short mono description text and CTA buttons (`home.readArticles`, `home.viewArchive`).
  - Buttons: sharp rectangles, `0.5px` borders, no radius. Primary button is black fill; secondary is white fill with black border.
- **Right (Col 9-12)**:
  - **Mondrian Grid Module**: A composition of rectangles divided by `0.5px` black borders.
  - The module occupies the full height of the Hero section.
  - Internal layout is a nested grid with non-uniform cell sizes (e.g., 2×2 where one cell spans 2 rows, another spans 2 columns).
  - Color fills: Brand Blue (`bg-[#0047FF]`), Light Gray (`bg-gray-100`), White (`bg-white`).
  - Some cells contain small Mono text labels anchored to corners: `IMG_01`, `FIG. A`, `RGB(0,71,255)`, `PLATE 01`.
  - One cell contains a short block of Lorem ipsum text in `text-[9px] font-mono leading-tight text-black/60`, serving as a typographic texture block.
  - Some cells are left empty (white) to create breathing room.
  - This serves as a placeholder for future images/media.

#### Stats Module (Integrated into Hero Left Column)

- **Structure**: A compact horizontal bar placed directly beneath the main title, before the description and buttons.
- **Style**:
  - Top border only: `border-t-[0.5px] border-black`.
  - Content: flex row, evenly distributed.
  - Each stat item displays: `[VALUE] | [LABEL]`.
  - Value: `text-xl font-bold text-black`.
  - Separator: `|` character in `text-gray-300`.
  - Label: `text-[10px] font-mono uppercase tracking-wider text-gray-500`.
  - The entire module resembles a ruler or technical scale embedded within the Hero.
- **No separate stats section below Hero.**

#### Latest Articles Section

- **Structure**: Section header + article list.
- **Header**:
  - Left: `// home.latestArticles` in Mono (`text-[10px]`).
  - Right: `home.viewAll` link in Mono.
  - Separated from list by `0.5px` border.
- **List**:
  - Grid changes from `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to a single column list.
  - Only render the first 4 articles from `data?.content`.
  - Use the redesigned `ArticleCard` (see below).

### 2. ArticleCard.tsx — Index Row / Archive Block

The card concept is replaced with a **horizontal index entry**.

#### Visual Structure (per article)

```
------------------------------------------------------------------
[01]  2026/05/07  |  VIEWS: 0042  |  #TAG1  #TAG2
TITLE OF THE ARTICLE (Bold, Uppercase, Large)
Summary text goes here in a smaller grid, limited to 2 lines max.
------------------------------------------------------------------
```

#### Detailed Spec

- **Outer Container**:
  - `border-t-[0.5px] border-gray-200`.
  - Last item also gets `border-b-[0.5px]`.
  - No background color, no shadow, no border-radius.
  - Padding: `py-6` or `py-8`.
- **Top Metadata Row**:
  - Flex row, items centered, gap between elements.
  - `Index`: Zero-padded number (`01`, `02`, ...). `text-[10px] font-mono text-gray-400`. Width fixed (e.g., `w-8`).
  - `Date`: `YYYY/MM/DD` format. `text-[10px] font-mono text-gray-500`.
  - `View Count`: `VIEWS: ` prefix + zero-padded 4-digit number. `text-[10px] font-mono text-gray-500`.
  - `Category`: Optional. Small bordered pill: `px-2 py-0.5 border-[0.5px] border-gray-200 text-[10px] font-mono uppercase`.
  - `Tags`: `#tagname` format, inline, `text-[10px] font-mono text-gray-500`.
- **Title**:
  - `text-xl md:text-2xl font-bold tracking-tight text-black uppercase`.
  - Margin top: `mt-2` or `mt-3`.
  - Link wraps the title text.
- **Summary**:
  - `text-sm text-gray-600 leading-relaxed`.
  - `line-clamp-2` to limit to 2 lines.
  - Margin top: `mt-2`.
- **Hover State**:
  - No background color change.
  - Title color transitions to Brand Blue (`#0047FF`).
  - Optional: a `0.5px` bottom border appears under the title (`border-b-[0.5px] border-[#0047FF]`).
  - Transition: `transition-colors duration-200`.

### 3. Decorative Mondrian Grid Module (Inside Hero)

A self-contained component (could be inline in `HomePage.tsx` or a new `SwissMondrianBlock.tsx`).

#### Structure

- CSS Grid with `grid-cols-2 grid-rows-3` or similar non-uniform composition.
- Gap: `0px` (borders act as separators).
- All cells have `border-[0.5px] border-black`.
- Cell sizes vary to create asymmetry:
  - One cell spans 2 rows (`row-span-2`).
  - One cell spans 2 columns (`col-span-2`).
- Cell contents:
  - Some cells are solid color fills (Brand Blue, Gray-100).
  - Some cells have small Mono text in the corner (`p-2`): `FIG. A`, `IMG_01`, `01/04`.
  - One cell contains Lorem ipsum paragraph: `text-[9px] font-mono leading-tight text-black/60`.
  - Some cells are empty white.
- Aspect ratio: The entire module should roughly match or exceed the height of the left-side title block.

### 4. CSS Additions (index.css)

- Verify `::selection` background is Brand Blue (already present).
- Optionally add `.swiss-grid-guide` helper (for dev/debug only):
  ```css
  .swiss-grid-guide {
    background-image: linear-gradient(to right, #f3f4f6 1px, transparent 1px);
    background-size: calc(100% / 12) 100%;
  }
  ```
- No other global style changes required; Tailwind utilities handle the rest.

## Responsive Behavior

- **Desktop (>= 1024px)**: Full 12-column grid. Hero is 8:4 split. Article list is single column. Mondrian grid is visible.
- **Tablet (768px - 1023px)**: Hero may collapse to single column (12:12), pushing Mondrian grid below the title. Stats remain horizontal. Article list stays single column.
- **Mobile (< 768px)**: Single column layout. Hero title scales down (`text-5xl` or `text-6xl`). Mondrian grid becomes a 2×2 square below the title. Stats wrap to 2×2 grid. Article index rows maintain structure but reduce metadata density (hide views or category if needed).

## State & Logic Preservation

- `useArticles({ page: 0, size: 6, language })` → keep `size: 6` for query, but slice `data?.content.slice(0, 4)` for rendering.
- `useQuery` for `siteStatistics` remains unchanged.
- `formatNumber` helper remains.
- Translation keys (`t('home.stats.articles')`, etc.) remain.

## Dependencies

- No new npm packages required.
- Tailwind CSS utilities are sufficient.
- `lucide-react` icons can be removed or kept for CTA buttons (keep minimal).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Extremely tight leading (`leading-[0.8]`) causes descender/ascender collisions in Chinese characters. | Test with Chinese content; loosen to `leading-[0.85]` or `leading-[0.9]` if needed. |
| Mondrian grid looks unbalanced on very wide screens. | Constrain Hero max-height or use `aspect-square` on the grid module. |
| Single-column article list feels too long. | Since we only show 3-4 items, this is acceptable. Ensure ample whitespace between entries. |

## Open Questions

- None. Design is locked following user selection of Option C (Mondrian Grid) for decorative elements, Option B (medium-density archive blocks) for article density, and user confirmation to integrate Stats into Hero and include Lorem ipsum text blocks.
