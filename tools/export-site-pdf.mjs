import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { chromium } from "playwright";
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
} from "pdf-lib";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "docs", ".vitepress", "dist");

const PORT = Number(process.env.PDF_PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;

const OUT_EN = path.join(repoRoot, "docs", "public", "downloads", "en", "monarch-edge-manual.pdf");
const OUT_ZH = path.join(repoRoot, "docs", "public", "downloads", "zh-cn", "monarch-edge-manual.pdf");

// For PDF export we want non-home pages to be pure white (no site gradient background).
// Home page keeps its original visuals.
const EXPORT_NON_HOME_WHITE_BG_CSS = `
  html, body {
    background: #fff !important;
    background-image: none !important;
  }

  /* In case theme adds gradients via pseudo elements */
  body::before, body::after {
    content: none !important;
    display: none !important;
  }

  #app, .VPApp, .VPContent, .VPDoc, .vp-doc {
    background: #fff !important;
    background-image: none !important;
  }
`;

// Hide VitePress chrome for PDF output; keep only doc content.
// We inject this for EVERY page before printing because we render with `screen`
// media to preserve normal CSS variables/theme styles.
const EXPORT_ONLY_DOC_CSS = `
  /* Hide global chrome */
  .VPNav, .VPNavBar, .VPNavScreen, .VPLocalNav,
  .VPSidebar, .VPBackdrop, .VPFooter,
  .VPDocAside, .VPDocFooter,
  .VPDocFooterDivider, .VPDocFooterLink,
  .VPDocFooter .pager, .pager, .prev-next,
  .VPDoc .aside, .aside, .outline, .VPDocOutlineDropdown {
    display: none !important;
  }

  /* Make content full width */
  .VPContent, .VPDoc, .vp-doc {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }

  /* Make PDF text more readable */
  .vp-doc {
    font-size: 15px !important;
    line-height: 1.85 !important;
  }

  .vp-doc h1 { font-size: 34px !important; }
  .vp-doc h2 { font-size: 26px !important; }
  .vp-doc h3 { font-size: 20px !important; }
  .vp-doc h4 { font-size: 16px !important; }

  .vp-doc p,
  .vp-doc li {
    line-height: 1.9 !important;
  }

  .vp-doc code {
    font-size: 0.92em !important;
  }

  .vp-doc pre code {
    font-size: 0.9em !important;
  }

  /* Do not show/export the breadcrumb subtitle line */
  .mc-pdf-subtitle { display: none !important; }

  .VPContent {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .vp-doc.container, .vp-doc {
    max-width: none !important;
    width: auto !important;
  }

  /*
   * Pagination tuning
   *
   * "Long blank areas/pages" are usually caused by forcing large blocks
   * (tables/code blocks/quotes) to stay unbroken (`break-inside: avoid`).
   * When a block can't fit in the remaining space, it jumps to next page and
   * leaves a big empty gap behind.
   *
   * Strategy:
   * - Allow tables/code blocks/quotes to break across pages to reduce blanks.
   * - Keep images as non-breaking when possible.
   * - Repeat table headers when tables split.
   */
  table, pre, blockquote {
    break-inside: auto !important;
    page-break-inside: auto !important;
  }

  img {
    break-inside: avoid;
    page-break-inside: avoid;
    max-width: 100% !important;
    height: auto !important;
  }

  thead {
    display: table-header-group;
  }
`;

function pnpmCmd() {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      // On Windows, spawning *.cmd without a shell can throw EINVAL.
      shell: process.platform === "win32",
      ...opts,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

function startPreviewServer() {
  const cmd = pnpmCmd();
  // Pass args after -- to the underlying vitepress preview
  const args = ["-s", "docs:preview", "--", "--port", String(PORT), "--strictPort"];
  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return child;
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Preview server not ready: ${url}`);
}

async function isServerUp(url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

function walkHtml(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walkHtml(p));
    else if (name.toLowerCase().endsWith(".html")) out.push(p);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function isContentHtml(htmlRel) {
  const lower = htmlRel.toLowerCase();
  if (lower === "404.html") return false;
  if (lower.startsWith("assets/")) return false;
  return true;
}

function normalizeToHtmlPath(p) {
  if (!p) return "";
  let s = p;
  // ensure starts with /
  if (!s.startsWith("/")) s = "/" + s;
  // directory -> index.html
  if (s.endsWith("/")) s = s + "index.html";
  if (s === "/") s = "/index.html";
  if (s === "/cn") s = "/cn/index.html";
  if (s === "/cn/") s = "/cn/index.html";
  // cleanUrls is false in this project, but keep a fallback for links without .html
  if (!s.endsWith(".html") && !s.endsWith(".pdf") && !s.includes(".")) s = s + ".html";
  return s;
}

function parseVpSiteDataFromHtml(htmlText) {
  // window.__VP_SITE_DATA__=JSON.parse("....");
  const m = htmlText.match(/window\.__VP_SITE_DATA__=JSON\.parse\("([\s\S]*?)"\);/);
  if (!m) throw new Error("Cannot find __VP_SITE_DATA__ in built HTML.");
  const encoded = m[1];
  // The string is JSON encoded inside a JS string.
  const decoded = JSON.parse(`"${encoded}"`);
  return JSON.parse(decoded);
}

function buildOutlineTree(siteData, localeKey) {
  const locale = siteData.locales?.[localeKey];
  if (!locale?.themeConfig) return [];

  const nav = locale.themeConfig.nav || [];
  const sidebar = locale.themeConfig.sidebar || {};
  const sidebarKeys = Object.keys(sidebar);

  const matchSidebarKey = (link) => {
    const l = normalizeToHtmlPath(link);
    let best = "";
    for (const key of sidebarKeys) {
      if (l.startsWith(key) && key.length > best.length) best = key;
    }
    return best || null;
  };

  const toNode = (it) => ({
    title: it.text || "",
    link: it.link ? normalizeToHtmlPath(it.link) : "",
    children: Array.isArray(it.items) ? it.items.map(toNode) : [],
  });

  const navNodes = [];

  // Home first
  navNodes.push({
    title: localeKey === "cn" ? "首页" : "Home",
    link: normalizeToHtmlPath(localeKey === "cn" ? "/cn/index.html" : "/index.html"),
    children: [],
  });

  for (const n of nav) {
    const node = {
      title: n.text || "",
      link: n.link ? normalizeToHtmlPath(n.link) : "",
      children: [],
    };

    const key = n.link ? matchSidebarKey(n.link) : null;
    if (key) {
      const groups = sidebar[key] || [];
      for (const g of groups) {
        if (Array.isArray(g.items)) {
          node.children.push(...g.items.map(toNode));
        }
      }
    }

    navNodes.push(node);
  }

  return navNodes;
}

function buildBreadcrumbMap(outlineNodes) {
  const map = new Map();
  const walk = (nodes, stack) => {
    for (const n of nodes) {
      const nextStack = n.title ? [...stack, n.title] : [...stack];
      if (n.link) map.set(n.link, nextStack.join(" / "));
      if (n.children?.length) walk(n.children, nextStack);
    }
  };
  walk(outlineNodes, []);
  return map;
}

function countDescendants(nodes) {
  let c = 0;
  for (const n of nodes) {
    c += 1;
    if (n.children?.length) c += countDescendants(n.children);
  }
  return c;
}

function addPdfOutlines(pdfDoc, outlineNodes, pathToStartPage) {
  if (!outlineNodes?.length) return;

  const ctx = pdfDoc.context;
  const catalog = pdfDoc.catalog;

  // Create root outlines dict
  const outlinesDict = ctx.obj({});
  const outlinesRef = ctx.register(outlinesDict);

  outlinesDict.set(PDFName.of("Type"), PDFName.of("Outlines"));

  const createItems = (nodes, parentRef) => {
    let firstRef = null;
    let lastRef = null;
    let prevRef = null;

    for (const node of nodes) {
      const itemDict = ctx.obj({});
      const itemRef = ctx.register(itemDict);

      // Title (Unicode-safe)
      itemDict.set(PDFName.of("Title"), PDFHexString.fromText(node.title || ""));
      itemDict.set(PDFName.of("Parent"), parentRef);

      // Destination: try node.link, otherwise first child's link
      const destLink =
        node.link ||
        (node.children?.length ? node.children.find((c) => c.link)?.link || "" : "");
      const startPageIndex = destLink ? pathToStartPage.get(destLink) : null;
      if (typeof startPageIndex === "number") {
        const pageRef = pdfDoc.getPage(startPageIndex).ref;
        const dest = PDFArray.withContext(ctx);
        dest.push(pageRef);
        dest.push(PDFName.of("Fit"));
        itemDict.set(PDFName.of("Dest"), dest);
      }

      // Sibling links
      if (prevRef) itemDict.set(PDFName.of("Prev"), prevRef);
      if (prevRef) {
        const prevDict = ctx.lookup(prevRef, PDFDict);
        prevDict.set(PDFName.of("Next"), itemRef);
      }

      if (!firstRef) firstRef = itemRef;
      lastRef = itemRef;
      prevRef = itemRef;

      // Children
      if (node.children?.length) {
        const { firstRef: cFirst, lastRef: cLast, count } = createItems(
          node.children,
          itemRef
        );
        if (cFirst && cLast) {
          itemDict.set(PDFName.of("First"), cFirst);
          itemDict.set(PDFName.of("Last"), cLast);
          // positive => expanded
          itemDict.set(PDFName.of("Count"), PDFNumber.of(count));
        }
      }
    }

    return {
      firstRef,
      lastRef,
      count: countDescendants(nodes),
    };
  };

  const { firstRef, lastRef } = createItems(outlineNodes, outlinesRef);
  if (firstRef && lastRef) {
    outlinesDict.set(PDFName.of("First"), firstRef);
    outlinesDict.set(PDFName.of("Last"), lastRef);
    outlinesDict.set(PDFName.of("Count"), PDFNumber.of(countDescendants(outlineNodes)));
    catalog.set(PDFName.of("Outlines"), outlinesRef);
  }
}

function getOrderedLinks(siteData, localeKey) {
  const locale = siteData.locales?.[localeKey];
  if (!locale?.themeConfig) return [];

  const nav = locale.themeConfig.nav || [];
  const sidebar = locale.themeConfig.sidebar || {};
  const sidebarKeys = Object.keys(sidebar);

  const out = [];
  const seen = new Set();
  const push = (link) => {
    const norm = normalizeToHtmlPath(link);
    if (!norm.endsWith(".html")) return;
    if (!seen.has(norm)) {
      seen.add(norm);
      out.push(norm);
    }
  };

  // 0) Home first (locale home)
  push(localeKey === "cn" ? "/cn/index.html" : "/index.html");

  // Find the best matching sidebar key for a link
  const matchSidebarKey = (link) => {
    const l = normalizeToHtmlPath(link);
    let best = "";
    for (const key of sidebarKeys) {
      if (l.startsWith(key) && key.length > best.length) best = key;
    }
    return best || null;
  };

  const walkItems = (items) => {
    for (const it of items || []) {
      if (it.link) push(it.link);
      if (Array.isArray(it.items) && it.items.length) walkItems(it.items);
    }
  };

  // 1) Top nav order, then within each nav, follow its sidebar order
  for (const n of nav) {
    if (!n?.link) continue;
    push(n.link);
    const key = matchSidebarKey(n.link);
    if (!key) continue;
    const groups = sidebar[key] || [];
    for (const g of groups) {
      if (Array.isArray(g.items)) walkItems(g.items);
    }
  }

  return out;
}

async function renderToMergedPdf(
  pageUrls,
  outFile,
  { localeStorageValue, outlineNodes, breadcrumbMap, homePath }
) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    console.error(
      "\n无法启动 Chromium（Playwright 浏览器可能未安装）。请先运行：\n" +
        "  pnpm exec playwright install chromium\n"
    );
    throw e;
  }
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  // Print CSS and reduce surprises + ensure locale selection is stable during export.
  await context.addInitScript(({ k, v }) => {
    try {
      localStorage.setItem(k, v);
      // @ts-ignore
      window.__VP_PRINTING__ = true;
    } catch {}
  }, { k: "mc_manual_locale", v: localeStorageValue });

  const merged = await PDFDocument.create();
  const pathToStartPage = new Map();

  for (const url of pageUrls) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    let pathname = "";
    try {
      pathname = new URL(url).pathname;
    } catch {}
    const isHome = !!homePath && pathname === homePath;

    // Ensure content is rendered and theme CSS variables are available
    // (prevents "unstyled" prints). Some pages can be slow; don't hard-fail.
    await page.waitForSelector("#app", { timeout: 60_000 });
    if (!isHome) {
      await page.waitForSelector(".vp-doc", { state: "visible", timeout: 60_000 });
    }
    try {
      await page.waitForFunction(() => {
        const v = getComputedStyle(document.documentElement)
          .getPropertyValue("--vp-c-text-1")
          .trim();
        return v.length > 0;
      }, { timeout: 60_000 });
    } catch {
      // If the variable isn't available for some reason, proceed anyway.
    }
    // wait for fonts/images to settle
    await page.evaluate(async () => {
      // @ts-ignore
      if (document.fonts?.ready) {
        // @ts-ignore
        await document.fonts.ready;
      }
    });
    await page.waitForTimeout(200);
    await page.emulateMedia({ media: "screen" });

    // Hide non-doc UI elements (nav/sidebar/prev-next/etc.), keep only `.vp-doc`.
    await page.addStyleTag({ content: EXPORT_ONLY_DOC_CSS });

    // Force pure white background for all non-home pages (remove site gradients).
    if (!isHome) {
      await page.addStyleTag({ content: EXPORT_NON_HOME_WHITE_BG_CSS });
    }

    // Record start page index for this HTML path, used for PDF outline/bookmarks.
    try {
      if (pathname) pathToStartPage.set(pathname, merged.getPageCount());
    } catch {}

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", bottom: "12mm", left: "12mm", right: "12mm" },
    });

    const doc = await PDFDocument.load(pdfBytes);
    const copied = await merged.copyPages(doc, doc.getPageIndices());
    for (const p of copied) merged.addPage(p);

    await page.close();
  }

  // Add outlines (bookmarks) after pages are merged.
  if (outlineNodes?.length) {
    addPdfOutlines(merged, outlineNodes, pathToStartPage);
  }

  await browser.close();

  const bytes = await merged.save();
  fs.writeFileSync(outFile, bytes);
  console.log(`\nPDF generated: ${outFile} (${pageUrls.length} pages)\n`);
}

async function main() {
  // 1) Build the site
  await run(pnpmCmd(), ["-s", "docs:build"]);

  // 2) Start preview server
  let server = null;
  let startedByUs = false;
  try {
    const healthUrl = `${BASE_URL}/index.html`;
    if (await isServerUp(healthUrl)) {
      console.log(`Preview server already running at ${BASE_URL}, reusing it.`);
    } else {
      server = startPreviewServer();
      startedByUs = true;
      await waitForServer(healthUrl);
    }

    // 3) Read built site data to get nav + sidebar order (strict)
    const rootIndexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
    const siteData = parseVpSiteDataFromHtml(rootIndexHtml);

    const linksZh = getOrderedLinks(siteData, "cn");
    const linksEn = getOrderedLinks(siteData, "root");

    const outlineZh = buildOutlineTree(siteData, "cn");
    const outlineEn = buildOutlineTree(siteData, "root");
    const breadcrumbZh = buildBreadcrumbMap(outlineZh);
    const breadcrumbEn = buildBreadcrumbMap(outlineEn);

    // 4) Render & merge in strict order
    await renderToMergedPdf(linksZh.map((p) => `${BASE_URL}${p}`), OUT_ZH, {
      localeStorageValue: "cn",
      outlineNodes: outlineZh,
      breadcrumbMap: breadcrumbZh,
      homePath: "/cn/index.html",
    });
    await renderToMergedPdf(linksEn.map((p) => `${BASE_URL}${p}`), OUT_EN, {
      localeStorageValue: "root",
      outlineNodes: outlineEn,
      breadcrumbMap: breadcrumbEn,
      homePath: "/index.html",
    });
  } finally {
    if (startedByUs && server) server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


