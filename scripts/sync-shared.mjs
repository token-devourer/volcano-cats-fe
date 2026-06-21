// ============================================================
// sync-shared — mirror the canonical FE⇄BE contract into the frontend
// ============================================================
// The single source of truth lives in the backend repo at
// volcano-cats-be/src/shared. This copies it into lib/shared so the
// frontend can `import ... from "@/lib/shared"`. The copies are
// committed (the FE and BE deploy independently), so re-run this
// whenever the backend contract changes:
//
//   node scripts/sync-shared.mjs
//
// The backend repo must be checked out as a sibling directory.
// ============================================================
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const feRoot = join(here, "..");
const src = join(feRoot, "..", "volcano-cats-be", "src", "shared");
const dest = join(feRoot, "lib", "shared");

if (!existsSync(src)) {
  console.error(`[sync-shared] backend shared dir not found: ${src}`);
  console.error("  Check out volcano-cats-be next to volcano-cats-fe, then re-run.");
  process.exit(1);
}

const HEADER =
  "// AUTO-GENERATED — mirror of volcano-cats-be/src/shared. DO NOT EDIT HERE.\n" +
  "// Run `node scripts/sync-shared.mjs` from the FE repo root to refresh.\n\n";

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });

const files = (await readdir(src)).filter((f) => f.endsWith(".ts"));
for (const file of files) {
  const content = await readFile(join(src, file), "utf8");
  await writeFile(join(dest, file), HEADER + content, "utf8");
}

console.log(`[sync-shared] synced ${files.length} file(s) → lib/shared`);
