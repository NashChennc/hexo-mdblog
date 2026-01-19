const { escapeHtml } = require('./utils');

module.exports = function processImages(data) {
  // Fast Fail
  if (!data.content || !data.content.includes('![[')) return data;

  const imageRegex = /!\[\[(.*?)(?:\|(.*?))?\]\]/g;

  data.content = data.content.replace(imageRegex, (match, link, caption) => {
    let filename = link.trim();
    // 安全清理
    filename = filename.replace(/\.\./g, '').replace(/[<>"']/g, '');
    const altText = caption ? escapeHtml(caption.trim()) : '';

    return `<img src="/files/${filename}" alt="${altText}" />`;
  });

  return data;
};