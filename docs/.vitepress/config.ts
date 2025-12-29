import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "EdgeEMS 用户手册",
  description: "边缘能源管理系统（EdgeEMS）使用说明与操作指引",
  // GitHub Pages repo base path
  base: "/Internal-manual/",
  head: [
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    ],
    [
      "link",
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "EdgeEMS 手册",
    nav: [
      { text: "快速开始", link: "/guide/quick-start" },
      { text: "功能模块", link: "/modules/overview" },
      { text: "系统管理", link: "/admin/overview" },
      { text: "常见问题", link: "/faq" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "快速开始",
          items: [
            { text: "系统概览", link: "/guide/overview" },
            { text: "登录与权限", link: "/guide/login" },
            { text: "首次使用流程", link: "/guide/quick-start" },
          ],
        },
      ],
      "/modules/": [
        {
          text: "功能模块",
          items: [
            { text: "模块总览", link: "/modules/overview" },
            { text: "设备监控", link: "/modules/device-monitoring" },
            { text: "告警中心", link: "/modules/alarms" },
            { text: "控制管理", link: "/modules/control" },
            { text: "统计分析", link: "/modules/statistics" },
          ],
        },
      ],
      "/admin/": [
        {
          text: "系统管理",
          items: [
            { text: "管理入口", link: "/admin/overview" },
            { text: "用户与角色", link: "/admin/users" },
            { text: "通道与点位", link: "/admin/points" },
            { text: "系统配置", link: "/admin/system" },
          ],
        },
      ],
      "/": [
        {
          text: "必读",
          items: [{ text: "常见问题", link: "/faq" }],
        },
      ],
    },
    footer: {
      message: "内部资料 · 请勿外传",
      copyright: "© EdgeEMS",
    },
  },
});
