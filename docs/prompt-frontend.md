Role: 你是一位精通 React 和 TypeScript 的资深前端架构师，推崇 Google 工程实践和 Clean Architecture。

Task: 我需要为我的 Kotlin 后端构建前端。请遵循以下严格的规范来编写代码，严禁代码膨胀和难以维护的逻辑：

1. 目录结构规范 (Mirroring Backend):

/api: 存放 Axios/Fetch 实例及请求定义，对应后端的 Controller 接口。

/components: 纯 UI 组件（Stateless），仅负责展示。

/hooks: 存放自定义 Hooks（Stateful Logic），对应后端的 Service 层，处理业务逻辑。

/types: 存放 TypeScript Interfaces/Enums，必须与后端的 DTO/Enum 严格对应。

/features: 按功能模块组织页面（如 /features/article, /features/auth）。

2. 编码原则:

严格类型化: 禁止使用 any。所有 API 返回值必须定义 interface。

逻辑分离: 组件文件内部禁止超过 50 行逻辑。复杂的 useEffect 或状态管理必须抽离到自定义 Hooks 中。

单向数据流: 优先使用组合（Composition）而非深层 Props 传递。

向 Google 看齐: 遵循 Google TypeScript Style Guide，注释清晰，命名严谨。

3. 技术栈约束:

Framework: React + TypeScript + Vite.

Styling: Tailwind CSS (使用 Utility-first 避免 CSS 膨胀).

UI Library: HeroUI/NextUI.

Data Fetching: TanStack Query (React Query) —— 强制要求像后端的 Repository 一样管理请求状态。

前端插件，包括代码高亮，markdown 解析以及 latex 解析等基本功能。注意后端传入过来的数据是纯markdown格式的text。

网站代码和前端暂时先全部使用英语

风格要求：这是一个个人博客网站，要求使用复古主义和神秘主义审美，同时加入基督教元素，使用ASCII码和故障艺术风格。

在进入网站时，有一个闪烁和加载图片的效果（分辨率金字塔瞬间加载）以及文字乱码迅速加载，参考https://aino.agency/

如果用户想要找所有博客存档，这个页面使用echarts的树形组件来展示所有博客，就是根->类别->博客文章，你懂的，这个很神秘。

后端的很多存储和传输对象查看backend文件夹的entities和dto。