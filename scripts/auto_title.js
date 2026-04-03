hexo.extend.filter.register('before_post_render', function(data) {
    if (!data.title && data.slug) {
        var lastSlug = data.slug.split('/').pop();
        data.title = lastSlug;
    }
    return data;
});