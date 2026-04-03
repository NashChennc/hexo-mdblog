# 阶段 6：正文 `mdui-prose`、TOC、图片与收尾

**前置**：完成 [phase-05](./phase-05-pages-and-helpers.md)。

## 6.1 正文容器

**文件**：`layout/post.ejs`（以及其它直接输出 Markdown 的容器）

- 将 `mdui-typo` 改为 **`mdui-prose`**（见 [文章排版](https://www.mdui.org/zh-cn/docs/2/styles/prose.md)）。
- 表格如需额外类，按文档使用 `mdui-table` 等。

## 6.2 `custom.css` 选择器迁移

- 将所有 `.mdui-typo ...` 改为 `.mdui-prose ...`（含代码高亮 `.highlight` 与表格冲突修复段）。
- **Hexo 代码块与 `mdui-prose`**：默认语法高亮会生成 `<figure class="highlight">`，其内常带行号的 `<table>`。`mdui-prose` 对普通 `<table>` / `<pre>` 的全局样式容易叠加上去，出现多余边框、背景或布局错乱。可在 `custom.css` 中针对高亮块内表格做重置，例如：

```css
.mdui-prose figure.highlight table {
  margin: 0;
  display: block;
  overflow-x: auto;
}
.mdui-prose figure.highlight td {
  border: none;
  padding: 0;
}
```

按实际高亮主题（类名、嵌套层级）微调选择器。

## 6.3 正文内图片防撑破

Hexo 常见 `<p><img></p>`，若图片溢出卡片：

```css
.mdui-prose img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}
```

## 6.4 目录 TOC

- `toc(..., { class: '...' })` 生成的列表：改为与 v2 列表兼容的 class，或依赖 `mdui-prose` 下的 `ul`/`ol` + 少量自定义。

## 6.5 本地化（可选）

若需要组件内置中文等：按 [本地化](https://www.mdui.org/zh-cn/docs/2/getting-started/localization.md) 使用 `loadLocale` / `setLocale`。

## 6.6 可选清理

- 验收稳定后删除 `source/mdui/`（旧 v1 静态文件）。
- 移除未使用的布局（如 `index0.ejs`）若确认无引用。

## 验收

- 长文、代码块、表格、图片、TOC 在亮/暗色下均正常。
- 全站关键路径走通：首页、文章、分类、归档、关于。

---

迁移结束。若需记录决策，可在本目录追加 `DECISIONS.md`（非必须）。
