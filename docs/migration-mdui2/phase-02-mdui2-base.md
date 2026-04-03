# 阶段 2：`layout.ejs` 切换到 MDUI 2 基础

**前置**：完成 [phase-01](./phase-01-config-and-styles.md)。

## 1. 替换静态资源

**文件**：`layout/layout.ejs`

- **移除**：`mdui/css/mdui.min.css`、`mdui/js/mdui.min.js`（MDUI 1）。
- **增加**：`mdui2/mdui.css`（此前主题里常漏链，务必加上）。
- **保留/整理**：`mdui2/outlined.css`、`mdui2/material-icons-compat.css`（与 `material-icons-compat.css` 头部说明一致即可）。
- **脚本**：`mdui2/mdui.global.js`（与 `scripts/vendor-mdui2.js` 流程一致）。

## 2. `html` / `body` 与主题

- 去掉 body 上 MDUI 1 主题类：`mdui-theme-primary-*`、`mdui-theme-accent-*`、`mdui-appbar-with-toolbar`、`mdui-color-grey-100` 等。
- 按 [mdui 暗色模式](https://www.mdui.org/zh-cn/docs/2/styles/dark-mode.md) 与动态配色文档设置 v2 主题（`setTheme` / `setColorScheme` 等）。
- 更新 `<meta name="theme-color">` 与顶栏配色一致。

## 3. FOUC（主题闪烁）防护

MDUI 2 动态配色在 JS 就绪前可能闪一帧。

- 在 `<html>` 上预挂默认类（如文档中的 `mdui-theme-auto`，与 `lang` 并存），**或**
- 在 `<head>` 靠前位置放**极小**内联脚本，尽早设置 `document.documentElement` 的 class。

以官方文档为准，目标是首屏尽量稳定。

## 4. 只删 v1 补丁脚本，保留公式与图表

在同一 `DOMContentLoaded`（或等价逻辑）中：

- **删除**：给所有 `table` / `img` 批量加 `mdui-table`、`mdui-img-fluid` 的循环（后续由 `mdui-prose` 等承接）。
- **必须保留**：
  - KaTeX：`renderMathInElement(...)`
  - Mermaid：`mermaid.initialize(...)`（若站点启用）

二者与 MDUI 无关，误删会导致数学与 Mermaid 失效。

## 验收

- 任意页面打开：无控制台因缺少 mdui 报错；Web Components 能升级。
- 含 `$...$` 或 Mermaid 的文章仍正常渲染。

## 下一阶段

→ [phase-03-page-grid.md](./phase-03-page-grid.md)
