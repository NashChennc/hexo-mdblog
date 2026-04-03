'use strict';

const { readBannerFilenames } = require('./lib/banner_images');

function hashString(str) {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * 首页卡片封面 URL：Banner > Photos > 正文首图 > 本地 banner 目录哈希选图
 * @returns {string} 空字符串表示无图
 */
hexo.extend.helper.register('post_cover_url', function (post) {
  if (!post) return '';

  const imageRegex = /<img[^>]+src="([^">]+)"/i;
  const imageMatch = post.content && post.content.match(imageRegex);
  const firstImageFromContent = imageMatch && imageMatch[1] ? imageMatch[1] : null;

  if (post.banner) {
    return post.banner;
  }
  if (post.photos && post.photos.length) {
    return post.photos[0];
  }
  if (firstImageFromContent) {
    return firstImageFromContent;
  }

  const localBannerImages = readBannerFilenames(hexo);
  if (localBannerImages.length > 0) {
    const bannerIndex = hashString(post.title || '') % localBannerImages.length;
    return this.url_for('image/banner/' + localBannerImages[bannerIndex]);
  }

  return '';
});
