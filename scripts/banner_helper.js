const { readBannerFilenames } = require('./lib/banner_images');

/**
 * 注册全局 Helper：get_banner_list
 * 策略：站点 source/image/banner → 主题 source/image/banner
 */
hexo.extend.helper.register('get_banner_list', function () {
  return readBannerFilenames(hexo);
});
