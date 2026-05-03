/**
 * Translations for the application
 * Supports English and Chinese
 */

//English translations
export const en = {
  app: {
    title: 'ARORMS',
    subtitle: 'BLOG',
  },
  nav: {
    home: 'HOME',
    articles: 'ARTICLES',
    archive: 'ARCHIVE',
    about: 'ABOUT',
    toggleMenu: 'Toggle menu',
  },
  footer: {
    brandDescription: 'A technical blog exploring software architecture, distributed systems, and the art of clean code.',
    navigation: 'NAVIGATION',
    connect: 'CONNECT',
    copyright: 'ALL RIGHTS RESERVED.',
    builtWith: 'BUILT WITH REACT + SPRING BOOT',
    github: 'GitHub',
    x: 'X',
    email: 'Email',
  },
  home: {
    systemInit: 'SYSTEM.INIT()',
    heroDescription: 'Exploring the intersection of software architecture, distributed systems, and elegant code.',
    readArticles: 'READ ARTICLES',
    viewArchive: 'VIEW ARCHIVE',
    latestArticles: 'LATEST ARTICLES',
    viewAll: 'VIEW ALL',
    stats: {
      articles: 'ARTICLES',
      categories: 'CATEGORIES',
      tags: 'TAGS',
      views: 'VIEWS',
    },
  },
  articles: {
    allArticles: 'ALL ARTICLES',
    filterByCategory: 'FILTER BY CATEGORY',
    all: 'ALL',
    noArticles: 'NO ARTICLES FOUND',
    showing: 'SHOWING',
    of: 'OF',
    articles: 'ARTICLES',
    views: 'VIEWS',
    tags: 'TAGS',
    noContent: 'NO CONTENT AVAILABLE',
    error: 'ERROR',
    notFound: 'Article not found',
    backToArticles: 'BACK TO ARTICLES',
  },
  articleDetail: {
    category: 'Category',
    published: 'Published',
    views: 'Views',
    author: 'Author',
    tags: 'TAGS',
    noContent: 'NO CONTENT AVAILABLE',
    error: 'ERROR',
    notFound: 'Article not found',
    backToArticles: 'BACK TO ARTICLES',
  },
  archive: {
    archive: 'ARCHIVE',
    noData: 'No archive data available',
    uncategorized: 'UNCATEGORIZED',
  },
  about: {
    about: 'ABOUT',
    description: 'This is a technical blog built with React, TypeScript, Tailwind CSS, and Spring Boot. It features a clean, minimal design inspired by technical documentation and modern web aesthetics.',
  },
  404: {
    title: '404',
    subtitle: 'PAGE NOT FOUND',
    goHome: 'GO HOME',
  },
  language: {
    zh: '中文',
    en: 'English',
    switchToZh: 'Switch to 中文',
    switchToEn: 'Switch to English',
  },
};

// Chinese translations
export const zh = {
  app: {
    title: 'ARORMS',
    subtitle: '博客',
  },
  nav: {
    home: '首页',
    articles: '文章',
    archive: '归档',
    about: '关于',
    toggleMenu: '切换菜单',
  },
  footer: {
    brandDescription: '探讨软件架构、分布式系统与优雅代码的艺术和技术博客。',
    navigation: '导航',
    connect: '联系',
    copyright: '版权所有。',
    builtWith: '构建于 React + Spring Boot',
    github: 'GitHub',
    x: 'X',
    email: '邮箱',
  },
  home: {
    systemInit: '系统初始化',
    heroDescription: '探索软件架构、分布式系统与优雅代码的交汇点。',
    readArticles: '阅读文章',
    viewArchive: '查看归档',
    latestArticles: '最新文章',
    viewAll: '查看全部',
    stats: {
      articles: '文章',
      categories: '分类',
      tags: '标签',
      views: '浏览量',
    },
  },
  articles: {
    allArticles: '所有文章',
    filterByCategory: '按分类筛选',
    all: '全部',
    noArticles: '暂无文章',
    showing: '显示',
    of: '篇，共',
    articles: '篇文章',
    views: '浏览量',
    tags: '标签',
    noContent: '暂无内容',
    error: '错误',
    notFound: '文章未找到',
    backToArticles: '返回文章列表',
  },
  articleDetail: {
    category: '分类',
    published: '发布于',
    views: '浏览量',
    author: '作者',
    tags: '标签',
    noContent: '暂无内容',
    error: '错误',
    notFound: '文章未找到',
    backToArticles: '返回文章列表',
  },
  archive: {
    archive: '归档',
    noData: '暂无归档数据',
    uncategorized: '未分类',
  },
  about: {
    about: '关于',
    description: '这是一个使用 React、TypeScript、Tailwind CSS 和 Spring Boot 构建的技术博客。采用简洁、极简的设计风格，灵感来源于技术文档和现代网页美学。',
  },
  404: {
    title: '404',
    subtitle: '页面未找到',
    goHome: '返回首页',
  },
  language: {
    zh: '中文',
    en: 'English',
    switchToZh: '切换到中文',
    switchToEn: 'Switch to English',
  },
};

// Type definition for translation keys
export type Translations = typeof en;
