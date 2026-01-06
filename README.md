![Hexo](https://img.shields.io/badge/Hexo-blue?style=flat-square&logo=hexo)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown)
![KaTeX](https://img.shields.io/badge/KaTeX-008080?style=flat-square&logo=latex)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

# mdblog-hexo

自用hexo主题，一个简洁的 Markdown 风格博客主题。

## 特性
- 🎨 简约设计风格
- 📱 响应式布局
- ⚡️ 快速加载
- 📊 文章字数统计
- 📝 数学公式支持 (KaTeX)

## 安装

### 1. 下载主题
```bash
cd your-hexo-site
git clone https://github.com/nashchennc/mdblog-hexo.git themes/mdblog
```

### 2. 修改配置
修改 Hexo 根目录下的 `_config.yml`：
```yaml
theme: mdblog
```

## 依赖安装
```bash
npm install hexo-wordcount hexo-renderer-markdown-it-katex --save
```

## 主题配置

### 配置概览

主题配置文件位于 `themes/mdblog/_config.yml`。所有可定制化内容都在此文件中配置。

**配置优先级说明：**
1. **主题配置** (`theme.xxx`) - 最高优先级，在 `themes/mdblog/_config.yml` 中设置
2. **站点配置** (`config.xxx`) - 次优先级，在 Hexo 根目录 `_config.yml` 中设置
3. **i18n文本** (`__('key')`) - 用于界面文本的多语言支持
4. **硬编码默认值** - 最后兜底

**配置更新方式：**
修改 `themes/mdblog/_config.yml` 后，需要重新生成站点：
```bash
hexo clean
hexo generate
```

### 详细配置项说明

#### 1. Banner 配置

Banner 显示在首页和分类页的顶部，支持自定义标题、副标题和背景图。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `banner.enable` | Boolean | `true` | 是否启用 Banner |
| `banner.image` | String | `/image/banner.png` | Banner 背景图片路径（图片应放在 `source/image/` 目录下） |
| `banner.title` | String | `""` | Banner 标题（用户可定制，留空则使用站点标题 `config.title`） |
| `banner.subtitle` | String | `""` | Banner 副标题（用户可定制，留空则使用站点副标题 `config.subtitle`） |

**配置示例：**
```yaml
banner:
  enable: true
  image: /image/banner.png
  title: "Welcome to My Blog"
  subtitle: "A simple and clean blog theme"
```

**提示：**
- 主题会自动从 `source/image/banner/` 目录随机选择图片作为首页背景
- `title` 和 `subtitle` 是用户个性化内容，不会进行国际化

#### 2. 侧边栏配置

侧边栏显示在文章页和首页右侧，包含用户信息卡片。

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `sidebar_config.image` | String | `/image/card.png` | 侧边栏卡片背景图路径 |
| `sidebar_config.avatar` | String | `/image/avatar.jpeg` | 头像图片路径（建议使用正方形图片，会自动裁剪为圆形） |
| `sidebar_config.description` | String | `""` | 侧边栏描述（用户可定制，留空则使用站点描述 `config.description`，再为空则使用i18n默认值） |

**配置优先级：**
```
theme.sidebar_config.description > config.description > __('welcome')
```

**配置示例：**
```yaml
sidebar_config:
  image: /image/card.png
  avatar: /image/avatar.jpeg
  description: "A developer who loves coding and writing"
```

#### 3. 社交链接配置

在侧边栏底部显示社交链接图标，支持多个社交平台。

**配置格式：**
```yaml
social:
  平台名称:
    link: 链接地址
    icon: Material Icons 图标名称
    color: MDUI 颜色类名
```

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `social.*.link` | String | 链接地址（格式：`mailto:your@email.com` 或 `https://...`） |
| `social.*.icon` | String | Material Icons 图标名称（参考：[Material Icons](https://fonts.google.com/icons)） |
| `social.*.color` | String | MDUI 颜色类名（格式：`mdui-text-color-{颜色名}`，参考：[MDUI Colors](https://www.mdui.org/docs/color)） |

**常用图标：**
- `email` - 邮箱
- `code` - 代码/GitHub
- `share` - 分享
- `favorite` - 收藏/微博
- `link` - 链接

**可用颜色：**
`blue`, `red`, `green`, `orange`, `purple`, `pink`, `indigo`, `teal`, `cyan`, `black` 等

**配置示例：**
```yaml
social:
  email:
    link: mailto:your@email.com
    icon: email
    color: mdui-text-color-blue
  github:
    link: https://github.com/yourusername
    icon: code
    color: mdui-text-color-black
  twitter:
    link: https://twitter.com/yourusername
    icon: share
    color: mdui-text-color-blue
  weibo:
    link: https://weibo.com/yourusername
    icon: favorite
    color: mdui-text-color-red
```

#### 4. 其他配置项

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `rss` | String | `/atom.xml` | RSS 订阅链接 |
| `favicon` | String | `/favicon.png` | 网站图标路径 |

### 完整配置示例

```yaml
# Banner 配置
banner:
  enable: true
  image: /image/banner.png
  title: "Welcome to My Blog"
  subtitle: "A simple and clean blog theme"

# 侧边栏配置
sidebar_config:
  image: /image/card.png
  avatar: /image/avatar.jpeg
  description: "A developer who loves coding and writing"

# 社交链接配置
social:
  email:
    link: mailto:your@email.com
    icon: email
    color: mdui-text-color-blue
  github:
    link: https://github.com/yourusername
    icon: code
    color: mdui-text-color-black
  twitter:
    link: https://twitter.com/yourusername
    icon: share
    color: mdui-text-color-blue

# 其他配置
rss: /atom.xml
favicon: /favicon.png
```

### 配置技巧

#### 如何自定义 Banner 图片

1. 将图片放在 `source/image/` 目录下
2. 在配置中设置 `banner.image: /image/your-banner.png`
3. 或者将多张图片放在 `source/image/banner/` 目录下，主题会自动随机选择

#### 如何添加社交链接

1. 在 `social` 配置下添加新的平台
2. 选择合适的 Material Icons 图标名称
3. 选择合适的 MDUI 颜色类名
4. 示例：
```yaml
social:
  your_platform:
    link: https://your-platform.com/yourusername
    icon: link
    color: mdui-text-color-purple
```

#### 如何自定义侧边栏

1. **更换头像**：将头像图片放在 `source/image/` 目录，设置 `sidebar_config.avatar`
2. **更换背景图**：将背景图放在 `source/image/` 目录，设置 `sidebar_config.image`
3. **自定义描述**：直接设置 `sidebar_config.description`，支持 Markdown 格式

#### 配置分类说明

**可定制化配置（用户个性化内容）：**
- `banner.title` / `banner.subtitle` - 用户自定义的横幅标题
- `sidebar_config.description` - 用户自定义的侧边栏描述
- `social.*` - 用户自定义的社交链接

这些内容不会进行国际化，完全由用户自定义。

**功能配置（主题功能开关）：**
- `banner.enable` - Banner 开关

**资源路径配置（静态资源）：**
- `banner.image` - Banner 图片路径
- `sidebar_config.image` - 侧边栏背景图路径
- `sidebar_config.avatar` - 头像路径
- `favicon` - 网站图标路径

**样式配置（外观定制）：**
- `social.*.color` - 社交链接颜色
- `social.*.icon` - 社交链接图标

更多配置选项请参考 `themes/mdblog/_config.yml` 文件中的详细注释。

## 特性说明

- **Wiki Links 支持**: 支持 `[[内部链接]]` 和 `![[图片]]` 语法（类似 Obsidian/Foam）
- **文件列表标签**: 使用 `{% list_files [folder_name] %}` 标签可以列出指定文件夹中的文件
- **自动标题**: 如果文章没有标题，会自动使用文件名作为标题
- **响应式设计**: 基于 MDUI 框架，完美适配移动端和桌面端

## 开发

主题使用以下技术栈：
- [MDUI](https://www.mdui.org/) - Material Design UI 框架
- [KaTeX](https://katex.org/) - 数学公式渲染

## License
MIT