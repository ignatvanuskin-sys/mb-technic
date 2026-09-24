/**
 * Production smoke check — read-only apart from ONE booking POST, which is expected to
 * be rejected (or delivered) depending on how the host stores data.
 *   node scripts/prod-check.mjs https://your-deployment.vercel.app
 */
const BASE = process.argv[2];
if (!BASE) {
  console.error("Usage: node scripts/prod-check.mjs <baseUrl>");
  process.exit(2);
}

let pass = 0;
let fail = 0;
const notes = [];

const check = (name, ok, detail = "") => {
  if (ok) {
    pass += 1;
    console.log(`  PASS  ${name}`);
  } else {
    fail += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

async function get(path, init) {
  const res = await fetch(`${BASE}${path}`, init);
  const text = await res.text();
  return { res, text };
}

console.log(`\nProduction check → ${BASE}\n`);

/* ── Pages ──────────────────────────────────────────────────────── */
for (const path of ["/", "/admin", "/privacy", "/robots.txt", "/sitemap.xml", "/og.jpg", "/icon.svg"]) {
  const { res } = await get(path);
  check(`GET ${path} → 200`, res.status === 200, `got ${res.status}`);
}

const home = await get("/");
check("HTML is Russian (lang=ru)", /<html lang="ru"/.test(home.text));
check("H1 present", /<h1[^>]*>/.test(home.text));
check("real phone rendered", /\+7 700 706 22 20/.test(home.text));
check("2GIS rating rendered", /37/.test(home.text));
check("JSON-LD AutoRepair present", /"@type":"AutoRepair"/.test(home.text));
check("no unverified years-of-experience claim", !/10\+\s*(ЛЕТ|лет)/i.test(home.text));

const canonical = home.text.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "(none)";
const ogUrl = home.text.match(/property="og:url" content="([^"]+)"/)?.[1] ?? "(none)";
notes.push(`canonical: ${canonical}`);
notes.push(`og:url:    ${ogUrl}`);
check("canonical is an absolute URL", /^https?:\/\//.test(canonical), canonical);
check("canonical matches the deployed host", canonical.includes(new URL(BASE).host), canonical);

/* ── A real image and font must be served ───────────────────────── */
{
  const { res } = await get("/media/opt/owner-03.jpg");
  check("hero photo served", res.status === 200, `got ${res.status}`);
  const font = await get("/fonts/inter-tight-cyrillic.woff2");
  check("cyrillic font served", font.res.status === 200, `got ${font.res.status}`);
}

/* ── API ────────────────────────────────────────────────────────── */
{
  const { res } = await get("/api/bookings");
  check("GET /api/bookings is protected → 401", res.status === 401, `got ${res.status}`);
}

{
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const { res, text } = await get("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Проверка Деплоя",
      phone: "+7 700 555 11 22",
      channel: "WhatsApp",
      vehicleModel: "E-Класс (W211)",
      vehicleYear: "2009",
      service: "Диагностика",
      date: iso,
      time: "11:00",
      comment: "Проверка после деплоя",
    }),
  });
  let body = {};
  try {
    body = JSON.parse(text);
  } catch {
    /* ignore */
  }
  if (res.status === 201) {
    check("POST booking → 201 stored", true);
    notes.push(`booking stored with code ${body.booking?.code ?? "?"}`);
    if (body.deliveredViaTelegramOnly) notes.push("stored via Telegram fallback only");
  } else {
    check(
      "POST booking → friendly rejection (no raw error)",
      res.status === 500 || res.status === 503,
      `got ${res.status}`,
    );
    check(
      "rejection message is user-facing Russian with a phone number",
      /Позвоните|позвоните|телефон/.test(body.error ?? ""),
      body.error ?? "(no error text)",
    );
    check("no technical jargon leaked", !/TypeError|EROFS|undefined|null|500/.test(body.error ?? ""));
    notes.push(`booking POST returned ${res.status}: ${body.error ?? ""}`);
  }
}

console.log(`\n${"─".repeat(52)}`);
console.log(`PASSED ${pass} · FAILED ${fail}`);
if (notes.length) {
  console.log("\nNotes:");
  notes.forEach((n) => console.log(` - ${n}`));
}
process.exit(fail === 0 ? 0 : 1);
