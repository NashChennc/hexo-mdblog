const fs = require('fs');
const path = require('path');

/**
 * 注册标签 {% list_files [folder_name] %}
 * 修改版：无图标，纯链接列表
 */
hexo.extend.tag.register('list_files', function(args) {
  // 默认扫描 files 文件夹，也可以通过参数指定其他文件夹
  const folderName = args[0] || 'files';
  
  const baseDir = hexo.source_dir;
  const targetDir = path.join(baseDir, folderName);

  // 1. 检查目录是否存在
  if (!fs.existsSync(targetDir)) {
    return `<div class="mdui-typo"><p>目录不存在: source/${folderName}</p></div>`;
  }

  // 2. 读取并过滤文件
  const files = fs.readdirSync(targetDir).filter(file => {
    return !file.startsWith('.') && 
           !['index.html', 'index.md', 'index.ejs'].includes(file);
  });

  if (files.length === 0) {
    return '<div class="mdui-typo"><p>暂无文件。</p></div>';
  }

  // 3. 生成简洁的 HTML 列表 (利用 mdui-typo 的默认列表样式)
  let html = '<div class="mdui-typo"><ul>';
  
  files.forEach(file => {
    // 拼接文件 URL
    const fileUrl = hexo.config.root + folderName + '/' + file;
    
    // 生成列表项
    html += `<li><a href="${fileUrl}" target="_blank">${file}</a></li>`;
  });
  
  html += '</ul></div>';
  return html;
});