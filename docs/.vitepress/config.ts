import { defineConfig } from "vitepress";

export default defineConfig({
  // GitHub Pages repo base path
  base: "/",
  cleanUrls: false,
  markdown: {
    // Native lazy-loading for all markdown images (<img loading="lazy" />)
    image: {
      lazyLoading: true,
    },
  },
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
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
          "https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800;900&display=swap",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.png",
    // Enable page outline (display heading hierarchy within pages)
    outline: {
      level: [2, 6], // Display h2 to h6 headings
      label: "Page Outline",
    },
    /**
     * 本地搜索（不依赖 Algolia 等外部服务）
     * - 适合部署到 S3 / 内网环境
     * - 多语言：根据当前语言切换按钮文案/弹窗文案
     */
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "Search",
                buttonAriaLabel: "Search",
              },
              modal: {
                noResultsText: "No results for",
                resetButtonTitle: "Reset",
                footer: {
                  selectText: "to select",
                  navigateText: "to navigate",
                  closeText: "to close",
                },
              },
            },
          },
          cn: {
            translations: {
              button: {
                buttonText: "搜索",
                buttonAriaLabel: "搜索",
              },
              modal: {
                noResultsText: "未找到结果",
                resetButtonTitle: "重置",
                footer: {
                  selectText: "选择",
                  navigateText: "导航",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
  },
  locales: {
    root: {
      label: "English",
      link: "/",
      lang: "en-US",
      title: "Folding Bracket Installation Manual",
      description: "Folding Bracket Installation Manual - User guide and operational manual.",
      themeConfig: {
        siteTitle: "Folding Bracket Manual",
        nav: [
          {
            text: "Installation Overview",
            link: "/manuals/purpose.html",
            activeMatch: "^/manuals/(purpose|materials-tools|expected-results)",
          },
          {
            text: "Preparation",
            link: "/manuals/environment.html",
            activeMatch: "^/manuals/(environment|pre-installation-check|personnel-requirements)",
          },
          {
            text: "Installation Steps",
            link: "/manuals/step1-fixed-frame.html",
            activeMatch: "^/manuals/step",
          },
          {
            text: "Debugging and Acceptance",
            link: "/manuals/stability-check.html",
            activeMatch: "^/manuals/(stability-check|motion-test)",
          },
          {
            text: "Appendix",
            link: "/manuals/prototype-images.html",
            activeMatch: "^/manuals/(prototype-images|material-list)",
          },
        ],
        sidebar: {
          // Installation Overview pages
          "/manuals/purpose": [
            {
              text: "Installation Overview",
              collapsed: false,
              items: [
                { text: "Purpose and Importance of Installation Manual", link: "/manuals/purpose.html" },
                { text: "Materials and Tools List", link: "/manuals/materials-tools.html" },
                { text: "Expected Results and Effects", link: "/manuals/expected-results.html" },
              ],
            },
          ],
          "/manuals/materials-tools": [
            {
              text: "Installation Overview",
              collapsed: false,
              items: [
                { text: "Purpose and Importance of Installation Manual", link: "/manuals/purpose.html" },
                { text: "Materials and Tools List", link: "/manuals/materials-tools.html" },
                { text: "Expected Results and Effects", link: "/manuals/expected-results.html" },
              ],
            },
          ],
          "/manuals/expected-results": [
            {
              text: "Installation Overview",
              collapsed: false,
              items: [
                { text: "Purpose and Importance of Installation Manual", link: "/manuals/purpose.html" },
                { text: "Materials and Tools List", link: "/manuals/materials-tools.html" },
                { text: "Expected Results and Effects", link: "/manuals/expected-results.html" },
              ],
            },
          ],
          // Preparation pages
          "/manuals/environment": [
            {
              text: "Preparation",
              collapsed: false,
              items: [
                { text: "Ensure Suitable Installation Environment", link: "/manuals/environment.html" },
                { text: "Pre-installation Inspection and Testing", link: "/manuals/pre-installation-check.html" },
                { text: "Personnel Requirements", link: "/manuals/personnel-requirements.html" },
              ],
            },
          ],
          "/manuals/pre-installation-check": [
            {
              text: "Preparation",
              collapsed: false,
              items: [
                { text: "Ensure Suitable Installation Environment", link: "/manuals/environment.html" },
                { text: "Pre-installation Inspection and Testing", link: "/manuals/pre-installation-check.html" },
                { text: "Personnel Requirements", link: "/manuals/personnel-requirements.html" },
              ],
            },
          ],
          "/manuals/personnel-requirements": [
            {
              text: "Preparation",
              collapsed: false,
              items: [
                { text: "Ensure Suitable Installation Environment", link: "/manuals/environment.html" },
                { text: "Pre-installation Inspection and Testing", link: "/manuals/pre-installation-check.html" },
                { text: "Personnel Requirements", link: "/manuals/personnel-requirements.html" },
              ],
            },
          ],
          // Installation Steps pages
          "/manuals/step": [
            {
              text: "Installation Steps",
              collapsed: false,
              items: [
                { text: "Step 1 - Fixed Frame Assembly", link: "/manuals/step1-fixed-frame.html" },
                { text: "Step 2 - Combined Frame Assembly", link: "/manuals/step2-combined-frame.html" },
                { text: "Step 3 - Assembly of Fixed Frame and Combined Frame", link: "/manuals/step3-assembly.html" },
                { text: "Step 4 - Connecting Rod Assemblies to Component Beam Frame", link: "/manuals/step4-rod-assembly.html" },
                { text: "Step 5 - Install PV Modules", link: "/manuals/step5-pv-modules.html" },
                { text: "Step 6 - Install PV Module Series Wiring", link: "/manuals/step6-wiring.html" },
                { text: "Step 7 - Folding and Packing", link: "/manuals/step7-folding.html" },
              ],
            },
          ],
          // Debugging and Acceptance pages
          "/manuals/stability-check": [
            {
              text: "Debugging and Acceptance",
              collapsed: false,
              items: [
                { text: "Structural Stability Check", link: "/manuals/stability-check.html" },
                { text: "Motion Test", link: "/manuals/motion-test.html" },
              ],
            },
          ],
          "/manuals/motion-test": [
            {
              text: "Debugging and Acceptance",
              collapsed: false,
              items: [
                { text: "Structural Stability Check", link: "/manuals/stability-check.html" },
                { text: "Motion Test", link: "/manuals/motion-test.html" },
              ],
            },
          ],
          // Appendix pages
          "/manuals/prototype-images": [
            {
              text: "Appendix",
              collapsed: false,
              items: [
                { text: "Prototype Assembly Images", link: "/manuals/prototype-images.html" },
                { text: "Material List", link: "/manuals/material-list.html" },
              ],
            },
          ],
          "/manuals/material-list": [
            {
              text: "Appendix",
              collapsed: false,
              items: [
                { text: "Prototype Assembly Images", link: "/manuals/prototype-images.html" },
                { text: "Material List", link: "/manuals/material-list.html" },
              ],
            },
          ],
        },
        footer: {
          message: "Internal Use Only · Do Not Distribute",
          copyright: "(c) Monarch Edge",
        },
      },
    },
    cn: {
      label: "简体中文",
      link: "/cn/",
      lang: "zh-CN",
      title: "折叠支架安装手册",
      description: "折叠支架安装手册使用说明与操作指引",
      themeConfig: {
        siteTitle: "折叠支架安装手册",
        outline: {
          level: [2, 6],
          label: "页面目录",
        },
        nav: [
          {
            text: "安装概况",
            link: "/cn/manuals/purpose.html",
            activeMatch: "^/cn/manuals/(purpose|materials-tools|expected-results)",
          },
          {
            text: "准备工作",
            link: "/cn/manuals/environment.html",
            activeMatch: "^/cn/manuals/(environment|pre-installation-check|personnel-requirements)",
          },
          {
            text: "安装步骤",
            link: "/cn/manuals/step1-fixed-frame.html",
            activeMatch: "^/cn/manuals/step",
          },
          {
            text: "调试与验收",
            link: "/cn/manuals/stability-check.html",
            activeMatch: "^/cn/manuals/(stability-check|motion-test)",
          },
          {
            text: "附件",
            link: "/cn/manuals/prototype-images.html",
            activeMatch: "^/cn/manuals/(prototype-images|material-list)",
          },
        ],
        sidebar: {
          // 安装概况相关页面 - 使用路径前缀匹配
          "/cn/manuals/purpose": [
            {
              text: "安装概况",
              collapsed: false,
              items: [
                { text: "安装手册的目的及重要性", link: "/cn/manuals/purpose.html" },
                { text: "材料和工具清单", link: "/cn/manuals/materials-tools.html" },
                { text: "安装的预期结果和效果", link: "/cn/manuals/expected-results.html" },
              ],
            },
          ],
          "/cn/manuals/materials-tools": [
            {
              text: "安装概况",
              collapsed: false,
              items: [
                { text: "安装手册的目的及重要性", link: "/cn/manuals/purpose.html" },
                { text: "材料和工具清单", link: "/cn/manuals/materials-tools.html" },
                { text: "安装的预期结果和效果", link: "/cn/manuals/expected-results.html" },
              ],
            },
          ],
          "/cn/manuals/expected-results": [
            {
              text: "安装概况",
              collapsed: false,
              items: [
                { text: "安装手册的目的及重要性", link: "/cn/manuals/purpose.html" },
                { text: "材料和工具清单", link: "/cn/manuals/materials-tools.html" },
                { text: "安装的预期结果和效果", link: "/cn/manuals/expected-results.html" },
              ],
            },
          ],
          // 准备工作相关页面
          "/cn/manuals/environment": [
            {
              text: "准备工作",
              collapsed: false,
              items: [
                { text: "确保安装环境适宜", link: "/cn/manuals/environment.html" },
                { text: "安装前的检查和测试", link: "/cn/manuals/pre-installation-check.html" },
                { text: "人员职责要求", link: "/cn/manuals/personnel-requirements.html" },
              ],
            },
          ],
          "/cn/manuals/pre-installation-check": [
            {
              text: "准备工作",
              collapsed: false,
              items: [
                { text: "确保安装环境适宜", link: "/cn/manuals/environment.html" },
                { text: "安装前的检查和测试", link: "/cn/manuals/pre-installation-check.html" },
                { text: "人员职责要求", link: "/cn/manuals/personnel-requirements.html" },
              ],
            },
          ],
          "/cn/manuals/personnel-requirements": [
            {
              text: "准备工作",
              collapsed: false,
              items: [
                { text: "确保安装环境适宜", link: "/cn/manuals/environment.html" },
                { text: "安装前的检查和测试", link: "/cn/manuals/pre-installation-check.html" },
                { text: "人员职责要求", link: "/cn/manuals/personnel-requirements.html" },
              ],
            },
          ],
          // 安装步骤相关页面 - 使用路径前缀匹配所有step开头的文件
          "/cn/manuals/step": [
            {
              text: "安装步骤",
              collapsed: false,
              items: [
                { text: "步骤1——固定框架组装", link: "/cn/manuals/step1-fixed-frame.html" },
                { text: "步骤2——组合框架组装", link: "/cn/manuals/step2-combined-frame.html" },
                { text: "步骤3——组装固定框架与组合框架", link: "/cn/manuals/step3-assembly.html" },
                { text: "步骤4——各轴杆组合连接组件梁框架", link: "/cn/manuals/step4-rod-assembly.html" },
                { text: "步骤5——安装光伏组件", link: "/cn/manuals/step5-pv-modules.html" },
                { text: "步骤6——安装光伏组件串联线", link: "/cn/manuals/step6-wiring.html" },
                { text: "步骤7——折叠打包", link: "/cn/manuals/step7-folding.html" },
              ],
            },
          ],
          // 调试与验收相关页面
          "/cn/manuals/stability-check": [
            {
              text: "调试与验收",
              collapsed: false,
              items: [
                { text: "结构稳定性检查", link: "/cn/manuals/stability-check.html" },
                { text: "运动测试", link: "/cn/manuals/motion-test.html" },
              ],
            },
          ],
          "/cn/manuals/motion-test": [
            {
              text: "调试与验收",
              collapsed: false,
              items: [
                { text: "结构稳定性检查", link: "/cn/manuals/stability-check.html" },
                { text: "运动测试", link: "/cn/manuals/motion-test.html" },
              ],
            },
          ],
          // 附件相关页面
          "/cn/manuals/prototype-images": [
            {
              text: "附件",
              collapsed: false,
              items: [
                { text: "打样装配图片", link: "/cn/manuals/prototype-images.html" },
                { text: "物料清单", link: "/cn/manuals/material-list.html" },
              ],
            },
          ],
          "/cn/manuals/material-list": [
            {
              text: "附件",
              collapsed: false,
              items: [
                { text: "打样装配图片", link: "/cn/manuals/prototype-images.html" },
                { text: "物料清单", link: "/cn/manuals/material-list.html" },
              ],
            },
          ],
        },
        footer: {
          message: "内部资料 · 请勿外传",
          copyright: "(c) Monarch Edge",
        },
      },
    },
  },
});
