# 阶段 5：页面模板、首页网格、归档、Hexo 辅助

**前置**：完成 [phase-04](./phase-04-chrome.md)。

## 5.1 首页文章卡片网格 `layout/index.ejs`

- 去掉 `mdui-row equal-height-row` 与 `mdui-col-sm-6 mdui-col-md-4` 等。
- 列表容器使用 CSS Grid，例如：  
  `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));`
- 第一篇特色文章：`.featured-post { grid-column: 1 / -1; }`（保留 `custom.css` 里 `.featured-post .post-card-media` 高度等规则）。
- 删除 `custom.css` 中 `.equal-height-row` / `.equal-height-col`（若已无引用）。

卡片内部逐步把 `mdui-card`、`mdui-chip`、`mdui-btn` 等换成 v2 组件或兼容类（可与阶段 4 穿插）。

## 5.2 归档页 `layout/archive.ejs`

- **整块重写**：`mdui-panel` + `mdui-panel` 属性依赖 v1 JS，需改为 `<mdui-collapse>`（或文档推荐等价方案）。
- **结构映射（Slot）**：MDUI 1 的 Panel 靠嵌套 `div` + class 区分头/身；MDUI 2 的折叠组件走 **Shadow DOM 的 `slot`**，头部需显式放进 `header` 插槽，避免照抄旧 DOM 却丢插槽导致样式或交互异常。示例：

```html
<mdui-collapse>
  <mdui-collapse-item>
    <div slot="header">2023 年（面板头部）</div>
    <div>具体的文章列表…</div>
  </mdui-collapse-item>
</mdui-collapse>
```

- 单独测每一年/每一项展开收起与链接。

## 5.3 其他模板

- `layout/partial/link.ejs`：`mdui-row`/`mdui-col` → flex 或 grid + BEM。
- `layout/partial/postinfo.ejs`、`layout/category.ejs`、`layout/partial/footer.ejs`：`mdui-typo-*`、`mdui-btn`、`mdui-chip` → v2 或自有类。

## 5.4 分页器（勿重写 Hexo Helper）

`paginator()` 只能输出原生 `<a>` / `<span>`，**不要**为改成 `<mdui-button>` 去重写 Hexo 内置 helper。

**做法**：保留容器 class（如现有 `mdui-btn-group` 或改名为 `post-paginator`），在 `custom.css` 里用子选择器模拟 MD3 按钮：

```css
.mdui-btn-group .page-number,
.mdui-btn-group .extend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: 20px;
  text-decoration: none;
  color: rgb(var(--mdui-color-primary));
  transition: background-color 0.2s;
}
.mdui-btn-group .current {
  background-color: rgb(var(--mdui-color-primary-container));
  color: rgb(var(--mdui-color-on-primary-container));
}
```

按实际 DOM 微调 class 与变量名。

## 5.5 Wikilink 插件（可选但推荐）

**文件**：`scripts/wikilink/wikilink-plugin.js`

若当前输出 `<span class="mdui-chip">`，可改为输出 `<mdui-chip href="...">`（以 MDUI 2 Chip 文档为准），注意 HTML 转义与安全，避免与正文样式冲突。

## 验收

- 首页卡片阵列响应式正常，特色文占满宽。
- 归档交互正常；分页样式可读、当前页明显。
- Wikilink（若已改）在文章里显示与点击正常。

## 下一阶段

→ [phase-06-prose-and-cleanup.md](./phase-06-prose-and-cleanup.md)
