# Future updates

Ideas and pending improvements for the site. Each item is self-contained: it can be picked up later without extra context.

- [ ] **Vendor CDN libraries for full offline support** — see details below.

---

## 1. Vendor CDN libraries for full offline support

**Status:** proposed
**Effort:** small (~30 min)
**Benefit:** the site works with no internet connection at all — useful for local use, travel, or unreliable networks. Today, offline use only works while the browser keeps the CDN files cached.

### Problem

`index.html` loads all libraries from CDNs, and `assets/app.js` also points at a CDN when swapping the highlight.js theme:

| Resource | Where it comes from |
|----------|--------------------|
| KaTeX CSS + JS | `cdn.jsdelivr.net/npm/katex@0.16.11` |
| marked | `cdn.jsdelivr.net/npm/marked@12.0.2` |
| highlight.js JS + styles | `cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0` |
| Mermaid | `cdn.jsdelivr.net/npm/mermaid@10` |
| Inter / JetBrains Mono fonts | `fonts.googleapis.com` / `fonts.gstatic.com` |

Notes (`.md`) and `notes.json` are fetched from the same server, so they already work offline — only these CDN resources depend on the internet.

### Steps

1. **Download the libraries into `assets/vendor/`:**

   ```
   assets/vendor/
   ├── katex/
   │   ├── katex.min.css
   │   ├── katex.min.js
   │   └── fonts/          ← required: katex.min.css references these via url()
   ├── marked/marked.min.js
   ├── hljs/
   │   ├── highlight.min.js
   │   ├── github.min.css
   │   └── github-dark.min.css
   └── mermaid/mermaid.min.js
   ```

   Fetch each file from the exact versions currently pinned in `index.html` (KaTeX 0.16.11, marked 12.0.2, highlight.js 11.9.0, Mermaid 10).

   *Gotcha:* KaTeX's `katex.min.css` loads its math fonts with relative `url()` paths, so the `fonts/` folder must sit next to the CSS or math rendering will silently fall back to plain text.

2. **Update `index.html`:** replace the CDN `<link>`/`<script>` URLs with the local paths (`assets/vendor/...`).

3. **Update `assets/app.js`** (theme switcher, around line 27): point the highlight.js stylesheet swap at the local copies instead of `cdnjs.cloudflare.com`:

   ```js
   'assets/vendor/hljs/' + (t === 'dark' ? 'github-dark' : 'github') + '.min.css'
   ```

4. **Fonts (optional):** either download Inter and JetBrains Mono as `assets/vendor/fonts/` with a local `@font-face` stylesheet, or simply drop the Google Fonts `<link>` tags and let the CSS fall back to system fonts (check the `font-family` stacks at the top of `assets/style.css` still look reasonable).

5. **Test:** run the local server, open DevTools → Network → set throttling to **Offline**, then reload and verify: Markdown renders, math renders (fonts included), code highlighting works, theme toggle works, Mermaid diagrams draw, and the site title/fonts look right.

### Notes

- Mermaid is the largest file (several MB); if that matters, it could stay on the CDN and be made optional, at the cost of losing diagrams offline.
- Consider pinning Mermaid to a specific version (e.g. `mermaid@10.9.1`) instead of the floating `@10` when vendoring, so the local copy matches what was tested.
