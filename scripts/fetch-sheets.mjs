import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

const cfg = JSON.parse(await fs.readFile("sheets.config.json", "utf-8"));

function tabUrl(gid) {
  const u = new URL(cfg.base);
  u.searchParams.set("gid", String(gid));
  u.searchParams.set("single", "true");
  u.searchParams.set("output", "csv");
  return u.toString();
}

async function fetchCsv(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return await res.text();
}

function parseCsv(text) {
  const out = Papa.parse(text, { header: true, skipEmptyLines: true });
  if (out.errors?.length) throw new Error(out.errors[0].message);
  return out.data;
}

function normalizeSettings(rows) {
  // rows: [{key,value,note}, ...] -> { key: value }
  const obj = {};
  for (const r of rows) {
    const k = String(r.key ?? "").trim();
    if (!k) continue;
    obj[k] = (r.value ?? "").toString().trim();
  }
  return obj;
}

function assertUniqueSlugs(rows, field="slug") {
  const seen = new Set();
  for (const r of rows) {
    const v = (r[field] ?? "").toString().trim();
    if (!v) continue;
    if (seen.has(v)) throw new Error(`Duplicate ${field}: ${v}`);
    seen.add(v);
  }
}

async function main() {
  const outDir = path.join("src", "data", "generated");
  await fs.mkdir(outDir, { recursive: true });

  for (const [name, gid] of Object.entries(cfg.tabs)) {
    const url = tabUrl(gid);
    const csv = await fetchCsv(url);
    const rows = parseCsv(csv);

    let payload = rows;
    if (name === "settings") payload = normalizeSettings(rows);

    // basic validation
    if (name === "locations") assertUniqueSlugs(rows, "slug");
    if (name === "pages") assertUniqueSlugs(rows, "slug");

    await fs.writeFile(
      path.join(outDir, `${name}.json`),
      JSON.stringify(payload, null, 2),
      "utf-8"
    );
    console.log(`✓ ${name}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
