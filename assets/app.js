/* ============================================================================
   GAMES 学习手册 · 交互脚本
   主题 / 搜索覆盖层 / 侧栏目录 scrollspy / 图片灯箱 / 代码复制 / 阅读进度
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------ 主题 */
  var LABELS = { light: '浅色', dark: '深色' };
  function metaTheme() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', getComputedStyle(document.body).backgroundColor || '#f5f5f7');
  }
  function setTheme(t, persist) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-label]').forEach(function (el) { el.textContent = LABELS[t] || t; });
    $$('[data-theme-toggle]').forEach(function (el) {
      el.setAttribute('aria-label', t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
      el.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    });
    try { if (persist) localStorage.setItem('theme', t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#161617' : '#f5f5f7');
  }
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light', false);
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* ------------------------------------------------------------ 打印 */
  $$('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* ------------------------------------------------------------ 移动侧栏 */
  var sidebar = $('.sidebar'), scrim = $('.side-scrim');
  function closeSide() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (scrim) scrim.classList.remove('show');
    $$('[data-side-toggle]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  $$('[data-side-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!sidebar) return;
      var open = sidebar.classList.toggle('open');
      if (scrim) scrim.classList.toggle('show', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  if (scrim) scrim.addEventListener('click', closeSide);
  $$('.sidebar a').forEach(function (a) { a.addEventListener('click', function () { if (window.innerWidth <= 1020) closeSide(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });

  /* ------------------------------------------------------------ 搜索 */
  var overlay = $('#search-overlay');
  var input = $('#search-input');
  var list = $('#search-list');
  var idx = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];
  var active = -1;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function highlight(text, q) {
    var t = esc(text), qq = esc(q);
    if (!qq) return t;
    var i = t.toLowerCase().indexOf(qq.toLowerCase());
    if (i < 0) return t;
    return t.slice(0, i) + '<mark>' + t.slice(i, i + qq.length) + '</mark>' + t.slice(i + qq.length);
  }
  function openSearch() {
    if (!overlay) return;
    overlay.classList.add('show');
    if (input) { input.value = ''; input.focus(); }
    renderSearch('');
  }
  function closeSearch() { if (overlay) overlay.classList.remove('show'); }
  function renderSearch(q) {
    if (!list) return;
    active = -1;
    q = (q || '').trim();
    if (!q) {
      list.innerHTML = '<div class="search-empty">输入关键词搜索：知识点、术语、常见坑、讲次标题</div>';
      return;
    }
    var ql = q.toLowerCase(), hits = [];
    for (var i = 0; i < idx.length; i++) {
      var it = idx[i];
      var hay = (it.t + ' ' + it.c + ' ' + (it.x || '')).toLowerCase();
      if (hay.indexOf(ql) >= 0) {
        hits.push(it);
        if (hits.length >= 30) break;
      }
    }
    if (!hits.length) {
      list.innerHTML = '<div class="search-empty">没有找到「' + esc(q) + '」</div>';
      return;
    }
    var rootPrefix = document.documentElement.getAttribute('data-root') || '';
    list.innerHTML = hits.map(function (h) {
      return '<a class="search-item" href="' + rootPrefix + esc(h.u) + '">' +
        '<div class="s-c">' + esc(h.c) + '</div>' +
        '<div class="s-t">' + highlight(h.t, q) + '</div>' +
        '<div class="s-x">' + highlight((h.x || '').slice(0, 96), q) + '</div></a>';
    }).join('');
  }
  $$('[data-search-open]').forEach(function (b) { b.addEventListener('click', openSearch); });
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  if (input) input.addEventListener('input', function () { renderSearch(input.value); });
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName || '');
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); openSearch();
    } else if (e.key === 'Escape') {
      closeSearch();
    } else if (overlay && overlay.classList.contains('show') && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      var items = $$('.search-item', list);
      if (!items.length) return;
      if (e.key === 'Enter') {
        var sel = items[active] || items[0];
        if (sel) { window.location.href = sel.getAttribute('href'); }
        e.preventDefault();
        return;
      }
      e.preventDefault();
      active = e.key === 'ArrowDown' ? (active + 1) % items.length : (active - 1 + items.length) % items.length;
      items.forEach(function (el, i) { el.classList.toggle('active', i === active); });
      items[active].scrollIntoView({ block: 'nearest' });
    }
  });

  /* ------------------------------------------------------------ 目录 scrollspy */
  var tocLinks = $$('.sidebar .toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var linksBy = {};
    tocLinks.forEach(function (a) { linksBy[a.getAttribute('href').slice(1)] = a; });
    var secs = $$('.sec').filter(function (s) { return linksBy[s.id]; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      secs.forEach(function (s) { if (visible[s.id] && !current) current = s.id; });
      tocLinks.forEach(function (a) { a.classList.remove('active'); });
      if (current && linksBy[current]) linksBy[current].classList.add('active');
    }, { rootMargin: '-88px 0px -60% 0px', threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------ 阅读进度 */
  var bar = $('#reading-bar');
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------ 图片灯箱 */
  var lightbox = $('#lightbox');
  if (lightbox) {
    $$('.fig img').forEach(function (img) {
      img.addEventListener('click', function () {
        lightbox.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || '') + '">';
        lightbox.classList.add('show');
      });
    });
    lightbox.addEventListener('click', function () { lightbox.classList.remove('show'); lightbox.innerHTML = ''; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { lightbox.classList.remove('show'); lightbox.innerHTML = ''; }
    });
  }

  /* ------------------------------------------------------------ 代码复制 */
  $$('.code-wrap').forEach(function (wrap) {
    var pre = $('pre', wrap);
    if (!pre) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');
    btn.addEventListener('click', function () {
      var text = pre.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '已复制'; setTimeout(function () { btn.textContent = '复制'; }, 1400);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); btn.textContent = '已复制'; } catch (e) {}
        document.body.removeChild(ta);
        setTimeout(function () { btn.textContent = '复制'; }, 1400);
      }
    });
    wrap.appendChild(btn);
  });

  /* ------------------------------------------------------------ 外链新窗口 */
  $$('a[href^="http"]').forEach(function (a) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
})();
