(() => {
  'use strict';

  // ---------- configuración ----------
  const CONFIG = {
    title: 'Apuntes',            // nombre del sitio (sidebar, pestaña)
    manifest: 'notes.json',      // lo genera scripts/build-manifest.mjs
  };

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const slugify = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

  const state = { notes: [], home: null, current: null };
  const rootEl = document.documentElement;
  const content = $('#content');
  let spy = null;

  // ---------- tema ----------
  function applyTheme(t) {
    rootEl.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    $('#hljs-theme').href =
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/' +
      (t === 'dark' ? 'github-dark' : 'github') + '.min.css';
    mermaid.initialize({ startOnLoad: false, theme: t === 'dark' ? 'dark' : 'default', securityLevel: 'loose' });
  }

  // ---------- markdown ----------
  const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

  function splitFrontmatter(raw) {
    const m = raw.match(FM);
    const meta = {};
    if (m) {
      m[1].split(/\r?\n/).forEach((l) => {
        const kv = l.match(/^([\w-]+):\s*(.*)$/);
        if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
      });
      raw = raw.slice(m[0].length);
    }
    return { body: raw, meta };
  }

  function renderMath(tex, display) {
    try {
      return katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false });
    } catch (e) {
      return '<code>' + esc(tex) + '</code>';
    }
  }

  function findNote(name) {
    const n = name.toLowerCase();
    const base = (p) => p.split('/').pop().replace(/\.md$/i, '').toLowerCase();
    return state.notes.find((x) => base(x.path) === n || x.title.toLowerCase() === n || x.path.toLowerCase() === n);
  }

  // Protege código y matemática antes de pasar por marked.
  function preprocess(md) {
    const code = [];
    const math = [];
    const keepCode = (m) => '@@C' + (code.push(m) - 1) + '@@';
    const keepMath = (tex, display) => '@@M' + (math.push(renderMath(tex, display)) - 1) + '@@';

    md = md.replace(/^([ \t]*)(```|~~~)[^\n]*\n[\s\S]*?^[ \t]*\2[ \t]*$/gm, (m, ind) => ind + keepCode(m.slice(ind.length)));
    md = md.replace(/`[^`\n]+`/g, keepCode);

    md = md.replace(/\$\$([\s\S]+?)\$\$/g, (m, t) => keepMath(t, true));
    md = md.replace(/(?<![\\$\w])\$(?=[^\s$])([^$\n]*?[^\s$\\])\$(?![\d$])/g, (m, t) => keepMath(t, false));

    // [[wikilinks]] estilo Obsidian
    md = md.replace(/(!?)\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g, (m, bang, name, hd, alias) => {
      name = name.trim();
      if (bang) return /\.(png|jpe?g|gif|svg|webp)$/i.test(name) ? '![' + name + '](' + encodeURI(name) + ')' : m;
      const label = (alias || name).trim();
      const n = findNote(name);
      return n ? '[' + label + '](#/' + encodeURI(n.path) + ')' : '<span class="broken-link">' + esc(label) + '</span>';
    });

    // ==resaltado==
    md = md.replace(/==(?=\S)([^=\n]+?)(?<=\S)==/g, '<mark>$1</mark>');

    md = md.replace(/@@C(\d+)@@/g, (m, i) => code[i]);
    return { text: md, math };
  }

  marked.use({
    gfm: true,
    renderer: {
      code(code, infostring) {
        const lang = ((infostring || '').match(/\S*/) || [''])[0].toLowerCase();
        if (lang === 'mermaid') return '<div class="mermaid">' + esc(code) + '</div>';
        let html;
        try {
          html = lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : esc(code);
        } catch (e) { html = esc(code); }
        return (
          '<div class="codeblock"><div class="codebar"><span>' + esc(lang || 'texto') +
          '</span><button type="button" class="copy">Copiar</button></div><pre><code class="hljs' +
          (lang ? ' language-' + esc(lang) : '') + '">' + html + '</code></pre></div>'
        );
      },
    },
  });

  // ---------- callouts (> [!note] Título) ----------
  const KIND = {
    note: 'blue', info: 'blue', todo: 'blue', abstract: 'blue', summary: 'blue', tldr: 'blue',
    tip: 'green', hint: 'green', success: 'green', check: 'green', done: 'green',
    warning: 'yellow', caution: 'yellow', attention: 'yellow', question: 'yellow', help: 'yellow', faq: 'yellow',
    danger: 'red', error: 'red', failure: 'red', fail: 'red', bug: 'red', missing: 'red',
    example: 'purple', important: 'purple',
    quote: 'gray', cite: 'gray',
  };
  const ICON = {
    note: '📝', info: 'ℹ️', todo: '☑️', abstract: '📋', summary: '📋', tldr: '📋',
    tip: '💡', hint: '💡', success: '✅', check: '✅', done: '✅',
    warning: '⚠️', caution: '⚠️', attention: '⚠️', question: '❓', help: '❓', faq: '❓',
    danger: '🔥', error: '🔥', failure: '❌', fail: '❌', bug: '🐛', missing: '❌',
    example: '📖', important: '❗', quote: '❝', cite: '❝',
  };

  function callouts(root) {
    root.querySelectorAll('blockquote').forEach((bq) => {
      const p = bq.firstElementChild;
      if (!p || p.tagName !== 'P') return;
      const m = p.innerHTML.match(/^\s*\[!(\w+)\]([+-]?)[ \t]*([^\n]*)/);
      if (!m) return;
      const type = m[1].toLowerCase();
      const fold = m[2];
      const title = m[3].trim() || cap(type);
      const rest = p.innerHTML.slice(m[0].length).replace(/^\n/, '');

      const wrap = document.createElement(fold ? 'details' : 'div');
      wrap.className = 'callout';
      wrap.dataset.kind = KIND[type] || 'blue';
      if (fold === '+') wrap.open = true;

      const head = document.createElement(fold ? 'summary' : 'div');
      head.className = 'callout-title';
      head.innerHTML = '<span class="callout-icon">' + (ICON[type] || '📝') + '</span><span>' + title + '</span>';

      if (rest.trim()) p.innerHTML = rest; else p.remove();
      const body = document.createElement('div');
      body.className = 'callout-body';
      body.append(...bq.childNodes);

      wrap.append(head, body);
      bq.replaceWith(wrap);
    });
  }

  // ---------- post-proceso del HTML renderizado ----------
  function postProcess(root, notePath) {
    const base = new URL(notePath, location.href.split('#')[0]);
    const siteBase = new URL('./', location.href.split('#')[0]).href;

    callouts(root);

    // tablas con scroll horizontal
    root.querySelectorAll('table').forEach((t) => {
      const w = document.createElement('div');
      w.className = 'table-wrap';
      t.replaceWith(w);
      w.append(t);
    });

    // ids + anchors en headings
    const used = {};
    root.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => {
      const clone = h.cloneNode(true);
      clone.querySelectorAll('.katex-mathml').forEach((x) => x.remove());
      const text = clone.textContent.trim();
      let id = slugify(text) || 'seccion';
      used[id] = (used[id] || 0) + 1;
      if (used[id] > 1) id += '-' + used[id];
      h.id = id;
      h.dataset.text = text;
      if (/^H[234]$/.test(h.tagName)) {
        const a = document.createElement('a');
        a.className = 'anchor';
        a.href = '#' + id;
        a.textContent = '#';
        h.prepend(a);
      }
    });

    // links
    root.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) {
        if (/^https?:/i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
        return;
      }
      const clean = href.split('#')[0];
      if (/\.md$/i.test(clean)) {
        const url = new URL(clean, base).href;
        a.setAttribute('href', '#/' + encodeURI(decodeURIComponent(url.replace(siteBase, ''))));
      }
    });

    // imágenes relativas a la nota
    root.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !/^([a-z][a-z0-9+.-]*:|\/\/|data:)/i.test(src)) img.src = new URL(src, base).href;
    });
  }

  // ---------- TOC ----------
  function buildToc(root) {
    const toc = $('#toc');
    if (spy) spy.disconnect();
    const heads = [...root.querySelectorAll('h2,h3,h4')];
    if (heads.length < 2) { toc.innerHTML = ''; return; }
    toc.innerHTML =
      '<div class="toc-title">En esta página</div>' +
      heads.map((h) => '<a data-level="' + h.tagName[1] + '" href="#' + h.id + '">' + esc(h.dataset.text) + '</a>').join('');

    const links = new Map(heads.map((h) => [h.id, toc.querySelector('a[href="#' + CSS.escape(h.id) + '"]')]));
    spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l && l.classList.remove('active'));
          const l = links.get(e.target.id);
          if (l) l.classList.add('active');
        }
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    heads.forEach((h) => spy.observe(h));
  }

  // ---------- sidebar ----------
  const rel = (n) => n.path.replace(/^notes\//, '');
  const pretty = (s) => s.replace(/[-_]+/g, ' ');

  function buildTree(notes) {
    const tree = { folders: {}, files: [] };
    notes.forEach((n) => {
      const parts = rel(n).split('/');
      parts.pop();
      let node = tree;
      parts.forEach((p) => { node = node.folders[p] = node.folders[p] || { folders: {}, files: [] }; });
      node.files.push(n);
    });
    return tree;
  }

  function renderTree(node) {
    const folders = Object.keys(node.folders).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
    return (
      folders.map((f) => '<details><summary>' + esc(pretty(f)) + '</summary><div class="children">' + renderTree(node.folders[f]) + '</div></details>').join('') +
      node.files.map((n) => '<a class="nav-item" data-path="' + esc(n.path) + '" href="#/' + encodeURI(n.path) + '">' + esc(n.title) + '</a>').join('')
    );
  }

  function renderNav(query) {
    const nav = $('#nav');
    const q = (query || '').trim().toLowerCase();
    if (!state.notes.length) { nav.innerHTML = '<div class="nav-empty">Todavía no hay notas.</div>'; return; }
    if (q) {
      const terms = q.split(/\s+/);
      const hits = state.notes.filter((n) => terms.every((t) => (n.title + ' ' + n.path).toLowerCase().includes(t)));
      nav.innerHTML = hits.length
        ? hits.map((n) => '<a class="nav-item" data-path="' + esc(n.path) + '" href="#/' + encodeURI(n.path) + '">' + esc(n.title) + '<br><small style="color:var(--muted)">' + esc(rel(n)) + '</small></a>').join('')
        : '<div class="nav-empty">Sin resultados.</div>';
    } else {
      nav.innerHTML = renderTree(buildTree(state.notes));
    }
    markActive();
  }

  function markActive() {
    document.querySelectorAll('.nav-item.active').forEach((a) => a.classList.remove('active'));
    if (!state.current) return;
    const a = [...document.querySelectorAll('.nav-item')].find((x) => x.dataset.path === state.current);
    if (!a) return;
    a.classList.add('active');
    for (let p = a.parentElement; p && p.id !== 'nav'; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
  }

  // ---------- navegación entre notas ----------
  function renderPager() {
    const i = state.notes.findIndex((n) => n.path === state.current);
    const prev = state.notes[i - 1];
    const next = state.notes[i + 1];
    const link = (n, cls, label) =>
      n ? '<a class="' + cls + '" href="#/' + encodeURI(n.path) + '"><small>' + label + '</small>' + esc(n.title) + '</a>' : '<span style="flex:1"></span>';
    $('#pager').innerHTML = i < 0 ? '' : link(prev, 'prev', '← Anterior') + link(next, 'next', 'Siguiente →');
  }

  function renderCrumbs(path) {
    const parts = rel({ path }).split('/');
    parts.pop();
    $('#crumbs').textContent = parts.map(pretty).join(' / ');
  }

  // ---------- carga de una nota ----------
  async function openNote(path) {
    state.current = path;
    markActive();
    document.body.classList.remove('sb-open');

    let raw;
    try {
      const res = await fetch(encodeURI(path), { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      raw = await res.text();
    } catch (err) {
      content.innerHTML = '<div class="error"><h2>No se pudo cargar la nota</h2><p><code>' + esc(path) + '</code></p><p>' + esc(String(err.message || err)) +
        '</p><p>Si abriste <code>index.html</code> con doble click, necesitás un servidor local: <code>python -m http.server</code></p></div>';
      $('#toc').innerHTML = ''; $('#pager').innerHTML = ''; $('#crumbs').textContent = '';
      return;
    }

    const { body, meta } = splitFrontmatter(raw);
    const pre = preprocess(body);
    let html = marked.parse(pre.text);
    html = html.replace(/@@M(\d+)@@/g, (m, i) => pre.math[i]);

    content.innerHTML = html;
    postProcess(content, path);

    const h1 = content.querySelector('h1');
    const noteMeta = state.notes.find((n) => n.path === path);
    const title = meta.title || (h1 && h1.dataset.text) || (noteMeta && noteMeta.title) || path;
    document.title = title + ' · ' + CONFIG.title;
    $('#topbar-title').textContent = title;

    renderCrumbs(path);
    buildToc(content);
    renderPager();
    window.scrollTo(0, 0);

    const nodes = content.querySelectorAll('.mermaid');
    if (nodes.length) { try { await mermaid.run({ nodes }); } catch (e) { console.warn('mermaid:', e); } }
  }

  function route() {
    const h = location.hash;
    let path = h.startsWith('#/') ? decodeURIComponent(h.slice(2)) : '';
    if (!path) path = state.home;
    if (!path) {
      content.innerHTML = '<div class="empty"><h2>' + esc(CONFIG.title) + '</h2><p>Agregá archivos <code>.md</code> en la carpeta <code>notes/</code> y generá el manifest.</p></div>';
      return;
    }
    openNote(path);
  }

  // ---------- eventos ----------
  document.addEventListener('click', (e) => {
    const copy = e.target.closest('.copy');
    if (copy) {
      const code = copy.closest('.codeblock').querySelector('code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        copy.textContent = '¡Copiado!';
        setTimeout(() => (copy.textContent = 'Copiar'), 1200);
      });
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (a && !a.getAttribute('href').startsWith('#/') && a.getAttribute('href').length > 1) {
      e.preventDefault();
      const t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  window.addEventListener('hashchange', route);
  $('#theme-btn').addEventListener('click', () => {
    applyTheme(rootEl.dataset.theme === 'dark' ? 'light' : 'dark');
    if (state.current) openNote(state.current);
  });
  $('#menu-btn').addEventListener('click', () => document.body.classList.toggle('sb-open'));
  $('#scrim').addEventListener('click', () => document.body.classList.remove('sb-open'));
  $('#search').addEventListener('input', (e) => renderNav(e.target.value));
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      document.body.classList.add('sb-open');
      $('#search').focus();
    }
    if (e.key === 'Escape') { $('#search').blur(); document.body.classList.remove('sb-open'); }
  });

  // ---------- arranque ----------
  async function init() {
    applyTheme(rootEl.dataset.theme || 'dark');
    $('#brand').textContent = CONFIG.title;
    $('#topbar-title').textContent = CONFIG.title;
    try {
      const res = await fetch(CONFIG.manifest, { cache: 'no-cache' });
      const data = await res.json();
      state.notes = data.notes || [];
      state.home = data.home || (state.notes[0] && state.notes[0].path) || null;
    } catch (e) {
      console.warn('No se pudo leer ' + CONFIG.manifest, e);
    }
    renderNav('');
    route();
  }

  init();
})();
