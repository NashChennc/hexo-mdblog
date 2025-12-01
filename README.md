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
git clone https://github.com/YOUR_USERNAME/mdblog-hexo.git themes/mdblog_hexo
```

### 2. 修改配置
修改 Hexo 根目录下的 `_config.yml`：
```yaml
theme: mdblog_hexo
```

## 依赖安装
```bash
npm install hexo-wordcount hexo-renderer-markdown-it-katex hexo-auto-category --save
```

## 主题配置
在 `_config.yml` 中可配置以下选项：
```yaml
# 导航菜单
menu:
  Home: /
  Archives: /archives
  About: /about

# 社交链接
social:
  github: YOUR_GITHUB_URL
  
# 是否显示文章字数统计
wordcount: true
```

## License
MIT