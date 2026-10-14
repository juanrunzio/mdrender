# Apuntes web

Sitio estático para publicar archivos Markdown con estilo tipo Obsidian/HackMD, accesible desde cualquier navegador. Sin build, sin dependencias: solo HTML + JS + CDN.

**Incluye:** LaTeX (KaTeX), callouts de Obsidian (`> [!note]`), `[[wikilinks]]`, diagramas Mermaid, código con colores y botón copiar, tablas, checklists, `==resaltado==`, modo oscuro/claro, sidebar con carpetas y búsqueda, índice lateral (TOC) y navegación anterior/siguiente.

## Publicar en GitHub Pages

1. Creá un repo en GitHub y subí todo el contenido de esta carpeta a la rama `main`.
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Listo. Cada `git push` a `main` genera `notes.json` y despliega solo. La URL queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

> Si preferís "Deploy from a branch", corré `node scripts/build-manifest.mjs` antes de cada push y commiteá `notes.json`.

## Agregar apuntes

- Poné archivos `.md` dentro de `notes/`. Las subcarpetas se convierten en carpetas del menú.
- El título sale del frontmatter (`title:`), del primer `# Título` o del nombre del archivo.
- Los archivos o carpetas que empiezan con `_` o `.` se ignoran (útil para borradores).
- La portada es `notes/index.md` si existe, si no `notes/bienvenida.md`, si no la primera nota.
- Imágenes: ponelas en `notes/` y referencialas con rutas relativas (`![](img/diagrama.png)`).

## Probar en tu PC

El sitio hace `fetch` de los `.md`, así que necesita un servidor (no abre con doble click):

```bash
node scripts/build-manifest.mjs
python -m http.server 8000
# abrir http://localhost:8000
```

## Sintaxis soportada

| Qué | Cómo |
|-----|------|
| Fórmula inline | `$a^2 + b^2 = c^2$` |
| Fórmula en bloque | `$$ ... $$` |
| Callout | `> [!tip] Título` (plegable con `-` o `+`) |
| Link entre notas | `[[Nombre de la nota]]` o `[[Nota\|texto]]` |
| Diagrama | bloque de código con ` ```mermaid ` |
| Resaltado | `==texto==` |

## Personalizar

- Nombre del sitio: `CONFIG.title` al inicio de `assets/app.js`.
- Colores y tipografía: variables CSS al inicio de `assets/style.css` (`--accent`, `--bg`, etc.).

## Archivos

```
index.html              página única
assets/app.js           render del markdown
assets/style.css        estilos
notes/                  tus apuntes
notes.json              índice (generado)
scripts/build-manifest.mjs
.github/workflows/pages.yml
```

Las librerías (marked, KaTeX, highlight.js, Mermaid) se cargan desde CDN, así que hace falta conexión a internet para verlo.
