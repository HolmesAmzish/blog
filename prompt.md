我需要创建一个我自己的博客

目前技术栈

后端 spring boot, spring security, spring data jpa, PostgreSQL
前端 react，渲染markdown，latex和代码高亮的库，以及 charts，使用 tailwindcss 如果需要可以使用 shodcn 组件库
通过 gradle 管理前后端模块

## 功能需求

1. 后端管理功能，我的旧版博客使用 wordpress 构建，要求后端功能能够复刻 wordpress 的详细功能。
   - 通过上传 markdown 格式的文件来上传更新文章
   - 有基本后台管理系统
   - 文章有标签，类别，语言
   - 良好的图片资源管理
2. 前端插件，包括代码高亮，markdown 解析以及 latex 解析等基本功能。
3. 前端路由，如果使用react我可能需要编译成静态文件，但是这样可能会导致路由与 spring boot mvc 出现冲突和复杂的路由管理。给出解决方案，在开发阶段可以暂时先不管直接使用react前后端分离
4. 网站要有语言系统，允许英语中文两个版本的网站系统
5. 添加业务日志功能，并保存日志到数据库中
6. 添加全局异常处理，创建global exception，并可以根据业务创建特殊异常类


## 当前进度

### 已完成
- [x] Gradle 多模块项目结构搭建
- [x] 后端 Spring Boot 项目初始化（Spring Boot 4.0.3, Kotlin 2.2.21, Java 21）
- [x] 前端 React + Vite + TypeScript 项目初始化
- [x] 数据库配置（PostgreSQL: 192.168.0.190:5432/blog）
- [x] 敏感信息管理（application-local.properties 不上传到 git）

### 进行中
- [ ] 后端基础架构搭建
  - [ ] 实体类设计（Article, Tag, Category, User 等）
  - [ ] Repository 层
  - [ ] Service 层
  - [ ] Controller 层（REST API）
  - [ ] Spring Security 配置
- [ ] 前端基础架构搭建
  - [ ] 安装 tailwindcss
  - [ ] 安装 markdown/latex/代码高亮库
  - [ ] 路由配置
  - [ ] 基础组件

### 待办
- [ ] 文章管理功能
- [ ] 图片资源管理
- [ ] 国际化支持（中英文）
- [ ] 后台管理系统
- [ ] 前端页面开发

---

你需要根据当前进度修改更新这个文件以构建长期记忆来优化 LLM 的上下文（本行不允许更改，传递给下一轮对话）
