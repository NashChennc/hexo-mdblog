(function () {
  'use strict';

  var dock = document.getElementById('site-search-dock');
  var toggle = document.getElementById('site-search-toggle');
  var field = document.getElementById('site-search-field');
  var resultsEl = document.getElementById('site-search-results');
  if (!dock || !toggle || !field || !resultsEl) return;

  var searchUrl = dock.getAttribute('data-search-url') || '';
  var noResultsText = dock.getAttribute('data-search-no-results') || 'No results';

  var cache = null;
  var cachePromise = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightText(text, q) {
    if (!q) return escapeHtml(text);
    var ql = q.toLowerCase();
    var lower = String(text).toLowerCase();
    var idx = lower.indexOf(ql);
    if (idx === -1) return escapeHtml(text);
    var parts = [];
    var start = 0;
    var escapedQ = escapeHtml(q);
    while (idx !== -1) {
      parts.push(escapeHtml(String(text).slice(start, idx)));
      parts.push('<mark class="site-search-mark">' + escapedQ + '</mark>');
      start = idx + q.length;
      idx = lower.indexOf(ql, start);
    }
    parts.push(escapeHtml(String(text).slice(start)));
    return parts.join('');
  }

  function stripHtml(html) {
    return String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function snippetFromContent(content, q, maxLen) {
    maxLen = maxLen || 120;
    var plain = stripHtml(content || '');
    if (!q) return plain.slice(0, maxLen) + (plain.length > maxLen ? '…' : '');
    var lower = plain.toLowerCase();
    var ql = q.toLowerCase();
    var i = lower.indexOf(ql);
    if (i === -1) return plain.slice(0, maxLen) + (plain.length > maxLen ? '…' : '');
    var pad = 40;
    var start = Math.max(0, i - pad);
    var end = Math.min(plain.length, i + q.length + pad);
    var seg = plain.slice(start, end);
    var prefix = start > 0 ? '…' : '';
    var suffix = end < plain.length ? '…' : '';
    return prefix + seg + suffix;
  }

  function loadIndex() {
    if (cache) return Promise.resolve(cache);
    if (cachePromise) return cachePromise;
    cachePromise = fetch(searchUrl, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('search fetch failed');
        return res.json();
      })
      .then(function (data) {
        cache = Array.isArray(data) ? data : [];
        return cache;
      })
      .catch(function () {
        cache = [];
        return cache;
      });
    return cachePromise;
  }

  function runSearch(q) {
    var query = (q || '').trim().toLowerCase();
    resultsEl.innerHTML = '';
    if (!query) return;

    loadIndex().then(function (items) {
      var matches = [];
      for (var i = 0; i < items.length; i++) {
        var it = items[i] || {};
        var title = it.title != null ? String(it.title) : '';
        var content = it.content != null ? String(it.content) : '';
        var titleHit = title.toLowerCase().indexOf(query) !== -1;
        var bodyHit = content.toLowerCase().indexOf(query) !== -1;
        if (titleHit || bodyHit) {
          matches.push({
            title: title,
            url: it.url || '#',
            content: content,
            titleHit: titleHit,
            bodyHit: bodyHit,
            order: titleHit ? 0 : 1
          });
        }
      }
      matches.sort(function (a, b) {
        if (a.order !== b.order) return a.order - b.order;
        return 0;
      });

      if (!matches.length) {
        var p = document.createElement('p');
        p.className = 'site-search-results__empty';
        p.textContent = noResultsText;
        resultsEl.appendChild(p);
        return;
      }

      var list = document.createElement('div');
      list.className = 'site-search-results__list';
      for (var j = 0; j < matches.length; j++) {
        var m = matches[j];
        var a = document.createElement('a');
        a.className = 'site-search-results__item';
        a.href = m.url;
        a.innerHTML = highlightText(m.title || '(untitled)', query);
        var sn = snippetFromContent(m.content, query);
        if (sn) {
          var span = document.createElement('span');
          span.className = 'site-search-results__snippet';
          span.innerHTML = highlightText(sn, query);
          a.appendChild(span);
        }
        list.appendChild(a);
      }
      resultsEl.appendChild(list);
    });
  }

  var throttledRun =
    typeof mdui !== 'undefined' && typeof mdui.throttle === 'function'
      ? mdui.throttle(runSearch, 200)
      : runSearch;

  function setOpen(open) {
    if (open) {
      dock.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      field.focus();
    } else {
      dock.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
      resultsEl.innerHTML = '';
      field.value = '';
    }
  }

  function isOpen() {
    return !dock.hasAttribute('hidden');
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });

  field.addEventListener('input', function () {
    var v = field.value || '';
    resultsEl.innerHTML = '';
    if (!v.trim()) return;
    throttledRun(v);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
})();
