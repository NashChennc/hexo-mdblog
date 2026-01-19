const path = require('path');

module.exports = {
  escapeHtml: function(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  },

  escapeUrl: function(url) {
    if (!url) return '';
    return String(url).replace(/['"<>]/g, '');
  },
  
  // 路径标准化工具
  normalizePath: function(p) {
    return p.replace(/\\/g, '/');
  }
};