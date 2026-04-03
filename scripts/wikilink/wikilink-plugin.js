const { escapeHtml, escapeUrl } = require('./utils');
const buildIndex = require('./indexer');

module.exports = function(hexo) {
  return function processWikiLinks(data) {
    if (!data.content || !data.content.includes('[[')) return data;

    const index = buildIndex(hexo);
    const linkRegex = /(?<!\!)\[\[(.*?)(?:\\?\|(.*?))?\]\]/g;

    data.content = data.content.replace(linkRegex, (match, link, text) => {
      // ======================================================================
      // 步骤 A: 暴力清洗路径 (Platform Agnostic Cleaning)
      // ======================================================================
      let target = link.trim();

      // 1. URL 解码
      try { target = decodeURIComponent(target); } catch (e) {}

      // 2. 统一分隔符：把 Windows 的 "\" 全部换成 "/"
      target = target.replace(/\\/g, '/');

      // 3. 移除开头的 "./" 或 "/" (容错处理 [[/Posts/Tag/Music]])
      target = target.replace(/^(\.\/|\/)+/, '');

      // ======================================================================
      // 步骤 B: 提取各种可能的 Key
      // ======================================================================
      
      // 1. 尝试完整路径匹配 (去掉 .md 后缀)
      // Link: "Posts/Tag/Music.md" -> "posts/tag/music"
      const pathKey = target.replace(/\.(md|markdown)$/i, '').toLowerCase();

      // 2. 尝试纯文件名匹配 (手动 split，不依赖 OS path 模块)
      // Link: "Posts/Tag/Music.md" -> ["Posts", "Tag", "Music.md"] -> "Music.md"
      const basenameWithExt = target.split('/').pop();
      // "Music.md" -> "Music"
      const pureName = basenameWithExt.replace(/\.(md|markdown)$/i, '');
      const nameKey = pureName.toLowerCase();

      // ======================================================================
      // 步骤 C: 组合拳查找
      // ======================================================================
      // 优先级: 
      // 1. 纯文件名 (最常用，Music)
      // 2. 完整路径 (Posts/Tag/Music)
      // 3. 尝试去掉第一层目录的路径 (应对 Obsidian "Posts/" 前缀但 Hexo "Tag/" 的情况)
      
      let post = index.get(nameKey); // Try "music"
      
      if (!post) {
        post = index.get(pathKey); // Try "posts/tag/music"
      }
      
      if (!post) {
        // 尝试去掉第一层目录再查 (例如 Link 是 "Posts/Tag/Music"，但 Slug 是 "Tag/Music")
        const parts = pathKey.split('/');
        if (parts.length > 1) {
            parts.shift(); // 去掉 "posts"
            const subPathKey = parts.join('/'); // "tag/music"
            post = index.get(subPathKey);
        }
      }

      // ======================================================================
      // 步骤 D: 渲染
      // ======================================================================
      const display = text ? text.trim() : (post && post.title ? post.title : pureName);
      const displayEscaped = escapeHtml(display);

      if (post) {
        let url = hexo.config.root + post.path;
        url = url.replace(/\/{2,}/g, '/');
        url = escapeUrl(url);
        const titleEscaped = escapeHtml(post.title || '');

        return `<a href="${url}" title="${titleEscaped}">${displayEscaped}</a>`;
      }

      // Image Safety Net
      if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(target)) return match;

      // Dead Link (Keep Debug Info)
      return `<span title="${escapeHtml('Missing: ' + target + ' | Try Key: ' + nameKey)}">${displayEscaped}</span>`;
    });

    return data;
  };
};