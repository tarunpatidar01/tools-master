/**
 * Generates data/tools-meta.json — a lightweight index of every tool.
 *
 * data/tools.json carries the full long-form article body for each tool (~180 KB).
 * Client components (sidebar, search) only need the identifying fields, so
 * importing the full file into a client bundle shipped ~175 KB of dead weight to
 * every visitor. This script derives the slim index that client code imports.
 *
 * Run automatically via the `prebuild` npm script.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tools = JSON.parse(readFileSync(join(root, 'data/tools.json'), 'utf8'));

const meta = tools.map(({ id, slug, keyword, hindi, category, title, description, monthlySearches }) => ({
  id,
  slug,
  keyword,
  hindi,
  category,
  title,
  description,
  monthlySearches,
}));

const out = join(root, 'data/tools-meta.json');
writeFileSync(out, JSON.stringify(meta, null, 2) + '\n', 'utf8');

const full = readFileSync(join(root, 'data/tools.json'), 'utf8').length;
const slim = JSON.stringify(meta).length;
console.log(
  `tools-meta.json: ${meta.length} tools, ${(slim / 1024).toFixed(1)} KB ` +
  `(down from ${(full / 1024).toFixed(1)} KB)`
);
