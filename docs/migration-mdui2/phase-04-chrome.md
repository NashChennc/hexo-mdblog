# 阶段 4：顶栏、侧栏卡片、FAB（MDUI 2 组件）

**前置**：完成 [phase-03](./phase-03-page-grid.md)。

## 4.1 顶栏 `layout/partial/topbar.ejs`

- 使用 `<mdui-top-app-bar>`（+ 文档推荐的子结构）。
- 分类导航：普通 `<a>`、`<mdui-tabs>` 或 flex，按 [Top App Bar](https://www.mdui.org/zh-cn/docs/2/components/top-app-bar.md) 与信息架构选型。
- 菜单按钮：`<mdui-button-icon>` + `<mdui-icon>`，替代 `mdui-btn-icon` + `<i class="material-icons">`。
- **Tooltip**：用 `<mdui-tooltip>` 包裹目标元素；v1 的 `mdui-tooltip="{...}"` 在 v2 无效。

## 4.2 侧栏 `layout/partial/sidebar.ejs`

- 外层卡片：`<mdui-card>` 等 v2 写法，替代 `div.mdui-card`。
- 社交列表：`<mdui-list>` / `<mdui-list-item>`（以官方文档为准）。
- 原 `mdui-text-color-*`：改为 v2 设计令牌或自定义类 + CSS 变量。

## 4.3 FAB `layout/partial/fab.ejs`

- 移除 `mdui-fab-wrapper`、`mdui-fab` 属性等 v1 写法。
- 按 [Fab 组件](https://www.mdui.org/zh-cn/docs/2/components/fab.md) 实现主按钮与子操作；tooltip 同样用 `<mdui-tooltip>`。

## 验收

- 顶栏固定、链接可点、关于等按钮有提示。
- 侧栏卡片与社交链接正常。
- FAB 展开/跳转行为符合预期。

## 下一阶段

→ [phase-05-pages-and-helpers.md](./phase-05-pages-and-helpers.md)
