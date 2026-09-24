/**
 * Raises the smallest type sizes to a legible mobile floor.
 *   9px  (0.563rem)  -> 11px (0.6875rem)
 *   10px (0.625rem)  -> 12px (0.75rem)
 *   hero eyebrow 8.8-9.6px -> 11px
 * 11px (0.688rem) stays as the floor for short uppercase mono labels.
 */
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const REPLACEMENTS = [
  ["text-[0.563rem]", "text-[0.6875rem]"],
  ["text-[0.625rem]", "text-[0.75rem]"],
  ["font-size: 0.55rem;", "font-size: 0.6875rem;"],
  ["font-size: 0.58rem;", "font-size: 0.6875rem;"],
  ["font-size: 0.6rem;", "font-size: 0.6875rem;"],
];

const targets = [];
for await (const f of glob(["components/**/*.tsx", "app/**/*.tsx", "app/*.css"], { cwd: ROOT })) {
  targets.push(f);
}

let changedFiles = 0;
let changedTotal = 0;

for (const rel of targets) {
  const abs = path.join(ROOT, rel);
  let src = await readFile(abs, "utf8");
  const before = src;
  let fileCount = 0;
  for (const [from, to] of REPLACEMENTS) {
    const parts = src.split(from);
    const hits = parts.length - 1;
    if (hits > 0) {
      src = parts.join(to);
      fileCount += hits;
    }
  }
  if (src !== before) {
    await writeFile(abs, src, "utf8");
    changedFiles += 1;
    changedTotal += fileCount;
    console.log(`${rel}: ${fileCount}`);
  }
}

console.log(`\n${changedTotal} replacements in ${changedFiles} files`);
