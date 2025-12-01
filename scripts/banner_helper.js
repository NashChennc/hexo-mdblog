const fs = require('fs');
const path = require('path');

/**
 * 注册一个全局 Helper 函数 get_banner_list
 * 用于获取 banner 目录下的所有图片文件名列表
 * 策略：优先查找 站点source目录 -> 其次查找 主题source目录
 */
hexo.extend.helper.register('get_banner_list', function() {
  // 定义两个查找路径
  const siteBannerDir = path.join(hexo.source_dir, 'image', 'banner');
  const themeBannerDir = path.join(hexo.theme_dir, 'source', 'image', 'banner');
  
  // 辅助函数：读取并过滤图片
  function getImages(dir) {
    try {
      if (!fs.existsSync(dir)) return [];
      const files = fs.readdirSync(dir);
      return files.filter(function(file) {
        return /\.(jpg|jpeg|png|webp|gif)$/i.test(file);
      });
    } catch (err) {
      console.error('get_banner_list error reading dir:', dir, err);
      return [];
    }
  }

  // 1. 优先查找站点 source 目录 (用户自定义)
  let images = getImages(siteBannerDir);
  
  // 2. 如果站点目录没找到图片，尝试查找主题 source 目录 (主题自带)
  if (images.length === 0) {
    images = getImages(themeBannerDir);
  }

  return images;
});