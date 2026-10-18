# Apuntes

A static site for publishing Markdown notes with an Obsidian/HackMD-style look, viewable from any browser. No framework, no build step, no dependencies to install — just plain HTML, JavaScript, and libraries loaded from a CDN.

**Features:** LaTeX math (KaTeX), Obsidian callouts (`> [!note]`), `[[wikilinks]]` between notes, Mermaid diagrams, syntax-highlighted code with a copy button, tables, checklists, `==highlighting==`, dark/light theme, a sidebar with folders and search, a table of contents (TOC), and previous/next navigation.

## How it works

The whole site is one HTML page plus a couple of client-side assets:

1. **`index.html`** loads all libraries from CDNs ([marked](https://marked.js.org/) for Markdown, [KaTeX](https://katex.org/) for math, [highlight.js](https://highlightjs.org/) for code, [Mermaid](https://mermaid.js.org/) for diagrams) and then loads `assets/app.js`, which is the entire application in a single script.
2. **`scripts/build-manifest.mjs`** walks the `notes/` directory and generates `notes.json` — a small index containing every note's path and title. This is the only "build" step, and it's just a Node script (no packages to install).
3. **`assets/app.js`** fetches `notes.json`, builds the sidebar (folders become collapsible sections), and renders notes on demand:
   - The URL uses hash routing: `#/notes/<path>` points to a note, `#/` shows the home page. That means no server-side routing and no page reloads — navigation, back/forward, and shared links all work through the URL hash.
   - When you open a note, the app `fetch()`es the raw `.md` file, parses it (frontmatter, Markdown, callouts, wikilinks), renders it with marked, and post-processes math, code blocks, and Mermaid diagrams.
   - Search filters the sidebar by title as you type; the TOC is generated from the note's headings with scroll-spy; the pager at the bottom links to the previous and next note in the manifest.

Because notes are loaded with `fetch()`, the site must be served over HTTP — opening `index.html` directly from the file system (double-click) will not work.

### Home page selection

The home page is resolved in this order:

1. `notes/index.md`, if it exists
2. `notes/bienvenida.md`, if it exists
3. The first note, sorted by path

### Note titles

A note's title is resolved in this order:

1. The `title:` field in YAML frontmatter
2. The first `# Heading 1` in the file
3. The filename (dashes and underscores become spaces)

## How to use it

### Adding notes

- Drop `.md` files anywhere inside `notes/`. Subfolders automatically become folders in the sidebar.
- Files or folders whose name starts with `_` or `.` are ignored — handy for drafts.
- Put images in `notes/` and reference them with relative paths: `![](img/diagram.png)`.
- Link between notes with wikilinks: `[[Note name]]` or `[[Note name|custom text]]`.

After adding, renaming, or deleting any file under `notes/`, regenerate the manifest (the site cannot see new notes until you do):

```bash
node scripts/build-manifest.mjs
```

### Trying it locally

```bash
node scripts/build-manifest.mjs
python -m http.server 8000
# open http://localhost:8000
```

Any static file server works (`npx serve`, `php -S`, etc.).

### Publishing to GitHub Pages

This repo ships with a ready-made GitHub Actions workflow (`.github/workflows/pages.yml`) that builds the manifest and deploys the site on every push to `main`:

1. Create a GitHub repo and push everything in this folder to the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Done. Every push to `main` regenerates `notes.json` and deploys automatically. Your site will be at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

> If you'd rather use the "Deploy from a branch" option instead of Actions, run `node scripts/build-manifest.mjs` before each push and commit `notes.json`.

### Supported syntax

| What | How |
|------|-----|
| Inline math | `$a^2 + b^2 = c^2$` |
| Math block | `$$ ... $$` |
| Callout | `> [!tip] Title` (collapsible with `-` or `+`) |
| Link between notes | `[[Note name]]` or `[[Note\|text]]` |
| Diagram | code block with ` ```mermaid ` |
| Highlight | `==text==` |

Plain Markdown (tables, task lists, fenced code blocks, etc.) works as expected.

## Customization

- **Site name:** `CONFIG.title` at the top of `assets/app.js` (used in the sidebar and browser tab).
- **Colors and fonts:** CSS variables at the top of `assets/style.css` (`--accent`, `--bg`, etc.).
- **Theme:** dark/light follows your system preference by default and can be toggled with the ◐ button; the choice is saved in `localStorage`.

## Project structure

```
index.html                  the single page (loads CDN libraries + app.js)
assets/app.js               the entire app: fetches the manifest, renders Markdown, hash routing
assets/style.css            styles (CSS variables at the top)
notes/                      your notes
notes.json                  generated index — never edit by hand
scripts/build-manifest.mjs  regenerates notes.json
docs/future-updates.md      proposed improvements (e.g. full offline support)
.github/workflows/pages.yml GitHub Pages deploy workflow
```

## Requirements

The libraries (marked, KaTeX, highlight.js, Mermaid) and fonts are loaded from CDNs, so you need an internet connection the first time you load the site. After that, everything runs locally: your notes are fetched from your own server and rendering happens in the browser. Just note the CDN files are only kept in the browser cache for a while — for a fully offline setup, download the libraries into `assets/vendor/` and point `index.html` at the local copies. Building the manifest requires any recent version of Node.js.
