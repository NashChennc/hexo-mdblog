# mdblog：MDUI 2 + CSS Grid 迁移（分阶段文档）

完整 SOP 已拆成多个小文件，**按编号顺序**执行；每完成一阶段即可 `hexo s` 验收后再进入下一阶段。

**平滑过渡策略**：Phase 1 先抽离数据与样式、仍可在 MDUI 1 下预览；Phase 2 保证换底座后页面不报错；Phase 3～6 再逐步替换布局与组件。任一阶段验收通过即可单独 `git commit`，需要时只回滚该提交，避免「改了一整天站点起不来」的大块风险。

| 顺序 | 文档 | 内容概要 |
|------|------|----------|
| 0 | 本页 | 索引、依赖策略、提交顺序 |
| 1 | [phase-01-config-and-styles.md](./phase-01-config-and-styles.md) | 净化 `_config.yml`、Banner 进 EJS、内联样式外提（仍可留在 MDUI 1） |
| 2 | [phase-02-mdui2-base.md](./phase-02-mdui2-base.md) | `layout.ejs` 切换 MDUI 2、FOUC、保留 KaTeX/Mermaid |
| 3 | [phase-03-page-grid.md](./phase-03-page-grid.md) | 主内容 + 侧栏宏观 CSS Grid |
| 4 | [phase-04-chrome.md](./phase-04-chrome.md) | TopAppBar、侧栏卡片、FAB |
| 5 | [phase-05-pages-and-helpers.md](./phase-05-pages-and-helpers.md) | 首页卡片 Grid、归档、分页器 CSS、Wikilink 等 |
| 6 | [phase-06-prose-and-cleanup.md](./phase-06-prose-and-cleanup.md) | `mdui-prose`、TOC、收尾与可选清理 |

## 依赖策略（全局约定）

- 使用主题内已 vendoring 的资源：`url_for('mdui2/mdui.css')`、`url_for('mdui2/mdui.global.js')`（由 `npm install` / `scripts/vendor-mdui2.js` 维护），不强制使用 unpkg CDN。

## 建议 Git 提交顺序

1. Phase 1  
2. Phase 2  
3. Phase 3  
4. Phase 4  
5. Phase 5  
6. Phase 6  

## 风险摘要

- MDUI 1 的 `mdui-tooltip`、`mdui-panel`、`mdui-fab` 等依赖 v1 JS，换 v2 后需改为对应 Web Components。
- 验收前可保留 `source/mdui/`，稳定后再删以减小体积。

## 与 Cursor Plan 的关系

若仓库中仍有 `.cursor/plans/mdui2_与_grid_迁移_*.plan.md`，以其为「总览」；**实操步骤以本目录 Markdown 为准**，便于分阶段打开、执行与归档。
