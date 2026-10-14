// Genera notes.json recorriendo notes/**/*.md
// Uso: node scripts/build-manifest.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const notesDir = path.join(root, 'notes');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name.startsWith('_')) continue; // ocultos / borradores
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (/\.md$/i.test(e.name)) out.push(full);
  }
  return out;
}

function titleOf(raw, file) {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fm) {
    const t = fm[1].match(/^title:\s*(.+)$/m);
    if (t) return t[1].replace(/^["']|["']$/g, '').trim();
  }
  const body = fm ? raw.slice(fm[0].length) : raw;
  const h1 = body.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return path.basename(file, '.md').replace(/[-_]+/g, ' ');
}

const files = (await walk(notesDir)).sort((a, b) =>
  a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' })
);

const notes = [];
for (const f of files) {
  const raw = await readFile(f, 'utf8');
  notes.push({
    path: path.relative(root, f).split(path.sep).join('/'),
    title: titleOf(raw, f),
  });
}

// La portada es notes/index.md o notes/bienvenida.md si existen; si no, la primera nota.
const home =
  notes.find((n) => n.path === 'notes/index.md') ||
  notes.find((n) => n.path === 'notes/bienvenida.md') ||
  notes[0];

await writeFile(
  path.join(root, 'notes.json'),
  JSON.stringify({ home: home ? home.path : null, notes }, null, 2) + '\n'
);
console.log(`notes.json: ${notes.length} nota(s)`);
