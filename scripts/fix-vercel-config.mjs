// Nitro's generated Vercel routing config has a header-only rule for /assets/*
// without "continue: true", so Vercel stops matching and returns 404 for the files.
// This adds it so the static files are served.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const p = ".vercel/output/config.json";
if (!existsSync(p)) {
  console.log("fix-vercel-config: no .vercel/output/config.json, skipping");
  process.exit(0);
}
const cfg = JSON.parse(readFileSync(p, "utf8"));
let changed = 0;
for (const r of cfg.routes ?? []) {
  if (r.headers && r.src && !r.dest && !r.handle && r.continue !== true) {
    r.continue = true;
    changed++;
  }
}
writeFileSync(p, JSON.stringify(cfg, null, 2));
console.log(`fix-vercel-config: patched ${changed} route(s)`);
