#!/usr/bin/env node
/**
 * Mantiene assets/json/*.json sincronizados con los bloques JSON-LD inline
 * de cada página. El HTML es la fuente de verdad; estos archivos son una
 * copia legible para referencia y validación.
 *
 * Uso:
 *   node scripts/sync-jsonld.mjs            # regenera los JSON
 *   node scripts/sync-jsonld.mjs --check    # falla si hay diferencias
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const pages = [
  {
    page: 'index.html',
    byType: {
      LocalBusiness: 'local-business.json',
      FAQPage: 'faq.json',
    },
  },
  { page: 'servicio-tecnico-notebook-concepcion.html', file: 'service-notebook.json' },
  { page: 'formateo-pc-concepcion.html', file: 'service-pc.json' },
  { page: 'limpieza-pasta-termica-concepcion.html', file: 'service-pasta-termica.json' },
  { page: 'desarrollo-web-concepcion.html', file: 'service-web.json' },
];

const render = (data) => JSON.stringify(data, null, 2) + '\n';

/** Ordena claves para comparar contenido sin depender del formato. */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])])
    );
  }
  return value;
}

function sameContent(current, expected) {
  try {
    return JSON.stringify(canonical(JSON.parse(current))) === JSON.stringify(canonical(expected));
  } catch {
    return false;
  }
}

function extractBlocks(html, page) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  if (blocks.length === 0) throw new Error(`${page}: no se encontró JSON-LD inline`);
  return blocks.map((match, index) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${page}: bloque JSON-LD #${index + 1} inválido: ${error.message}`);
    }
  });
}

async function syncFile(filename, data) {
  const target = path.join(root, 'assets', 'json', filename);
  const current = await readFile(target, 'utf8').catch(() => '');
  if (sameContent(current, data)) return 0;
  if (checkOnly) {
    console.error(`desactualizado: assets/json/${filename}`);
  } else {
    await writeFile(target, render(data));
    console.log(`actualizado: assets/json/${filename}`);
  }
  return 1;
}

let differences = 0;

for (const entry of pages) {
  const html = await readFile(path.join(root, entry.page), 'utf8');
  const blocks = extractBlocks(html, entry.page);

  if (entry.page === 'index.html') {
    for (const [type, filename] of Object.entries(entry.byType)) {
      const block = blocks.find((item) => item['@type'] === type);
      if (!block) throw new Error(`${entry.page}: falta el bloque ${type}`);
      differences += await syncFile(filename, block);
    }
    continue;
  }

  if (blocks.length !== 1) {
    throw new Error(`${entry.page}: se esperaba 1 bloque JSON-LD y hay ${blocks.length}`);
  }
  differences += await syncFile(entry.file, blocks[0]);
}

if (checkOnly && differences > 0) {
  console.error(`\n${differences} archivo(s) desactualizado(s). Ejecuta: npm run sync:schema`);
  process.exit(1);
}

console.log(
  differences === 0
    ? 'JSON-LD de referencia sincronizado.'
    : `\n${differences} archivo(s) actualizado(s).`
);
