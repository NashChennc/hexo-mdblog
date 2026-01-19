/*
 * Wikilink Adapter for Hexo (Modularized)
 * Entry Point
 */

const processImages = require('./image-plugin');
const createWikiLinkProcessor = require('./wikilink-plugin');

// 注册 Priority 9: 图片处理
hexo.extend.filter.register('before_post_render', processImages, 9);

// 注册 Priority 10: Wiki Link 处理
// 注意：wikiLinkProcessor 需要传入 hexo 实例以访问 locals 和 config
hexo.extend.filter.register('before_post_render', createWikiLinkProcessor(hexo), 10);