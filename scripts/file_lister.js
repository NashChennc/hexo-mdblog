const fs = require('fs');
const path = require('path');

/**
 * HTML 转义函数，防止 XSS 攻击
 */
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

/**
 * URL 编码函数，确保 URL 安全
 */
function escapeUrl(url) {
  if (!url) return '';
  // 只转义必要的字符，保留 URL 结构
  return String(url).replace(/['"<>]/g, '');
}

/**
 * 获取i18n文本的辅助函数
 */
function getI18nText(key, hexo) {
  const lang = hexo.config.language || 'default';
  try {
    const i18n = hexo.theme.i18n || hexo.i18n;
    if (i18n && i18n.get) {
      return i18n.get(lang, key) || i18n.get('default', key) || key;
    }
    // 如果i18n不可用，尝试直接读取语言文件
    const yaml = require('js-yaml');
    const langFile = path.join(hexo.theme_dir, 'languages', `${lang}.yml`);
    if (fs.existsSync(langFile)) {
      const content = fs.readFileSync(langFile, 'utf8');
      const data = yaml.load(content);
      if (data && data[key]) {
        return data[key];
      }
    }
    // 尝试读取default.yml
    const defaultFile = path.join(hexo.theme_dir, 'languages', 'default.yml');
    if (fs.existsSync(defaultFile)) {
      const content = fs.readFileSync(defaultFile, 'utf8');
      const data = yaml.load(content);
      if (data && data[key]) {
        return data[key];
      }
    }
  } catch (err) {
    console.error('getI18nText error:', err);
  }
  return key;
}

/**
 * 注册标签 {% list_files [folder_name] %}
 * 修改版：无图标，纯链接列表
 */
hexo.extend.tag.register('list_files', function(args) {
  // 默认扫描 files 文件夹，也可以通过参数指定其他文件夹
  const folderName = args[0] || 'files';
  
  // 验证文件夹名称，防止路径遍历攻击
  if (folderName.includes('..') || folderName.includes('/') || folderName.includes('\\')) {
    const msg = getI18nText('invalid_folder_name', hexo);
    return `<div class="mdui-prose"><p>${escapeHtml(msg)}</p></div>`;
  }
  
  const baseDir = hexo.source_dir;
  const targetDir = path.join(baseDir, folderName);

  // 1. 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    const msg = getI18nText('folder_not_found', hexo).replace('%s', escapeHtml(folderName));
    return `<div class="mdui-prose"><p>${msg}</p></div>`;
  }

  // 2. 读取并过滤文件
  let files;
  try {
    files = fs.readdirSync(targetDir).filter(file => {
      return !file.startsWith('.') && 
             !['index.html', 'index.md', 'index.ejs'].includes(file);
    });
  } catch (err) {
    console.error('list_files error reading dir:', targetDir, err);
    const msg = getI18nText('read_dir_failed', hexo);
    return `<div class="mdui-prose"><p>${escapeHtml(msg)}</p></div>`;
  }

  if (files.length === 0) {
    const msg = getI18nText('no_files', hexo);
    return `<div class="mdui-prose"><p>${escapeHtml(msg)}</p></div>`;
  }

  // 3. 生成简洁的 HTML 列表 (mdui-prose 列表样式)
  let html = '<div class="mdui-prose"><ul>';
  
  files.forEach(file => {
    // 验证文件名，防止路径遍历
    const safeFileName = file.replace(/\.\./g, '').replace(/[<>"']/g, '');
    // 拼接文件 URL
    const fileUrl = hexo.config.root + escapeUrl(folderName) + '/' + escapeUrl(safeFileName);
    
    // 生成列表项，转义文件名显示
    html += `<li><a href="${fileUrl}" target="_blank">${escapeHtml(file)}</a></li>`;
  });
  
  html += '</ul></div>';
  return html;
});