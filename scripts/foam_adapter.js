/**
 * Wikilink Adapter for Hexo
 * Merges functionalities of Obsidian image links (![[...]]) and Foam-style wiki links ([[...]]).
 */

const path = require('path');
const fs = require('fs');

// HTML 转义函数，防止 XSS 攻击
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// URL 编码函数，确保 URL 安全
function escapeUrl(url) {
  if (!url) return '';
  // 只转义必要的字符，保留 URL 结构
  return String(url).replace(/['"<>]/g, '');
}

// ============================================================================
// PART 1: Image Processing (Priority: 9)
// Converts ![[filename.jpg|alt]] to ![](/files/filename.jpg)
// ============================================================================

hexo.extend.filter.register('before_post_render', function processImages(data) {
  // 快速检查：如果没有图片引用标记，直接跳过
  if (!data.content || !data.content.includes('![[')) return data;

  // 正则：匹配 ![[filename.jpg]] 或 ![[filename.jpg|alt text]]
  const imageRegex = /!\[\[(.*?)(?:\|(.*?))?\]\]/g;

  data.content = data.content.replace(imageRegex, (match, link, caption) => {
    let filename = link.trim();
    // 验证文件名，防止路径遍历攻击
    filename = filename.replace(/\.\./g, '').replace(/[<>"']/g, '');
    const altText = caption ? escapeHtml(caption.trim()) : '';

    // 假设图片统一存放在 source/files/ 目录下
    // 如果 Obsidian 图片包含子目录，path.basename(filename) 可能有用
    return `<img src="/files/${filename}" alt="${altText}" />`;
  });

  return data;
}, 9); // Priority 9: Run BEFORE wiki links


// ============================================================================
// PART 2: Wiki Link Processing (Priority: 10)
// Converts [[internal_link]] to styled HTML chips
// ============================================================================

hexo.extend.filter.register('before_post_render', function processWikiLinks(data) {
  // 快速检查
  if (!data.content || !data.content.includes('[[')) return data;

  // 1. 构建索引 (Singleton: 只构建一次)
  if (!hexo.locals.get('foam_index')) {
    const map = new Map();
    // 增加防御性检查：防止 hexo clean 后初次运行 model 为空
    const posts = hexo.model('Post') ? hexo.model('Post').toArray() : [];
    const pages = hexo.model('Page') ? hexo.model('Page').toArray() : [];
    const all = [...posts, ...pages];

    all.forEach(p => {
      const src = p.source.replace(/\\/g, '/'); // 路径标准化
      const fileName = path.basename(src, path.extname(src)).toLowerCase();
      
      map.set(fileName, p); // Key: 文件名
      if (p.title) map.set(p.title.toLowerCase(), p); // Key: 标题
    });

    hexo.locals.set('foam_index', map);
  }

  const index = hexo.locals.get('foam_index');

  // 2. 正则：增加了 (?<!\!) 负向回顾
  // 含义：匹配 [[...]]，但前提是前面不能有感叹号 !
  const linkRegex = /(?<!\!)\[\[(.*?)(?:\|(.*?))?\]\]/g;

  // 3. 执行替换
  data.content = data.content.replace(linkRegex, (match, link, text) => {
    let target = link.trim();
    // 移除可能的相对路径前缀
    if (target.startsWith('./')) target = target.substring(2);

    const pureName = target.split('/').pop(); 
    const key = target.toLowerCase();
    
    // 查找逻辑：优先全路径/Key，其次纯文件名
    const post = index.get(key) || index.get(pureName.toLowerCase());

    // 显示文本：自定义文本 > 文章标题 > 文件名
    const display = text ? text.trim() : (post && post.title ? post.title : pureName);
    const displayEscaped = escapeHtml(display);

    // --- Case A: 找到对应文章 (Active Link) ---
    if (post) {
      let url = hexo.config.root + post.path;
      url = url.replace(/\/{2,}/g, '/'); // 清理多余斜杠
      url = escapeUrl(url); // 转义 URL 中的危险字符
      const titleEscaped = escapeHtml(post.title || '');
      
      return `<span class="mdui-chip mdui-hoverable mdui-ripple mdui-color-deep-purple-50 mdui-text-color-indigo" 
                    onclick="window.location.href='${url}'" 
                    title="${titleEscaped}" 
                    style="cursor: pointer; vertical-align: middle; user-select: none;">
                <span class="mdui-chip-title">${displayEscaped}</span>
              </span>`;
    }

    // --- Case B: 图片文件 (Safety Net) ---
    // 理论上被 Negative Lookbehind 过滤了，这里作为双重保险
    if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(target)) return match;

    // --- Case C: 死链 (Dead Link) ---
    // 页面未创建。移除 onclick 事件，样式置灰
    // 获取i18n文本
    let pageNotCreatedText = 'Page not created';
    try {
      const lang = hexo.config.language || 'default';
      const i18n = hexo.theme.i18n || hexo.i18n;
      if (i18n && i18n.get) {
        pageNotCreatedText = i18n.get(lang, 'page_not_created') || i18n.get('default', 'page_not_created') || pageNotCreatedText;
      } else {
        // 如果i18n不可用，尝试直接读取语言文件
        const yaml = require('js-yaml');
        const langFile = path.join(hexo.theme_dir, 'languages', `${lang}.yml`);
        if (fs.existsSync(langFile)) {
          const content = fs.readFileSync(langFile, 'utf8');
          const data = yaml.load(content);
          if (data && data.page_not_created) {
            pageNotCreatedText = data.page_not_created;
          }
        } else {
          // 尝试读取default.yml
          const defaultFile = path.join(hexo.theme_dir, 'languages', 'default.yml');
          if (fs.existsSync(defaultFile)) {
            const content = fs.readFileSync(defaultFile, 'utf8');
            const data = yaml.load(content);
            if (data && data.page_not_created) {
              pageNotCreatedText = data.page_not_created;
            }
          }
        }
      }
    } catch (err) {
      // 如果获取i18n失败，使用默认值
      console.error('foam_adapter i18n error:', err);
    }
    
    return `<span class="mdui-chip mdui-color-grey-200 mdui-text-color-grey-500" 
                  title="${escapeHtml(pageNotCreatedText)}" 
                  style="cursor: not-allowed; vertical-align: middle; user-select: none;">
              <span class="mdui-chip-title">${displayEscaped}</span>
            </span>`;
  });

  return data;
}, 10); // Priority 10: Run AFTER images