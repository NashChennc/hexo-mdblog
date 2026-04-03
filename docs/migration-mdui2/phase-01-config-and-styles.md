# 阶段 1：配置与 Banner 数据净化 + 内联样式外提

**前提**：仍在 MDUI 1 下完成本阶段，保证视觉可预览后再做阶段 2。

## 1. 净化 `_config.yml` 的 `banner`

**文件**：`themes/mdblog/_config.yml`

- 删除 `index_title`、`index_subtitle`、`title`、`subtitle` 中的 **HTML 标签与内联样式**。
- 改为纯数据，例如：
  - YAML 列表：每行 `{ label_fr, label_zh }` 等无标签字段，或
  - `title_lines`、`subtitle_lines` 等结构化字段（按你首页/内页实际需要设计）。

## 2. 统一数据源与模板

**涉及文件**：

- `layout/index.ejs`（首页 hero 标题区）
- `layout/partial/banner.ejs`（文章顶栏横幅）

**任务**：

- 理清优先级：`index_*` → 通用 `title`/`subtitle` → `config.title` / `config.subtitle`。
- 新增或扩展 partial（如 `partial/banner-hero-titles.ejs`），把原先写在 YAML 里的版式用 **EJS + 类名** 写回。
- **EJS 输出与安全**：若 YAML 中仍允许少量**可信** HTML（如 `<b>`、`<br>`），模板中需用 **不转义** 输出 `<%- theme.banner.title %>`（或对应字段），否则标签会被转成实体无法渲染；若字段为**绝对纯文本**（用户可控或来自不可信源），应使用 **转义** 输出 `<%= theme.banner.title %>`，避免 XSS。
- `banner.ejs` 背景图：动态 URL 可保留极少 `style`，静态表现（`background-size` 等）尽量进 `source/css/custom.css`（可用 CSS 变量 `--banner-bg`）。

## 3. 内联 `style=` 外提

**重点文件**：

- `layout/partial/sidebar.ejs`
- `layout/partial/banner.ejs`
- `layout/index.ejs`

**做法**：全局搜 `style="`，把固定尺寸、object-fit、社交行高/字号等迁到 `custom.css`，用 BEM 式类名（如 `.sidebar-card-media`、`.sidebar-social-link`）。

## 验收

- `hexo clean && hexo g && hexo s`：首页 hero、分类/文章顶栏 banner、侧栏与阶段 1 前相比无逻辑回归。
- `_config.yml` 中 banner 相关字段无裸 HTML。

## 下一阶段

→ [phase-02-mdui2-base.md](./phase-02-mdui2-base.md)
