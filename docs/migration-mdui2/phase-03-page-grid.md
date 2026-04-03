# 阶段 3：宏观布局（主栏 + 侧栏 CSS Grid）

**前置**：完成 [phase-02](./phase-02-mdui2-base.md)。本阶段可先少动组件，只把「两栏骨架」摆正。

## 涉及模板（按需全覆盖）

- `layout/index.ejs`
- `layout/post.ejs`
- `layout/category.ejs`
- `layout/index0.ejs`（若仍在使用）

## HTML 结构目标

将：

`mdui-container` → `mdui-row` → `mdui-col-md-9` / `mdui-col-md-3`

改为类似：

```html
<div class="page-shell mdui-container">
  <div class="page-grid">
    <main class="page-main">...</main>
    <aside class="page-sidebar sticky-sidebar">...</aside>
  </div>
</div>
```

类名可按你项目统一命名，关键是 **main / aside 语义 + 单一 grid 父级**。

## CSS（`source/css/custom.css`）

```css
.page-grid {
  display: grid;
  gap: 1.5rem; /* 按设计调整 */
  grid-template-columns: 1fr;
}
@media (min-width: 840px) {
  .page-grid {
    grid-template-columns: 3fr 1fr;
    align-items: start; /* 【关键】Grid 默认 stretch 会把侧栏拉高到与 main 同高，导致侧栏内 position: sticky 失效 */
  }
}
```

断点可与 MDUI 2 breakpoint 对齐，不必死守 840px。

## 粘性侧栏

- 宽屏下务必配合上文 **`align-items: start`**：否则 `<aside>` 被纵向拉伸后，内部无「可滚动余量」，粘性定位无法表现。
- 检查 `.sticky-sidebar { top: ... }` 是否与新 **TopAppBar 高度**一致（v2 顶栏高度可能与 v1 不同）。

## 验收

- 窄屏单列、宽屏左右分栏；侧栏 sticky 不遮挡正文。

## 下一阶段

→ [phase-04-chrome.md](./phase-04-chrome.md)
