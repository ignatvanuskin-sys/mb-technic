/**
 * End-to-end smoke test against a running server.
 *   node scripts/smoke-test.mjs [baseUrl]
 * Verifies pages, SEO artefacts, booking API validation, status transitions and cleanup.
 */
const BASE = process.argv[2] ?? "http://localhost:3000";

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail = "") {
  if (condition) {
    pass += 1;
    console.log(`  PASS  ${name}`);
  } else {
    fail += 1;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function get(path, init) {
  const res = await fetch(`${BASE}${path}`, init);
  const text = await res.text();
  return { res, text };
}

const iso = (d) => d.toISOString().slice(0, 10);
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

console.log(`\nMB TECHNIC smoke test → ${BASE}\n`);

/* ── Pages ───────────────────────────────────────────────────────── */
for (const path of ["/", "/admin", "/privacy", "/robots.txt", "/sitemap.xml", "/icon.svg"]) {
  const { res, text } = await get(path);
  check(`GET ${path} → 200`, res.status === 200, `got ${res.status}`);
  check(`GET ${path} → non-empty body`, text.length > 100, `${text.length} bytes`);
}

/* ── SEO / metadata ──────────────────────────────────────────────── */
{
  const { text } = await get("/");
  check("home has <title>", /<title>/.test(text));
  check("home title mentions Mercedes/Астана", /Mercedes|Астана/.test(text));
  check("home has meta description", /name="description"/.test(text));
  check("home has OG image", /og\.jpg/.test(text));
  check("home has LocalBusiness JSON-LD", /"@type":"AutoRepair"/.test(text));
  check("JSON-LD carries real phone", /\+77007062220/.test(text));
  check("JSON-LD carries coordinates", /51\.145083/.test(text));
  check("home renders H1", /<h1[^>]*>/.test(text));
  check("hero headline visible", /Сервис[\s\S]{0,40}Mercedes/.test(text));
  check("real rating shown", /37/.test(text) && /2ГИС|2gis/i.test(text));
  check("instagram link present", /instagram\.com\/mb_technic\.kz/.test(text));
  check("2GIS link present", /2gis\.kz\/astana\/firm\/70000001103562456/.test(text));
  check("both real phones rendered", /\+7 700 706 22 20/.test(text) && /\+7 771 149 24 99/.test(text));
  check("address rendered", /Аркайым, 7/.test(text));
  check("hours rendered", /09:00/.test(text));
  check("all 8 service rows rendered", (text.match(/Ремонт двигателя|Ходовая часть|Замена масла/g) ?? []).length >= 3);
  check("real review author rendered", /Explosive 01/.test(text));
  check("no unverified 10+ years claim", !/10\+\s*(ЛЕТ|лет)/i.test(text));
}

{
  const { text } = await get("/robots.txt");
  check("robots disallows /admin", /Disallow: \/admin/.test(text));
  check("robots disallows /api", /Disallow: \/api/.test(text));
  check("robots links sitemap", /Sitemap:/.test(text));
}

{
  const { text } = await get("/sitemap.xml");
  check("sitemap lists home", /<loc>[^<]*\/<\/loc>/.test(text));
  check("sitemap lists privacy", /privacy/.test(text));
}

/* ── Admin auth gate ─────────────────────────────────────────────── */
let cookie = "";
{
  const { res } = await get("/api/bookings");
  check("GET /api/bookings unauthenticated → 401", res.status === 401, `got ${res.status}`);
}
{
  const { res } = await get("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "definitely-wrong" }),
  });
  check("POST /api/admin/session wrong password → 401", res.status === 401, `got ${res.status}`);
}
{
  const res = await fetch(`${BASE}/api/admin/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || "mb-technic" }),
  });
  const setCookie = res.headers.get("set-cookie") ?? "";
  cookie = setCookie.split(";")[0];
  check("login with admin password → 200", res.status === 200, `got ${res.status}`);
  check("login sets httpOnly session cookie", /mb_admin=/.test(setCookie));
  check("session cookie is httpOnly", /HttpOnly/i.test(setCookie), setCookie.slice(0, 80));
}
{
  const { res, text } = await get("/api/bookings", { headers: { Cookie: cookie } });
  const data = JSON.parse(text);
  check("GET /api/bookings authenticated → 200", res.status === 200, `got ${res.status}`);
  check("authenticated list returns array", Array.isArray(data.bookings));
}
{
  const { res } = await get("/api/bookings/any-id", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "CONFIRMED" }),
  });
  check("unauthenticated PATCH rejected → 401", res.status === 401, `got ${res.status}`);
}

/* ── Booking API: validation ─────────────────────────────────────── */
{
  const { res, text } = await get("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A" }),
  });
  const data = JSON.parse(text);
  check("POST invalid booking → 400", res.status === 400, `got ${res.status}`);
  check("validation lists field errors", !!data.fields && Object.keys(data.fields).length >= 4);
  check("error covers phone", !!data.fields?.phone);
  check("error covers date", !!data.fields?.date);
}

{
  /* past date must be rejected */
  const { res } = await get("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Тестовый Клиент",
      phone: "+7 700 111 22 33",
      channel: "Телефон",
      vehicleModel: "E-Класс (W211)",
      vehicleYear: "2008",
      service: "Диагностика",
      date: "2020-01-01",
      time: "10:00",
    }),
  });
  check("POST past date → 400", res.status === 400, `got ${res.status}`);
}

{
  /* honeypot must be silently swallowed */
  const { res, text } = await get("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bot Botov",
      phone: "+7 700 000 00 00",
      channel: "Телефон",
      vehicleModel: "C-Класс",
      vehicleYear: "2020",
      service: "Диагностика",
      date: iso(nextWeek),
      time: "11:00",
      company: "spam ltd",
    }),
  });
  check("honeypot request returns 200", res.status === 200);
  check("honeypot creates no booking", JSON.parse(text).booking === null);
}

/* ── Booking API: happy path + lifecycle ─────────────────────────── */
let created = null;
{
  const { res, text } = await get("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Тестовый Клиент",
      phone: "8 700 111 22 33",
      channel: "Telegram",
      telegram: "@test_client",
      vehicleModel: "S-Класс (W221)",
      vehicleYear: "2011",
      vin: "WDD2211861A000000",
      service: "Пневмоподвеска",
      date: iso(nextWeek),
      time: "14:00",
      comment: "Проверка API",
    }),
  });
  const data = JSON.parse(text);
  created = data.booking;
  check("POST valid booking → 201", res.status === 201, `got ${res.status}`);
  check("booking gets reference code MB-YYMM-NNN", /^MB-\d{4}-\d{3}$/.test(created?.code ?? ""));
  check("phone normalised to +7…", created?.phone === "+77001112233", created?.phone);
  check("telegram stored without @", created?.telegram === "test_client");
  check("status defaults to NEW", created?.status === "NEW");
  check("createdAt stamped", !!created?.createdAt);
  check("id generated", typeof created?.id === "string" && created.id.length > 5);
}

{
  const { res, text } = await get("/api/bookings", { headers: { Cookie: cookie } });
  const data = JSON.parse(text);
  check("created booking is listed", data.bookings?.some((b) => b.id === created.id));
}

{
  const { res, text } = await get(`/api/bookings/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ status: "CONFIRMED" }),
  });
  const data = JSON.parse(text);
  check("PATCH status → 200", res.status === 200, `got ${res.status}`);
  check("status became CONFIRMED", data.booking?.status === "CONFIRMED");
}

{
  const { res } = await get(`/api/bookings/${created.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ status: "NOT_A_STATUS" }),
  });
  check("PATCH invalid status → 400", res.status === 400, `got ${res.status}`);
}

{
  const { res } = await get("/api/bookings/does-not-exist", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ status: "COMPLETED" }),
  });
  check("PATCH unknown id → 404", res.status === 404, `got ${res.status}`);
}

{
  const { res } = await get("/api/bookings?demo=1", { method: "DELETE", headers: { Cookie: cookie } });
  check("DELETE demo sweep → 200", res.status === 200);
}

{
  const { res } = await get(`/api/bookings/${created.id}`, {
    method: "DELETE",
    headers: { Cookie: cookie },
  });
  check("DELETE test booking → 200 (cleanup)", res.status === 200);

  const { text } = await get("/api/bookings", { headers: { Cookie: cookie } });
  const data = JSON.parse(text);
  check("test booking removed from store", !data.bookings?.some((b) => b.id === created.id));
}

{
  const { res } = await get("/api/admin/session", { method: "DELETE", headers: { Cookie: cookie } });
  check("logout → 200", res.status === 200);
  const after = await get("/api/bookings", { headers: { Cookie: "" } });
  check("after logout list is 401 again", after.res.status === 401, `got ${after.res.status}`);
}

/* ── Admin page chrome ──────────────────────────────────────────── */
{
  const { text } = await get("/admin");
  check("admin has noindex", /noindex/.test(text));
  check("admin renders the password gate", /ПАНЕЛЬ ЗАЯВОК|Проверяем доступ/.test(text));
  check("admin does NOT leak booking data in HTML", !/MB-\d{4}-\d{3}/.test(text));
}

/* ── 404 ─────────────────────────────────────────────────────────── */
{
  const { res, text } = await get("/this-page-does-not-exist");
  check("unknown route → 404", res.status === 404, `got ${res.status}`);
  check("404 page branded", /MB TECHNIC|не найдена/i.test(text));
}

console.log(`\n${"─".repeat(52)}`);
console.log(`PASSED ${pass} · FAILED ${fail}`);
if (failures.length) {
  console.log("\nFailures:");
  failures.forEach((f) => console.log(` - ${f}`));
}
process.exit(fail === 0 ? 0 : 1);
