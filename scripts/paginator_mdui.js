'use strict';

const { url_for, htmlTag } = require('hexo-util');

function createLink(options, ctx) {
  const { base, format } = options;
  return (i) => url_for.call(ctx, i === 1 ? base : base + format.replace('%d', String(i)));
}

function showAll(tags, options, ctx) {
  const { total } = options;
  const link = createLink(options, ctx);
  const pageLink = createPageTag(link, options, ctx);
  for (let i = 1; i <= total; i++) {
    tags.push(pageLink(i));
  }
}

function createPageTag(link, options, ctx) {
  const { current, escape, transform, page_class: pageClass, current_class: currentClass } = options;
  return (i) => {
    const text = transform ? transform(i) : String(i);
    if (i === current) {
      return htmlTag(
        'mdui-button',
        {
          variant: 'text',
          disabled: '',
          class: `${pageClass} ${currentClass}`,
          'aria-current': 'page',
        },
        text,
        escape
      );
    }
    return htmlTag(
      'mdui-button',
      {
        variant: 'text',
        class: pageClass,
        href: link(i),
      },
      text,
      escape
    );
  };
}

function paginationPartShow(tags, options, ctx) {
  const {
    current,
    total,
    space,
    end_size: endSize,
    mid_size: midSize,
    space_class: spaceClass,
  } = options;
  const leftEnd = Math.min(endSize, current - 1);
  const rightEnd = Math.max(total - endSize + 1, current + 1);
  const leftMid = Math.max(leftEnd + 1, current - midSize);
  const rightMid = Math.min(rightEnd - 1, current + midSize);
  const spaceHtml = htmlTag('span', { class: spaceClass }, space, false);
  const link = createLink(options, ctx);
  const pageTag = createPageTag(link, options, ctx);

  for (let i = 1; i <= leftEnd; i++) {
    tags.push(pageTag(i));
  }
  if (space && leftMid - leftEnd > 1) {
    tags.push(spaceHtml);
  }
  for (let i = leftMid; i < current; i++) {
    tags.push(pageTag(i));
  }
  tags.push(pageTag(current));
  for (let i = current + 1; i <= rightMid; i++) {
    tags.push(pageTag(i));
  }
  if (space && rightEnd - rightMid > 1) {
    tags.push(spaceHtml);
  }
  for (let i = rightEnd; i <= total; i++) {
    tags.push(pageTag(i));
  }
}

hexo.extend.helper.register('paginator_mdui', function (options = {}) {
  const ctx = this;
  options = Object.assign(
    {
      base: ctx.page.base || '',
      current: ctx.page.current || 0,
      format: `${ctx.config.pagination_dir}/%d/`,
      total: ctx.page.total || 1,
      end_size: 1,
      mid_size: 2,
      space: '\u2026',
      prev_next: true,
      escape: true,
      page_class: 'post-paginator__page',
      current_class: 'post-paginator__page--current',
      space_class: 'post-paginator__ellipsis',
      prev_class: 'post-paginator__icon post-paginator__icon--prev',
      next_class: 'post-paginator__icon post-paginator__icon--next',
      force_prev_next: false,
      show_all: false,
    },
    options
  );

  const {
    current,
    total,
    prev_next: prevNext,
    prev_class: prevClass,
    next_class: nextClass,
    force_prev_next: forcePrevNext,
  } = options;

  if (!current) return '';

  const link = createLink(options, ctx);
  const tags = [];
  const prevLabel =
    typeof ctx.__ === 'function' ? ctx.__('prev') : 'Previous page';
  const nextLabel =
    typeof ctx.__ === 'function' ? ctx.__('next') : 'Next page';

  if (prevNext && current > 1) {
    tags.push(
      htmlTag(
        'mdui-button-icon',
        {
          variant: 'standard',
          class: prevClass,
          href: link(current - 1),
          rel: 'prev',
          'aria-label': prevLabel,
        },
        '<mdui-icon name="chevron_left"></mdui-icon>',
        false
      )
    );
  } else if (forcePrevNext) {
    tags.push(
      htmlTag(
        'mdui-button-icon',
        {
          variant: 'standard',
          class: prevClass,
          disabled: '',
          rel: 'prev',
          'aria-label': prevLabel,
        },
        '<mdui-icon name="chevron_left"></mdui-icon>',
        false
      )
    );
  }

  if (options.show_all) {
    showAll(tags, options, ctx);
  } else {
    paginationPartShow(tags, options, ctx);
  }

  if (prevNext && current < total) {
    tags.push(
      htmlTag(
        'mdui-button-icon',
        {
          variant: 'standard',
          class: nextClass,
          href: link(current + 1),
          rel: 'next',
          'aria-label': nextLabel,
        },
        '<mdui-icon name="chevron_right"></mdui-icon>',
        false
      )
    );
  } else if (forcePrevNext) {
    tags.push(
      htmlTag(
        'mdui-button-icon',
        {
          variant: 'standard',
          class: nextClass,
          disabled: '',
          rel: 'next',
          'aria-label': nextLabel,
        },
        '<mdui-icon name="chevron_right"></mdui-icon>',
        false
      )
    );
  }

  const navLabel =
    typeof ctx.__ === 'function' ? ctx.__('pagination_nav') : 'Pagination';

  return htmlTag(
    'nav',
    { class: 'post-paginator', 'aria-label': navLabel },
    tags.join(''),
    false
  );
});
