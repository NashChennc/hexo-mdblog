'use strict';

const { slugize, escapeHTML } = require('hexo-util');

/**
 * 仅当 #xxx 对应站内已有且带文章的 Tag 时，才转为链接（与首页 taxonomy 一致：无文章的不算）。
 * 跳过：围栏/行内代码、Markdown ATX 标题行、URL 片段、Markdown (#anchor)。
 */
function buildTagSlugMap(hexo) {
  const map = new Map();
  const tags = hexo.locals.get('tags');
  if (!tags) return map;

  const visit = tag => {
    if (!tag.length) return;
    const slug = slugize(String(tag.name), { transform: 1 });
    if (!map.has(slug)) map.set(slug, tag);
  };

  if (typeof tags.each === 'function') {
    tags.each(visit);
  } else if (typeof tags.forEach === 'function') {
    tags.forEach(visit);
  } else if (Array.isArray(tags)) {
    tags.forEach(visit);
  }
  return map;
}

function tagArchiveHref(hexo, tag) {
  const root = hexo.config.root || '/';
  const p = String(tag.path || '').replace(/^\/+/, '');
  const base = root.endsWith('/') ? root : root + '/';
  return encodeURI(base + p);
}

function processSegment(segment, hexo, slugMap) {
  return segment.split(/\n/).map(line => {
    if (/^\s*#{1,6}(\s|$)/.test(line)) return line;
    return line.replace(/(?<![#/\w(\[])(#)([^\s#]+)/g, (m, hash, name) => {
      const slug = slugize(String(name), { transform: 1 });
      const tag = slugMap.get(slug);
      if (!tag) return m;
      const href = tagArchiveHref(hexo, tag);
      const safeName = escapeHTML(name);
      return `<a href="${href}" class="index-taxonomy__chip" rel="tag">${hash}${safeName}</a>`;
    });
  }).join('\n');
}

function processContent(content, hexo) {
  if (!content || !content.includes('#')) return content;
  const slugMap = buildTagSlugMap(hexo);
  if (!slugMap.size) return content;

  const parts = content.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = processSegment(parts[i], hexo, slugMap);
  }
  return parts.join('');
}

hexo.extend.filter.register('before_post_render', function (data) {
  if (!data.content) return data;
  data.content = processContent(data.content, hexo);
  return data;
}, 11);
