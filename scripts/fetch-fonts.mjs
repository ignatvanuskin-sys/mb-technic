// Vendors Inter Tight + JetBrains Mono (latin/cyrillic subsets) as local woff2 files,
// so the site builds and renders identically offline.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const OUT = path.resolve(process.cwd(), "app", "fonts");

const FAMILIES = [
  { css: "family=Inter+Tight:wght@300..800", slug: "inter-tight" },
  { css: "family=JetBrains+Mono:wght@400..500", slug: "jetbrains-mono" },
];

const WANTED = ["latin", "latin-ext", "cyrillic", "cyrillic-ext"];

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const fam of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?${fam.css}&display=swap`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const css = await res.text();

  // Google returns blocks: /* subset */ @font-face { ... src: url(...) format('woff2'); unicode-range: ... }
  const blocks = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
  const picked = [];

  for (const [, subset, body] of blocks) {
    if (!WANTED.includes(subset)) continue;
    const src = body.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!src) continue;
    const file = `${fam.slug}-${subset}.woff2`;
    const bin = await fetch(src[1], { headers: { "User-Agent": UA } });
    const buf = Buffer.from(await bin.arrayBuffer());
    await writeFile(path.join(OUT, file), buf);
    const range = body.match(/unicode-range:\s*([^;]+);/);
    const style = body.match(/font-style:\s*([^;]+);/);
    const weight = body.match(/font-weight:\s*([^;]+);/);
    picked.push({
      file,
      subset,
      style: style ? style[1].trim() : "normal",
      weight: weight ? weight[1].trim() : "400",
      unicodeRange: range ? range[1].trim() : "",
      kb: Math.round(buf.length / 1024),
    });
  }

  manifest[fam.slug] = picked;
  console.log(fam.slug, "->", picked.map((p) => `${p.file} (${p.kb}kb)`).join(", ") || "NONE");
}

await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\nwrote app/fonts/manifest.json");
