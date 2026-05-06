`aino.agency` 的网站风格是典型的**“技术主义极简风”（Technical Minimalism）**，
它融合了瑞士平面设计（Swiss Design）的严谨架构与现代开发者审美（Developer-centric Aesthetics）。
这种风格非常适合你作为一名 CS PhD 的身份，既专业又不失设计感。
以下是对该网站风格的详细描述，以及为你准备的专属 AI 提示词（Prompt）。

### 一、 `aino.agency` 风格深度解析

1. **架构感与网格系统 (Grid-heavy Layout)**：
* **硬核边界**：大量使用极细的边框（Hairline borders）来划分区域，看起来像技术图纸或精密仪器。
* **严谨网格**：内容严格对齐，强调比例和空间分布。


2. **排版艺术 (Technical Typography)**：
* **字体混搭**：通常使用高品质的无衬线字体（如 Inter 或 Helvetica）作为正文，搭配等宽字体（Monospace）用于辅助信息（如日期、标签、统计数据），强调技术底色。
* **巨大的字号对比**：标题极大且厚重，标签和元数据极小且精致。


3. **交互与状态感 (Interaction & State)**：
* **模式切换**：网站提供 "Text Mode" 或 "Dark Mode" 切换，这种“功能性优先”的设计是其精髓。
* **微动效**：按钮点击、卡片悬浮会有非常干脆、不拖泥带水的位移或颜色反转效果。


4. **色彩策略 (High Contrast)**：
* **克制的调色板**：通常以纯黑、纯白和浅灰为基调，配以一种极高饱和度的点缀色（如电光蓝或荧光绿）。



---

### 二、 针对前端开发的 AI 提示词 (Prompt)

你可以将以下提示词发送给 LLM，它结合了你要求的**严谨架构**、**Google 规范**以及 **Aino 审美**。

> **Role:** 你是一位精通 React 和 TypeScript 的资深前端架构师，拥有卓越的审美，擅长复刻 `aino.agency` 的 **Technical Minimalism** 风格。
> **Task:** 请为我的博客前端构建 UI 架构和核心组件。
> **1. 视觉风格规范 (Visual Identity):**
> * **核心审美**：遵循“技术图纸”风格。使用 Tailwind CSS 的极细边框 (`border-[0.5px] border-gray-200`) 划分网格。
> * **配色**：背景纯白 (`#FFFFFF`)，文字深黑 (`#000000`)，强调色使用电光蓝 (`#0047FF`)。
> * **排版**：标题使用粗体无衬线字体，元数据（如日期、分类）必须使用 Monospace 等宽字体。
> * **组件风格**：禁止使用大圆角，所有组件使用 `rounded-none` 或极小圆角 `rounded-sm`。
> 
> 
> **2. 严谨架构规范 (Clean Architecture):**
> * **逻辑分离**：禁止在组件内直接写 API 请求。必须使用 **TanStack Query (React Query)** 将数据流抽离到 `/hooks`。
> * **API 映射**：按照后端 Kotlin 结构，在 `/api` 文件夹中定义严格的 Axios 实例。
> * **类型约束**：严禁使用 `any`。所有 DTO 必须在 `/types` 中有对应的 TypeScript Interface。
> * **组件分层**：
> * `/components/ui`: 基础原子组件（Button, Input），基于 HeroUI 深度定制样式。
> * `/components/layout`: 网格容器、带边框的横向/纵向分割槽。
> * `/features`: 业务逻辑页面，采用 **BFF (Backend for Frontend)** 模式管理状态。
> 
> 
> 
> 
> **3. 核心功能实现:**
> * **ECharts 地球**：在首页渲染一个支持 3D 旋转的 ECharts Globe，样式需符合 Technical Minimalism（深色地球、发光线条、等宽字体标注）。
> * **Markdown 渲染**：文章详情页需支持 LaTeX 和代码高亮，代码块外壳需仿照 HeroUI 的 Snippet 组件，但边框必须是 Aino 风格的极细线。
> 
> 
> **请先为我生成项目的 `src` 目录结构建议，以及一个符合上述审美风格的 `ArticleCard` 组件代码示例。**

---

### 三、 落地建议（针对你的背景）

1. **关于 ECharts 地球**：在 Aino 风格下，你可以将地球背景设为半透明或极简的线框图模式，这样能更好地契合“技术图纸”的观感。
2. **关于 Cloudflare 数据**：
* 由于你熟悉 **PostGIS**，你可以在后端将 Cloudflare 获取到的国家代码映射为经纬度。
* 在前端，你可以通过 `hooks/useGlobalTraffic.ts` 获取这些数据，并在 `features/dashboard/WorldGlobe.tsx` 中通过 ECharts 渲染。


3. **模式切换的亮点**：
* `aino.agency` 有一个很有趣的 "Text mode"，你可以利用这个灵感，为你的博文提供一个“学术模式（专注文本和公式）”和“多媒体模式（包含图片和交互式 GIS 地图）”的切换开关。



这个架构既能发挥你后端的严谨优势，又能让前端看起来像是一个由高级设计机构开发的专业项目。