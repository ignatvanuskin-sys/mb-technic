/**
 * Sets Vercel project env vars through the REST API, byte-exact.
 * (Piping values through PowerShell added a UTF-8 BOM, which broke `new URL()` at build time.)
 *
 *   node scripts/set-vercel-env.mjs ADMIN_PASSWORD=<value> NEXT_PUBLIC_SITE_URL=<value>
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const TEAM_ID = "team_shtN8XYm6NbFLU1fBpKwrCVf";
const PROJECT_ID = "prj_BL8d7tq8SLCYuYBrBKVyks4ePW6Z";
const TARGET = ["production"];

/* The CLI keeps credentials in a `Data` subfolder on Windows, directly in the
   roaming profile on some versions — try both. */
const candidates = [
  path.join(process.env.APPDATA ?? "", "com.vercel.cli", "Data", "auth.json"),
  path.join(process.env.APPDATA ?? "", "com.vercel.cli", "auth.json"),
  path.join(process.env.APPDATA ?? "", "xdg.data", "com.vercel.cli", "auth.json"),
];

let token = "";
for (const candidate of candidates) {
  try {
    const parsed = JSON.parse(await readFile(candidate, "utf8"));
    if (parsed.token) {
      token = parsed.token;
      break;
    }
  } catch {
    /* try the next location */
  }
}
if (!token) throw new Error(`No Vercel token found (looked in: ${candidates.join(", ")})`);

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const pairs = process.argv
  .slice(2)
  .map((arg) => {
    const i = arg.indexOf("=");
    return [arg.slice(0, i), arg.slice(i + 1)];
  })
  .filter(([k, v]) => k && v);

if (pairs.length === 0) throw new Error("Usage: node scripts/set-vercel-env.mjs KEY=value [KEY2=value2]");

const base = `https://api.vercel.com/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`;

for (const [key, value] of pairs) {
  /* 1. Remove any existing entries for this key in the target environment. */
  const listRes = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}&decrypt=false`,
    { headers },
  );
  const list = (await listRes.json()).envs ?? [];
  const existing = list.filter((e) => e.key === key && (e.target ?? []).includes(TARGET[0]));
  for (const e of existing) {
    const del = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${e.id}?teamId=${TEAM_ID}`,
      { method: "DELETE", headers },
    );
    console.log(`removed existing ${key} (${e.id}) -> ${del.status}`);
  }

  /* 2. Create it with the exact bytes. */
  const res = await fetch(`${base}&upsert=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      key,
      value,
      type: key.startsWith("NEXT_PUBLIC_") ? "plain" : "encrypted",
      target: TARGET,
    }),
  });
  const body = await res.json();
  const stored = body?.created?.value ?? body?.value ?? "";
  const bom = value.charCodeAt(0) === 0xfeff;
  console.log(
    `${key}: HTTP ${res.status} · length ${value.length} · BOM in input: ${bom} · stored ok: ${!!(body.created || body.value)}`,
  );
  if (res.status >= 400) console.log(JSON.stringify(body).slice(0, 300));
  void stored;
}
