#!/usr/bin/env node
// Sammelt offene Todos aus dem Vault und schreibt _generated/offene-todos.md.
// Aufruf: node scripts/collect-todos.mjs [vault-pfad]
// Keine Abhängigkeiten, Node 18+.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const vault = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = ["journal", "meetings", "1-projekte", "2-bereiche", "3-ressourcen"];
const OUT = join(vault, "_generated", "offene-todos.md");

const TODO = /^\s*[-*] \[ \] (.+?)\s*$/;
const DUE = /(?:^|\s)@(\d{4}-\d{2}-\d{2})\b/;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // Ordner existiert (noch) nicht
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith(".md")) yield p;
  }
}

function localDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const todos = [];
for (const src of SOURCES) {
  for await (const file of walk(join(vault, src))) {
    const lines = (await readFile(file, "utf8")).split(/\r?\n/);
    let inFence = false;
    for (const line of lines) {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      if (inFence) continue;
      const m = line.match(TODO);
      if (!m) continue;
      const due = m[1].match(DUE)?.[1] ?? null;
      const text = m[1].replace(DUE, "").trim();
      if (!text) continue; // leere Checkbox aus dem Template
      todos.push({ text, due, page: basename(file, ".md"), path: relative(vault, file) });
    }
  }
}

const today = localDate();
const in7 = localDate(new Date(Date.now() + 7 * 86400000));
const byDue = (a, b) => (a.due ?? "9999").localeCompare(b.due ?? "9999") || a.path.localeCompare(b.path);

const groups = [
  ["Überfällig", todos.filter((t) => t.due && t.due < today)],
  ["Fällig in den nächsten 7 Tagen", todos.filter((t) => t.due && t.due >= today && t.due <= in7)],
  ["Später", todos.filter((t) => t.due && t.due > in7)],
  ["Ohne Datum", todos.filter((t) => !t.due)],
];

let out = `---\ntype: generated\nstand: ${today}\noffen: ${todos.length}\n---\n\n`;
out += `Erzeugt von \`scripts/collect-todos.mjs\`. Nicht von Hand bearbeiten; abgehakt wird an der Quelle.\n`;
for (const [title, items] of groups) {
  if (!items.length) continue;
  out += `\n## ${title} (${items.length})\n\n`;
  for (const t of items.sort(byDue)) {
    out += `- ${t.due ? `**${t.due}** ` : ""}${t.text} — [[${t.page}]]\n`;
  }
}
if (!todos.length) out += `\nKeine offenen Todos.\n`;

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, out, "utf8");
console.log(`${todos.length} offene Todos → ${relative(vault, OUT)}`);
