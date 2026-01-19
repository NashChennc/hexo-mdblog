const path = require('path');
const { normalizePath } = require('./utils');

module.exports = function buildIndex(hexo) {
  if (hexo.locals.get('foam_index')) {
    return hexo.locals.get('foam_index');
  }

  const map = new Map();
  const posts = hexo.model('Post') ? hexo.model('Post').toArray() : [];
  const pages = hexo.model('Page') ? hexo.model('Page').toArray() : [];
  const all = [...posts, ...pages];

  all.forEach(p => {
    // 1. 获取源文件路径并标准化
    const src = normalizePath(p.source);
    
    // 2. 提取纯文件名 (用于 [[Filename]] 查找)
    const fileName = path.basename(src, path.extname(src)); 
    map.set(fileName.toLowerCase(), p);

    // 3. [新增] 索引 Slug (用于 [[Folder/Filename]] 路径查找)
    if (p.slug) {
      map.set(p.slug.toLowerCase(), p);
    }

    // 4. [新增] 索引完整 source 路径 (作为备用，去掉 _posts/ 前缀的场景)
    // 某些情况下 slug 可能被自定义，这里保留物理路径的查找能力
    // 例如 src: "_posts/Blog Category/Menu之Menu.md" -> 存入 "blog category/menu之menu"
    const relativeSrc = src.replace(/^(_posts\/|_pages\/)/, '').replace(/\.(md|markdown)$/i, '');
    map.set(relativeSrc.toLowerCase(), p);

    // 5. 索引标题
    if (p.title) map.set(p.title.toLowerCase(), p);
  });

  hexo.locals.set('foam_index', map);
  return map;
};