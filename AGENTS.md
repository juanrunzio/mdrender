# AGENTS.md

Static "Apuntes" site: Markdown notes rendered client-side in an Obsidian/HackMD style. No framework, no build step, no locally installed dependencies — plain HTML + JS + CDN libraries.

## Commands

- `node scripts/build-manifest.mjs` — regenerates `notes.json` (the manifest). **Required** after adding, renaming, or deleting any file under `notes/`; the site cannot see new notes until this runs.
- `python -m http.server 8000` — local preview, then open http://localhost:8000. The app `fetch()`es `.md` files, so opening `index.html` via `file://` (double-click) does not work.
- There is no `package.json`, no `npm install`, and no test/lint/typecheck tooling. Don't look for them.

## How it works

- `index.html` loads libraries (marked, KaTeX, highlight.js, Mermaid) from CDN and `assets/app.js`.
- `assets/app.js` is the entire app (one IIFE): fetches `notes.json`, renders Markdown, and hash-routes to `#/notes/<path>`.
- `scripts/build-manifest.mjs` walks `notes/`, emits `notes.json` as `{ home, notes: [{ path, title }] }`.

## Conventions

- Notes live in `notes/`; subfolders become sidebar folders.
- Title precedence: frontmatter `title:` → first `# H1` → filename (dashes/underscores → spaces).
- Files/dirs whose name starts with `_` or `.` are ignored — use for drafts.
- Home page: `notes/index.md` → `notes/bienvenida.md` → first note (sorted by path, Spanish collation).
- Everything is in Spanish: UI copy, code comments, and the README. Keep user-facing strings in Spanish.

## Gotchas

- `notes.json` is generated — never hand-edit it; regenerate after touching `notes/`.
- `README.md` documents a `.github/workflows/pages.yml` GitHub Actions deploy that is **not present** in this repo (no `.github/` exists). Treat that section as aspirational; there is no CI here.
- Customize the site name via `CONFIG.title` in `assets/app.js`; colors/fonts via CSS variables at the top of `assets/style.css`.
