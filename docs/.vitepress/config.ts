import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-CN",
  title: "Monarch Cloud 用户手册",
  description: "Monarch Cloud 使用说明与操作指引",
  // GitHub Pages repo base path
  base: "/Internal-manual/",
  head: [
    ['link', { rel: 'icon', href: './logo.png' }],
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
    logo: "/logo.png",
    siteTitle: "Monarch Cloud 用户手册",
    nav: [
      { text: "基础认知", link: "/manuals/basic-knowledge/overview" },
      { text: "核心功能", link: "/manuals/core-features/login/" },
      { text: "系统配置", link: "/manuals/system-config/channels/" },
      { text: "常见问题", link: "/manuals/faq/" },
    ],
    sidebar: {
      "/manuals/basic-knowledge/": [
        {
          text: "基础认知",
          collapsed: false,
          items: [
            { text: "平台概览", link: "/manuals/basic-knowledge/overview" },
            { text: "界面结构", link: "/manuals/basic-knowledge/ui-structure" },
            {
              text: "通道概念",
              link: "/manuals/basic-knowledge/system-concepts-channel/",
              collapsed: true,
              items: [
                {
                  text: "通道",
                  link:
                    "/manuals/basic-knowledge/system-concepts-channel/channel",
                },
                {
                  text: "四遥",
                  link:
                    "/manuals/basic-knowledge/system-concepts-channel/four-remote",
                },
                {
                  text: "通道点位",
                  link:
                    "/manuals/basic-knowledge/system-concepts-channel/channel-points",
                },
                {
                  text: "通道点位映射",
                  link:
                    "/manuals/basic-knowledge/system-concepts-channel/channel-mappings",
                },
              ],
            },
            {
              text: "设备实例概念",
              link: "/manuals/basic-knowledge/system-concepts-instance/",
              collapsed: true,
              items: [
                {
                  text: "产品",
                  link:
                    "/manuals/basic-knowledge/system-concepts-instance/product",
                },
                {
                  text: "实例",
                  link:
                    "/manuals/basic-knowledge/system-concepts-instance/instance",
                },
                {
                  text: "实例点位",
                  link:
                    "/manuals/basic-knowledge/system-concepts-instance/instance-points",
                },
                {
                  text: "实例点位路由",
                  link:
                    "/manuals/basic-knowledge/system-concepts-instance/instance-routing",
                },
              ],
            },
            {
              text: "规则概念",
              link: "/manuals/basic-knowledge/system-concepts-rule/",
              collapsed: true,
              items: [
                {
                  text: "规则",
                  link: "/manuals/basic-knowledge/system-concepts-rule/rule",
                },
                {
                  text: "规则链路",
                  link:
                    "/manuals/basic-knowledge/system-concepts-rule/rule-chain",
                },
              ],
            },
            { text: "术语表", link: "/manuals/basic-knowledge/glossary" },
          ],
        },
      ],
      "/manuals/core-features/": [
        {
          text: "核心功能",
          collapsed: false,
          items: [
            {
              text: "登录页面",
              link: "/manuals/core-features/login/",
            },
            {
              text: "首页",
              link: "/manuals/core-features/home/",
            },
            {
              text: "设备页面",
              link: "/manuals/core-features/devices/",
              collapsed: true,
              items: [
                { text: "PV", link: "/manuals/core-features/devices/pv" },
                {
                  text: "Battery",
                  link: "/manuals/core-features/devices/battery",
                },
                {
                  text: "Diesel Generator",
                  link:
                    "/manuals/core-features/devices/diesel-generator",
                },
                {
                  text: "Meter1",
                  link: "/manuals/core-features/devices/meter1",
                },
                {
                  text: "Meter2",
                  link: "/manuals/core-features/devices/meter2",
                },
              ],
            },
            {
              text: "告警页面",
              link: "/manuals/core-features/alarm/",
              collapsed: true,
              items: [
                {
                  text: "Current Records",
                  link: "/manuals/core-features/alarm/current-records",
                },
                {
                  text: "History Records",
                  link: "/manuals/core-features/alarm/history-records",
                },
              ],
            },
            {
              text: "控制页面",
              link: "/manuals/core-features/control/",
              collapsed: true,
              items: [
                {
                  text: "Control Record",
                  link: "/manuals/core-features/control/control-record",
                },
              ],
            },
            {
              text: "统计页面",
              link: "/manuals/core-features/statistics/",
              collapsed: true,
              items: [
                {
                  text: "Overview",
                  link: "/manuals/core-features/statistics/overview",
                },
                {
                  text: "Curves",
                  link: "/manuals/core-features/statistics/curves",
                },
                {
                  text: "Operation Log",
                  link: "/manuals/core-features/statistics/operation-log",
                },
                {
                  text: "Running Log",
                  link: "/manuals/core-features/statistics/running-log",
                },
              ],
            },
          ],
        },
      ],
      "/manuals/system-config/": [
        {
          text: "系统配置",
          collapsed: false,
          items: [
            {
              text: "通道配置",
              link: "/manuals/system-config/channels/",
              collapsed: true,
              items: [
                {
                  text: "通道管理",
                  link: "/manuals/system-config/channels/channel-ops",
                },
                {
                  text: "通道点位配置",
                  link: "/manuals/system-config/channels/point-ops",
                },
                {
                  text: "通道点位映射配置",
                  link: "/manuals/system-config/channels/mapping-ops",
                },
              ],
            },
            {
              text: "设备实例配置",
              link: "/manuals/system-config/device-instances/",
              collapsed: true,
              items: [
                {
                  text: "实例管理",
                  link:
                    "/manuals/system-config/device-instances/instance-ops",
                },
                {
                  text: "实例点位配置",
                  link:
                    "/manuals/system-config/device-instances/instance-point-ops",
                },
                {
                  text: "实例点位路由配置",
                  link:
                    "/manuals/system-config/device-instances/instance-routing-ops",
                },
              ],
            },
            {
              text: "规则配置",
              link: "/manuals/system-config/rules/",
              collapsed: true,
              items: [
                {
                  text: "规则操作",
                  link: "/manuals/system-config/rules/rule-ops",
                },
                {
                  text: "规则链路操作",
                  link: "/manuals/system-config/rules/rule-chain-ops",
                },
              ],
            },
          ],
        },
      ],
      "/manuals/faq/": [
        {
          text: "常见问题",
          collapsed: true,
          items: [{ text: "FAQ", link: "/manuals/faq/" }],
        },
      ],
      "/modules/": [
        {
          text: "功能模块",
          collapsed: false,
          items: [
            { text: "模块总览", link: "/modules/overview" },
            { text: "设备监控", link: "/modules/device-monitoring" },
            { text: "告警中心", link: "/modules/alarms" },
            { text: "控制管理", link: "/modules/control" },
            { text: "统计分析", link: "/modules/statistics" },
          ],
        },
      ],
    },
    footer: {
      message: "内部资料 · 请勿外传",
      copyright: "(c) Monarch Cloud",
    },
  },
});
