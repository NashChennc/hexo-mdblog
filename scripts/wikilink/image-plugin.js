const { escapeHtml } = require('./utils');

const WIKI_IMAGE_RE = /!\[\[(.*?)(?:\|(.*?))?\]\]/g;

function replaceWikiImageTokens(str) {
  return str.replace(WIKI_IMAGE_RE, (match, link, caption) => {
    let filename = link.trim();
    filename = filename.replace(/\.\./g, '').replace(/[<>"']/g, '');
    const altText = caption ? escapeHtml(caption.trim()) : '';
    return `<img src="/files/${filename}" alt="${altText}" />`;
  });
}

function wikiLinkCount(line) {
  const m = line.match(/!\[\[/g);
  return m ? m.length : 0;
}

function lineIsWikiGalleryOnly(line) {
  const without = line.replace(WIKI_IMAGE_RE, '');
  return /^\s*$/.test(without);
}

module.exports = function processImages(data) {
  if (!data.content || !data.content.includes('![[')) return data;

  const lines = data.content.split(/\r?\n/);
  const out = lines.map((line) => {
    if (wikiLinkCount(line) >= 2 && lineIsWikiGalleryOnly(line)) {
      return `<div class="md-gallery">\n${replaceWikiImageTokens(line)}\n</div>`;
    }
    return line;
  });
  data.content = replaceWikiImageTokens(out.join('\n'));

  return data;
};
