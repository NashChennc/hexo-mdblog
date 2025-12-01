hexo.extend.filter.register('before_post_render', function(data) {
    if (!data.title && data.slug) {
        var lastSlug = data.slug.split('/').pop();
        data.title = lastSlug;
    }
    if (!data.priority)
        data.priority = 0;
    return data;
});