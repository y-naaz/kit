/**
 * Rewrites import specifiers in the `svelte-package` output so the published
 * package resolves under Node ESM.
 *
 * Two things need fixing:
 *
 * 1. `$generated/types` resolves against the SOURCE tree, so svelte-package
 *    emits paths like `../../generated/types` that are wrong once the generated
 *    types land at `package/generated/types/`. Depth varies by file, so this is
 *    recomputed per file rather than pattern-matched.
 * 2. Node ESM requires fully-specified relative imports: extensionless
 *    specifiers and bare directory imports both need resolving.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';

const ROOT = 'package';
const GENERATED_INDEX = join(ROOT, 'generated', 'types', 'index.js');
const EXTENSIONS = ['.js', '.d.ts', '.svelte'];
const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*)(['"])(\.[^'"]*)\2/g;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** Relative specifier from `fromDir` to `target`, always explicitly relative. */
function relativeSpecifier(fromDir, target) {
  const spec = relative(fromDir, target).split('\\').join('/');
  return spec.startsWith('.') ? spec : `./${spec}`;
}

function resolveSpecifier(fromDir, spec) {
  // 1. Anything pointing at the generated types, at any depth.
  if (/(^|\/)generated\/types\/?$/.test(spec)) {
    return relativeSpecifier(fromDir, GENERATED_INDEX);
  }

  // Already fully specified.
  if (/\.(js|mjs|cjs|svelte|json)$/.test(spec)) {
    return spec;
  }

  const target = resolve(fromDir, spec);

  // 2. Directory import -> its index.js.
  if (
    existsSync(target) &&
    statSync(target).isDirectory() &&
    existsSync(join(target, 'index.js'))
  ) {
    return `${spec.replace(/\/$/, '')}/index.js`;
  }

  // 3. Extensionless file import -> add .js.
  if (existsSync(`${target}.js`)) {
    return `${spec}.js`;
  }

  return spec;
}

let changed = 0;
const unresolved = [];

for (const file of walk(ROOT).filter((f) => EXTENSIONS.some((ext) => f.endsWith(ext)))) {
  const original = readFileSync(file, 'utf8');
  const fromDir = dirname(file);

  let next = original.replace(SPECIFIER, (match, keyword, quote, spec) => {
    const resolved = resolveSpecifier(fromDir, spec);
    return resolved === spec ? match : `${keyword}${quote}${resolved}${quote}`;
  });

  // svelte-package leaves `lang="ts"` behind after preprocessing strips the types.
  next = next.replace(/ lang="ts"/g, '');

  if (next !== original) {
    writeFileSync(file, next);
    changed += 1;
  }

  for (const [, , , spec] of next.matchAll(SPECIFIER)) {
    if (!/\.(js|mjs|cjs|svelte|json)$/.test(spec)) {
      unresolved.push(`${file}: ${spec}`);
    }
  }
}

if (unresolved.length > 0) {
  console.error('Unresolved relative imports in package output:');
  for (const entry of unresolved) {
    console.error(`  ${entry}`);
  }
  process.exit(1);
}

console.log(`fix-package-imports: rewrote ${changed} file(s)`);
