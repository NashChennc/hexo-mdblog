'use strict';

const fs = require('fs');
const path = require('path');

/**
 * @param {import('hexo')} hexo
 * @returns {string[]}
 */
function readBannerFilenames(hexo) {
  const siteBannerDir = path.join(hexo.source_dir, 'image', 'banner');
  const themeBannerDir = path.join(hexo.theme_dir, 'source', 'image', 'banner');

  function getImages(dir) {
    try {
      if (!fs.existsSync(dir)) return [];
      return fs.readdirSync(dir).filter(function (file) {
        return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
      });
    } catch (err) {
      console.error('banner_images: error reading dir:', dir, err);
      return [];
    }
  }

  let images = getImages(siteBannerDir);
  if (images.length === 0) {
    images = getImages(themeBannerDir);
  }
  return images;
}

module.exports = { readBannerFilenames };
