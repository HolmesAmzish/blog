# Admin Design System

## 1. Scope

本文档只总结 `frontend/apps/admin` 的前端样式，不包含 public 端。目标是形成一套可复制到下一个 React + TypeScript + Tailwind 项目的设计语言与提示词，使新后台在不引入 shadcn/ui、HeroUI、MUI 等 UI 库的情况下获得同样的视觉秩序。

可以概括为：**Calm Operator**。界面是安静的操作台，不是营销页。中性近白或近黑画布上放白色/石墨卡片，用极细 hairline、12px 圆角、单一蓝色强调、紧凑 13px UI 字号和极轻阴影建立层级。内容可以密集，但控制要克制、可预测、轻盈。

风格来源：

| 来源 | 借用的部分 | 不借用的部分 |
| --- | --- | --- |
| Apple | SF/system 字体栈、`#f5f5f7` / `#1d1d1f` / 白色卡片、极细边框、克制阴影 | 大型营销 hero、低密度排版 |
| GNOME 50 / libadwaita | 中性系统表面、圆角容器、贴近操作系统的安静质感 | 大面积装饰性主题色 |
| Google | 清晰的 icon/chip/segmented control、focus ring、可预期状态 | Material 色板和阴影体系 |
| ChatGPT | 轻量中性输入区、pill 控件、紧凑而呼吸的内容密度 | 聊天界面结构 |
| `awesome-design-md` | Apple 与 Linear 的 hairline 卡片、单一 accent、低反射界面；Cal/Notion 的清晰卡片节奏 | 各自的品牌色、装饰渐变、营销版式 |

参考文件：

- `/home/cacc/Repositories/awesome-design-md/design-md/apple/DESIGN.md`
- `/home/cacc/Repositories/awesome-design-md/design-md/linear.app/DESIGN.md`
- `/home/cacc/Repositories/awesome-design-md/design-md/cal/DESIGN.md`
- `/home/cacc/Repositories/awesome-design-md/design-md/notion/DESIGN.md`

## 2. Architecture Rules

1. **Tailwind 是唯一视觉实现方式。** 颜色、圆角、阴影、状态、布局都通过 utility class 表达；不要为普通组件写大段 component CSS。
2. **不使用预设 UI 组件库。** 禁止 shadcn/ui、HeroUI/NextUI、MUI、Ant Design、DaisyUI 等。可以保留非常小的本地原语，例如 `Card`，但它只封装固定 class，不做成多主题组件系统。
3. **语义 token 优先。** 页面只允许使用 `background`、`foreground`、`card`、`muted`、`border`、`primary` 等语义 token。不要在页面里硬编码 Apple/Google 品牌色。
4. **原生控件优先。** `input`、`select`、`textarea`、`button`、`label` 直接加 Tailwind。只有交互行为复杂时才创建本地受控组件；外观仍然由 utility class 控制。
5. **`cn` 只处理合并冲突。** 使用 `clsx` + `tailwind-merge` 合并 class，不要把 `cn` 变成新的样式引擎。
6. **没有装饰性全局样式。** 全局 CSS 只包含 reset、主题 token、字体、focus、selection、scrollbar 和少量 dark-mode 兼容层。
7. **新项目不要复制 legacy hack。** 当前 admin 中还存在 `.admin-card`、`.dark .bg-white`、`text-white`、Tailwind 原始 green/amber/red 类。旧代码可以逐步迁移，新项目应直接使用语义 token。

## 3. Theme Tokens

### 3.1 Canonical Tokens

Tailwind CSS v4 使用 CSS-first theme。新项目可以直接使用以下骨架：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);

  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --animate-fade-in: fadeIn 0.35s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

:root {
  --background: #f5f5f7;
  --foreground: #1d1d1f;
  --card: #ffffff;
  --card-foreground: #1d1d1f;
  --primary: #0047ff;
  --primary-foreground: #ffffff;
  --muted: #f5f5f7;
  --muted-foreground: #86868b;
  --border: #e8e8ed;
  --input: #e8e8ed;
  --ring: #0047ff;
  --success: #15803d;
  --warning: #b45309;
  --danger: #dc2626;
  --radius: 12px;
}

.dark {
  --background: #000000;
  --foreground: #f5f5f7;
  --card: #1c1c1e;
  --card-foreground: #f5f5f7;
  --primary: #0047ff;
  --primary-foreground: #ffffff;
  --muted: #141416;
  --muted-foreground: #98989d;
  --border: #2c2c2e;
  --input: #2c2c2e;
  --ring: #0047ff;
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #f87171;
}
```

当前代码中 dark mode 的 `--muted: #1c1c1e` 与卡片相同，会让卡片内嵌面板和 hover 状态失去对比。新项目建议用 `#141416` 作为 recessed surface。

### 3.2 Color Usage

- `bg-background`：页面画布，永远是最低层级。
- `bg-card`：卡片、侧边栏、弹窗、顶栏内实体。是最重要的“一层表面”。
- `bg-muted`：输入框、内嵌统计块、表头、hover、空态背景。比 `card` 更低一级。
- `text-foreground`：标题、正文、icon。
- `text-muted-foreground`：副标题、meta、label、占位符、非当前导航。
- `border-border`：卡片、输入、分段控件、分割线。
- `bg-primary`：唯一品牌强调色。只用于主动作、当前导航、选中 chip 和关键链接，不做大面积填充。
- `bg-foreground`：反向色块，用于头像、logo tile、tab active 等极小面积。
- semantic token 只用于状态，不用于装饰。

状态色推荐写法：

```tsx
<span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
  Published
</span>
```

## 4. Typography

使用系统字体栈，优先贴近 Apple SF：

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Helvetica Neue", Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

admin 是操作型 UI，字号刻意小于 marketing 端：

| 用途 | Canonical classes |
| --- | --- |
| 页面标题 | `text-[22px] font-semibold leading-tight text-foreground` |
| 页面副标题 | `text-[13px] text-muted-foreground` |
| 编辑页标题 | `text-[18px] font-semibold leading-none text-foreground` |
| 弹窗标题 | `text-[15px] font-semibold text-foreground` |
| 卡片/区域标题 | `text-[13px] font-semibold text-foreground` |
| 表单正文 | `text-[13px] text-foreground` |
| meta / 次级说明 | `text-[12px] text-muted-foreground` |
| label / 分组标题 | `text-[11px] font-medium text-muted-foreground` |
| badge | `text-[10px]` 或 `text-[11px] font-medium` |
| 统计数值 | `text-[28px] font-semibold leading-none text-foreground` |
| Markdown 编辑正文 | `text-[13px] leading-relaxed font-mono` |

规则：

- UI 字号集中在 10、11、12、13、15、18、22、28px，不要为每个页面发明新字号。
- 默认 `letter-spacing: 0`。旧代码里的 `tracking-tight` / `tracking-wide` 可以保留，但新项目不要依赖负向字距塑造层级。
- 标题用重量 600，按钮和重要 meta 用 500，普通 meta 用 400。
- 长标题和文件名必须 `truncate`，同时父级保持 `min-w-0`。

## 5. Layout

### 5.1 App Shell

```tsx
<div className="min-h-screen bg-background flex">
  <aside className="fixed lg:sticky top-0 z-40 h-screen w-[272px] bg-card border-r border-border flex flex-col shrink-0 transition-transform duration-200 lg:translate-x-0">
    {/* sidebar */}
  </aside>

  <div className="flex-1 min-w-0 flex flex-col">
    <header className="sticky top-0 z-20 h-[56px] bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-4 px-4 lg:px-8">
      {/* breadcrumb */}
    </header>

    <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 max-w-[1280px] w-full mx-auto">
      <div className="space-y-5 animate-fade-in">{/* page */}</div>
    </main>
  </div>
</div>
```

关键尺寸：

- sidebar 宽度：272px。
- header 高度：56px。
- content 最大宽度：1280px。
- content padding：`px-4 lg:px-8`，垂直 `py-6 lg:py-8`。
- 页面纵向节奏：`space-y-5` 或 `space-y-6`。
- 卡片内部常规 padding：`p-4` / `p-5`；列表容器和大卡片用 `p-6`。
- grid gap：紧凑卡片 `gap-3`，常规内容 `gap-4`。

移动端 sidebar 使用 fixed drawer：

```tsx
<button
  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
  aria-label="close sidebar"
/>
```

### 5.2 Sidebar

- 品牌区高度 64px。
- 导航项：`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] leading-none transition-all`。
- active 导航：`bg-primary text-primary-foreground shadow-sm`。
- inactive 导航：`text-muted-foreground hover:text-foreground hover:bg-muted`。
- icon 大小 16px；active 使用 `strokeWidth={2.2}`，inactive 使用 `strokeWidth={1.8}`。
- 分组标题：`px-3 mb-2 text-[11px] font-medium tracking-wide text-muted-foreground`。
- 搜索框：`bg-muted`、`rounded-lg`、高度与普通导航接近，右侧放 `⌘K` 样式的 11px keyboard chip。
- 底部用户卡：`rounded-xl bg-muted border border-border`，头像 32px 圆形。

### 5.3 Page Header

```tsx
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
  <div>
    <h1 className="text-[22px] font-semibold leading-tight text-foreground">Articles</h1>
    <p className="text-[13px] text-muted-foreground mt-1">Create, edit and publish your content.</p>
  </div>

  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-medium shadow-sm transition-colors hover:bg-primary/90">
    <Plus size={14} />
    New Article
  </button>
</div>
```

## 6. Components

以下不是组件 API，而是 class recipe。项目可以复制 class，或在重复出现 3 次以上时收敛成极小的本地组件。

### 6.1 Card

```tsx
<div className="bg-card text-card-foreground rounded-[var(--radius)] border border-border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none">
  {/* content */}
</div>
```

规则：

- 卡片圆角固定 12px，即 `var(--radius)`。
- 卡片边框是 hairline：`border border-border`。
- light mode 只允许极轻双层阴影；dark mode 阴影移除。
- `overflow-hidden` 只用于表格、图片、可裁剪媒体卡片。
- 不要在卡片里再嵌套同规格卡片。内嵌区域用 `rounded-xl bg-muted`。

### 6.2 Buttons

Primary：

```tsx
className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-medium shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
```

Secondary：

```tsx
className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-[13px] text-foreground transition-colors hover:bg-muted"
```

Modal cancel：

```tsx
className="flex-1 py-2.5 rounded-full bg-muted text-foreground text-[13px] font-medium transition-colors hover:bg-muted/70"
```

Danger：

```tsx
className="flex-1 py-2.5 rounded-full bg-danger text-white text-[13px] font-medium transition-colors hover:bg-danger/90 disabled:opacity-40"
```

Ghost icon button：

```tsx
className="p-2 rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
```

Destructive icon button：

```tsx
className="p-2 rounded-lg text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
```

Floating media action：

```tsx
className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground shadow-sm transition-colors hover:text-primary"
```

规则：

- 主动作每页最多一个。
- 工具类按钮优先只有 icon，并用 `title` 提供说明。
- 编辑、删除等 row action 使用 14px icon。
- 主按钮不做大圆角矩形，除非是全宽表单提交；大多数命令按钮使用 pill。

### 6.3 Inputs

Standard input / select：

```tsx
className="w-full rounded-xl bg-muted border border-transparent px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-border"
```

Markdown / large textarea：

```tsx
className="w-full min-h-[420px] rounded-xl bg-card border border-border px-3 py-3 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 resize-y font-mono"
```

Title input：

```tsx
className="w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-2 text-[18px] font-medium text-foreground focus:outline-none focus:border-primary"
```

Label：

```tsx
<label className="block text-[11px] font-medium text-muted-foreground mb-2">Slug</label>
```

规则：

- 默认输入是“muted 凹面”，focus 后变成“card 浮面 + border”。
- 输入圆角 12px，按钮常用 pill，这种差异让表单和命令区域可区分。
- 错误文案：`text-[12px] text-danger`。
- checkbox 使用原生控件，推荐 `w-3.5 h-3.5 rounded accent-primary`。
- 不要给每个 input 加大阴影。

### 6.4 Chips / Badges

Neutral badge：

```tsx
className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
```

Status badge：

```tsx
className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success"
```

Tag chip：

```tsx
className="px-2.5 py-1 rounded-full border text-[12px] font-medium transition-colors"
// selected
"bg-primary text-primary-foreground border-primary"
// unselected
"bg-card text-muted-foreground border-border hover:border-primary/40"
```

规则：

- chip 圆角永远是 `rounded-full`。
- 状态只使用 success / warning / danger / neutral 四组。
- 不为 category、tag 等普通数据生成彩色 badge。

### 6.5 Table / Data List

表格不使用 `<table>` 默认外观，使用 card + grid：

```tsx
<div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none">
  <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-muted text-[11px] font-medium text-muted-foreground">
    <div className="col-span-6">Title</div>
    <div className="col-span-2">Category</div>
    <div className="col-span-2">Status</div>
    <div className="col-span-2 text-right">Actions</div>
  </div>

  <div className="divide-y divide-border">
    <div className="px-6 py-4 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center hover:bg-muted transition-colors">
      <div className="col-span-6 min-w-0 w-full">
        <p className="text-[13px] font-medium text-foreground truncate">Title</p>
        <p className="text-[12px] text-muted-foreground mt-1">Meta</p>
      </div>
    </div>
  </div>
</div>
```

规则：

- desktop 用 `grid-cols-12`；移动端表头隐藏，行内改为纵向 stack。
- row padding：`px-6 py-4`。
- 第一列是主信息：13px medium；第二行是 12px muted meta。
- 行 hover 使用 `bg-muted`，不加 scale/shadow。
- 删除等操作右对齐，不整行高亮。

### 6.6 Item Card

```tsx
<div className="p-4 flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none group transition-colors hover:border-border">
  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
    <FolderTree size={14} />
  </div>

  <div className="flex-1 min-w-0">
    <div className="text-[13px] font-medium text-foreground truncate">Name</div>
    <div className="text-[12px] text-muted-foreground font-mono truncate">/slug</div>
  </div>

  <div className="flex items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
    {/* edit */}
    {/* delete */}
  </div>
</div>
```

图片卡片保留 4:3：

```tsx
<div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card group">
  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
    <img className="w-full h-full object-cover" loading="lazy" />
  </div>
  <div className="p-3">
    <div className="text-[12px] font-medium text-foreground truncate">filename.jpg</div>
    <div className="flex items-center justify-between mt-1.5 text-[11px] text-muted-foreground">
      <span>1.2 MB</span>
      <span className="font-mono">JPG</span>
    </div>
  </div>
</div>
```

### 6.7 Stat Card

```tsx
<div className="p-5 rounded-[var(--radius)] border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none">
  <div className="flex items-start justify-between mb-3">
    <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center text-foreground">
      <FileText size={16} />
    </div>
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
      Stable
    </span>
  </div>

  <div className="text-[11px] font-medium text-muted-foreground mb-1">Total Articles</div>
  <div className="text-[28px] font-semibold leading-none text-foreground">128</div>
  <div className="text-[12px] text-muted-foreground mt-2">12 published · 3 drafts</div>
</div>
```

### 6.8 Modal / Confirm

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
  <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-auto">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-[15px] font-semibold text-foreground">Edit category</h2>
      <button className="p-1.5 rounded-full text-muted-foreground hover:bg-muted">
        <X size={16} />
      </button>
    </div>

    <form className="space-y-4">{/* fields */}</form>

    <div className="flex gap-3 pt-2">
      <button className="flex-1 py-2.5 rounded-full bg-muted text-[13px] font-medium">Cancel</button>
      <button className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-medium">Save</button>
    </div>
  </div>
</div>
```

规则：

- 普通编辑弹窗 `max-w-md`，确认框 `max-w-sm`。
- 弹窗标题 15px，不是页面标题的 22px。
- overlay：`bg-black/30 backdrop-blur-sm`。
- destructive confirm 主按钮为 `bg-danger text-white`。
- 弹窗内不用额外卡片包裹表单。

### 6.9 Empty / Loading / Feedback

```tsx
<div className="p-10 text-center rounded-[var(--radius)] border border-border bg-card">
  <FolderTree size={32} className="mx-auto mb-3 text-muted-foreground/40" />
  <p className="text-[13px] text-muted-foreground mb-3">No categories yet.</p>
  <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[13px] font-medium">
    Create category
  </button>
</div>
```

Loading：

```tsx
<div className="p-10 text-center text-[13px] text-muted-foreground">Loading articles…</div>
```

Spinner：

```tsx
<div className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin" />
```

## 7. Iconography

- 统一使用 Lucide。
- 小 UI icon：12/14/16px。
- empty state icon：32px。
- logo/avatar 内 icon：10/12px。
- 默认 stroke 1.8；active 状态可以到 2.2。
- 不使用 filled 图标、emoji、手绘 SVG 当 UI icon。
- icon 按钮必须提供 `title` 或 `aria-label`。

## 8. Motion

- 页面进入：`animate-fade-in`，350ms，ease-out，Y 位移 4px。
- hover/focus/颜色变化：150-200ms。
- mobile drawer：200ms transform。
- overlay 只做透明度/blur，不做弹窗飞入。
- 不使用 parallax、floating orb、大渐变、粒子、玻璃拟态卡片。
- 顶栏和弹窗 overlay 是唯一允许 `backdrop-blur` 的地方。

## 9. Accessibility

- 全局 focus：

```css
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

- 颜色对比至少满足正文 4.5:1，大标题 3:1。
- `text-white` 只在 `--primary-foreground` 明确为白色时使用；页面应写 `text-primary-foreground`。
- 状态不能只靠颜色，重要状态应包含文本。
- 图片必须有 `alt`；装饰图可空 `alt`。
- 所有交互控件最小可点击区域不低于 32px；移动端优先接近 40px。

## 10. Anti-Patterns

新项目明确不要出现：

- shadcn/ui 或其他预设 UI 库的默认皮肤。
- 页面内硬编码 `#f5f5f7`、`#1d1d1f`、`#0047FF` 等品牌色。
- 蓝紫渐变、网格光斑、bokeh、玻璃拟态卡片、噪点装饰。
- 24px 以上主按钮、巨大 hero、marketing 式大标题。
- 卡片内嵌同层级卡片。
- 每个模块一种 accent color。
- 彩色 category/tag 卡片。
- 未经 token 化的彩色 icon 背景。
- 只有 icon 没有说明的危险操作。
- 为“好看”添加额外阴影、边框、渐变或动画。

## 11. Reusable Prompt

把以下内容复制给实现 admin 端的 AI 或工程师：

```text
Role:
You are a senior frontend engineer and product interface designer. Build an admin console in a reusable Tailwind-only design system called "Calm Operator".

Goal:
The admin UI should feel like Apple's calm system typography, GNOME/libadwaita's neutral surface hierarchy, Google's predictable controls, and ChatGPT's light rounded input/control language. It must be dense, quiet, efficient, and free of marketing-page decoration.

Stack constraints:
- React + TypeScript + Vite + Tailwind CSS v4.
- Use Lucide icons. Use native HTML controls unless interaction requires a tiny local component.
- Do NOT use shadcn/ui, HeroUI/NextUI, MUI, Ant Design, DaisyUI, Bootstrap, or any pre-styled component library.
- Do not build a large themeable component system. Prefer utility class recipes copied from the design system.
- Use clsx + tailwind-merge through a small cn() helper only for conditional class merging.
- Define all visual meaning with semantic tokens in one global CSS file.

Theme:
- Light: background #f5f5f7, foreground #1d1d1f, card #ffffff, border #e8e8ed, muted #f5f5f7, muted foreground #86868b.
- Dark: background #000000, card #1c1c1e, border/input #2c2c2e, foreground #f5f5f7, muted #141416, muted foreground #98989d.
- Primary is a single blue: #0047ff. Primary foreground is white.
- Use success, warning, and danger only for meaningful state. Never use extra accent colors for decoration.
- Use `.dark` on html and support light / dark / system.
- Dark cards remove the light-mode shadow.

Surfaces:
- Page canvas: bg-background.
- Card/sidebar/modal: bg-card with border-border and 12px radius.
- Recessed panel/input/table header: bg-muted with rounded-xl.
- Light card shadow: shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)].
- Dark card shadow: none.
- No nested cards. Use rounded-xl bg-muted for inset panels.

Layout:
- Fixed/sticky sidebar: 272px wide, bg-card, border-r, mobile drawer with bg-black/20 backdrop-blur-sm.
- Sticky header: 56px tall, bg-background/80, backdrop-blur-xl, bottom hairline.
- Main content: max-w-[1280px], px-4 lg:px-8, py-6 lg:py-8.
- Page vertical rhythm: space-y-5 or space-y-6.
- Page grid gap: gap-4; compact card grid gap: gap-3.

Typography:
- Font stack: -apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Helvetica Neue, Helvetica, Arial, sans-serif.
- UI sizes are compact: 11px labels, 12px meta, 13px body/controls, 15px modal title, 18px editor title, 22px page title, 28px stat value.
- Labels and group titles are 11px medium muted.
- Primary text is foreground; secondary text is muted-foreground.
- Default letter spacing is 0. Do not use negative tracking as a structural design device.
- Long titles, emails, filenames, and slugs must truncate with min-w-0 on the parent.

Controls:
- Primary button: inline-flex, gap-2, px-4, py-2.5, rounded-full, bg-primary, text-primary-foreground, text-[13px], font-medium, shadow-sm, hover:bg-primary/90, disabled:opacity-40.
- Secondary button: rounded-xl, bg-card, border-border, text-[13px], hover:bg-muted.
- Icon button: p-2, rounded-lg, muted icon, hover:bg-muted, hover:text-foreground; destructive hover uses danger/10 and danger.
- Standard input: w-full, rounded-xl, bg-muted, border-transparent, px-3, py-2.5, text-[13px]; on focus switch to bg-card and border-border.
- Markdown editor: rounded-xl, bg-card, border-border, px-3, py-3, text-[13px], leading-relaxed, font-mono; focus uses primary/40 border and primary/10 ring.
- Chips and badges: rounded-full, 10-12px text, neutral by default; selected chips use primary.
- Status badge: semantic token or semantic-tinted background, semantic text, semantic/25 border.

Components:
- Page header: title 22px semibold, subtitle 13px muted, action on the right, responsive flex-col to sm:flex-row.
- Stat card: p-5, 36px icon tile, rounded-xl muted tile, 11px label, 28px value, 12px subtext.
- Data table: card with overflow-hidden, grid-cols-12 header on md+, hidden header on mobile, divide-y rows, px-6 py-4, hover:bg-muted.
- Item card: p-4, 32px icon tile, 13px title, 12px muted meta, hover-revealed actions.
- Modal: max-w-md or max-w-sm, rounded-2xl, bg-card, border, p-6, shadow-xl, black/30 blurred overlay, 15px title, equal-width cancel/confirm buttons.
- Empty state: p-10, centered, 32px muted icon, 13px muted copy, optional compact primary action.

Interaction:
- Page entry uses a 350ms fade-in from translateY(4px).
- Hover/color transitions are 150-200ms.
- Drawer transitions are 200ms transform.
- Focus-visible is a 2px ring-colored outline with 2px offset.
- No parallax, decorative gradient, orb, bokeh, glass card, or unnecessary animation.

Implementation rules:
- Use only semantic Tailwind tokens such as bg-background, text-foreground, bg-card, bg-muted, text-muted-foreground, border-border, bg-primary, text-primary-foreground, text-success, text-warning, and text-danger.
- Do not hardcode palette colors in page components.
- Do not use text-white for primary buttons unless primary-foreground is unavailable.
- Keep UI text in English by default.
- Preserve keyboard accessibility and aria-labels for icon-only actions.
- Responsive behavior is mandatory: sidebar becomes a drawer, table headers collapse, grids stack.

Acceptance checklist:
1. No UI library is installed or imported.
2. Every page uses the same token names; no hex colors in page markup.
3. Cards are 12px, hairline-bordered, and have only the specified soft shadow.
4. Buttons, chips, and badges use pill geometry; cards and inputs use 12px geometry.
5. Primary action is singular and visually dominant.
6. Semantic colors are never decorative.
7. Dark mode has no harsh white boxes, no heavy shadows, and recessed panels remain visible.
8. Text fits and truncates predictably on mobile and desktop.
9. The page is information-dense but has visible breathing room.
10. The result looks like a quiet operating console, not a landing page.
```

### 11.1 Single Page Prompt

新增或修改某个 admin 页面时，可以在 base prompt 后追加：

```text
Create or update Admin<PageName>Page.tsx using the Calm Operator system.

The page must contain:
1. A 22px page title and 13px muted description.
2. A single primary action in the header when a create flow exists.
3. A compact filter bar inside a bg-card, 12px-radius surface using bg-muted inputs.
4. A data table or item grid with divide-y separation and hover:bg-muted.
5. Empty and loading states using the standard centered pattern.
6. Modals only where the existing workflow requires confirmation or metadata editing.

Do not introduce new colors, new component libraries, new card shadows, new button shapes, or a new typography scale. Reuse the exact semantic tokens and class recipes from the admin design system.
```

## 12. Current Implementation Drift

以下问题属于历史兼容，不是新项目要模仿的规范：

- `.admin-card` 是 deprecated alias，新代码应使用语义 token 或本地 `Card`。
- `.dark .bg-white` 等 legacy selector 不应复制到新项目。
- 部分主按钮写了 `text-white`，新代码应统一为 `text-primary-foreground`。
- 部分状态使用 Tailwind 原始 `green-*` / `amber-*` / `red-*`，新代码应改为 `success` / `warning` / `danger` token。
- dark mode 中 `muted` 与 `card` 当前同色，建议新项目将 dark `muted` 调整为 `#141416`。
- 现有代码偶尔混用 `hover:bg-primary` 和 `hover:bg-primary/90`，canonical hover 是 `bg-primary/90`。

## 13. Tailwind Class Contract

这一节是给实现者的“语义到 Tailwind class”速查。页面中应优先复制这里的 class；只有在确有布局需要时才添加其他 utility。

| 语义 | Canonical Tailwind classes |
| --- | --- |
| 页面画布 | `min-h-screen bg-background text-foreground` |
| 一层表面 / 卡片 | `bg-card text-card-foreground rounded-[var(--radius)] border border-border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none` |
| 内嵌/低一级表面 | `rounded-xl bg-muted text-muted-foreground` |
| hairline 分隔 | `border-border` / `divide-border` / `divide-y divide-border` |
| 输入默认态 | `rounded-xl bg-muted border border-transparent px-3 py-2.5 text-[13px] focus:outline-none focus:bg-card focus:border-border` |
| 输入 focus 强化 | `focus:border-primary/40 focus:ring-4 focus:ring-primary/10` |
| 主动作 | `bg-primary text-primary-foreground rounded-full px-4 py-2.5 text-[13px] font-medium shadow-sm hover:bg-primary/90` |
| 次级动作 | `bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-[13px] hover:bg-muted` |
| 危险动作 | `bg-danger text-white rounded-full hover:bg-danger/90 disabled:opacity-40` |
| 反向小块 | `bg-foreground text-background rounded-lg` |
| 主文本 | `text-foreground font-medium` 或 `text-foreground font-semibold` |
| 次文本 | `text-muted-foreground text-[12px]` 或 `text-[13px]` |
| 微标签 | `text-[11px] font-medium text-muted-foreground` |
| 状态 success | `border-success/25 bg-success/10 text-success` |
| 状态 warning | `border-warning/25 bg-warning/10 text-warning` |
| 状态 danger | `border-danger/25 bg-danger/10 text-danger` |
| 当前导航 | `bg-primary text-primary-foreground shadow-sm` |
| 普通导航 hover | `text-muted-foreground hover:text-foreground hover:bg-muted` |
| 行 hover | `hover:bg-muted transition-colors` |
| 紧凑网格 | `grid gap-3` / `grid gap-4` |
| 弹窗 overlay | `fixed inset-0 z-50 bg-black/30 backdrop-blur-sm` |
| 弹窗面板 | `bg-card rounded-2xl border border-border p-6 shadow-xl max-h-[90vh] overflow-auto` |
| 页面进入 | `animate-fade-in` |
| 全局键盘焦点 | `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` |

Tailwind 使用顺序建议：**布局 → 尺寸 → surface → border/radius → 文本 → 状态 → 动效**。这样同一个组件在不同页面之间 diff 时更容易理解，也让 AI 能以固定结构生成稳定输出。
