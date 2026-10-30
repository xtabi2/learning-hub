/**
 * Apply prisma/migrations/<name>/migration.sql to a Turso/libSQL DB, idempotently.
 * Applied migrations are tracked in table _turso_migrations (name + sha256 checksum).
 *
 *   TURSO_DATABASE_URL=libsql://<db>-<org>.turso.io TURSO_AUTH_TOKEN=... npm run db:turso:migrate
 *
 * (prisma migrate deploy cannot target libsql:// URLs, hence this script.)
 */
import { createClient } from "@libsql/client";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (process.argv.includes("--if-configured") && (!url || (url.startsWith("libsql://") && !token))) {
    console.log("Turso URL or auth token not set; skipping Turso migrations (SQLite/db push path).");
    return;
  }
  if (!url) throw new Error("TURSO_DATABASE_URL is required (libsql://... or file:...)");
  const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || undefined });
  const dir = path.join(process.cwd(), "prisma", "migrations");

  await client.execute(
    `CREATE TABLE IF NOT EXISTS "_turso_migrations" (
      "name" TEXT PRIMARY KEY NOT NULL,
      "checksum" TEXT NOT NULL,
      "applied_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  );
  const applied = new Map<string, string>();
  const rs = await client.execute(`SELECT name, checksum FROM "_turso_migrations"`);
  for (const row of rs.rows) applied.set(String(row.name), String(row.checksum));

  const names = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(path.join(dir, d.name, "migration.sql")))
    .map((d) => d.name)
    .sort();

  // Baseline: a DB created before migration tracking already has the init schema.
  if (applied.size === 0 && names.includes("0001_init")) {
    const t = await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='User'`);
    if (t.rows.length > 0) {
      const sql = readFileSync(path.join(dir, "0001_init", "migration.sql"), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      await client.execute({ sql: `INSERT INTO "_turso_migrations" (name, checksum) VALUES (?, ?)`, args: ["0001_init", checksum] });
      applied.set("0001_init", checksum);
      console.log("= 0001_init (baselined: tables already exist)");
    }
  }

  let count = 0;
  for (const name of names) {
    const sql = readFileSync(path.join(dir, name, "migration.sql"), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const prev = applied.get(name);
    if (prev) {
      if (prev !== checksum) console.warn(`! ${name}: already applied but file changed (checksum mismatch) - not re-applying`);
      else console.log(`= ${name} (already applied)`);
      continue;
    }
    // executeMultiple runs the whole script; wrap in a transaction so a failure leaves nothing half-applied.
    await client.executeMultiple(`BEGIN;\n${sql}\nINSERT INTO "_turso_migrations" (name, checksum) VALUES ('${name.replace(/'/g, "''")}', '${checksum}');\nCOMMIT;`);
    console.log(`+ ${name} applied`);
    count++;
  }
  console.log(`Done. ${count} new migration(s) applied, ${names.length} total.`);
  client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
