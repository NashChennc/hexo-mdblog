/**
 * 顶栏亮/暗主题切换：localStorage key mdblog-theme；Shift+点击恢复跟随系统。
 */
(function () {
  var STORAGE_KEY = 'mdblog-theme';

  function getStored() {
    try {
      var t = localStorage.getItem(STORAGE_KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (e) {}
    return null;
  }

  function setStored(theme) {
    try {
      if (theme === 'light' || theme === 'dark') localStorage.setItem(STORAGE_KEY, theme);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function isEffectivelyDark() {
    var stored = getStored();
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyHtmlClass(theme) {
    var el = document.documentElement;
    el.classList.remove('mdui-theme-auto', 'mdui-theme-light', 'mdui-theme-dark');
    if (theme === 'light' || theme === 'dark') el.classList.add('mdui-theme-' + theme);
    else el.classList.add('mdui-theme-auto');
  }

  function setMduiTheme(theme) {
    if (typeof mdui !== 'undefined' && typeof mdui.setTheme === 'function') {
      mdui.setTheme(theme);
    } else {
      applyHtmlClass(theme);
    }
  }

  function updateToggleButton(btn) {
    if (!btn) return;
    var dark = isEffectivelyDark();
    var labelDark = btn.getAttribute('data-label-dark') || 'Dark mode';
    var labelLight = btn.getAttribute('data-label-light') || 'Light mode';
    if (dark) {
      btn.setAttribute('aria-label', labelLight);
      btn.setAttribute('icon', 'light_mode');
    } else {
      btn.setAttribute('aria-label', labelDark);
      btn.setAttribute('icon', 'dark_mode');
    }
  }

  function init() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    updateToggleButton(btn);

    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function () {
        if (getStored() === null) updateToggleButton(btn);
      });
    } else if (mq && mq.addListener) {
      mq.addListener(function () {
        if (getStored() === null) updateToggleButton(btn);
      });
    }

    btn.addEventListener('click', function (ev) {
      if (ev.shiftKey) {
        setStored(null);
        setMduiTheme('auto');
        applyHtmlClass('auto');
        updateToggleButton(btn);
        return;
      }

      var dark = isEffectivelyDark();
      var next = dark ? 'light' : 'dark';
      setStored(next);
      setMduiTheme(next);
      applyHtmlClass(next);
      updateToggleButton(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
