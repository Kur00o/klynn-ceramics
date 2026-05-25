import { existsSync } from "node:fs";

const configPath = ".vercel/output/config.json";
const serverPath = ".vercel/output/functions/__server.func/index.mjs";

if (!existsSync(configPath) || !existsSync(serverPath)) {
  console.error(
    "\n[build] Missing Vercel Build Output API (.vercel/output).\n" +
      "Nitro did not produce a deployable server — the site will 404 on Vercel.\n" +
      "Check vite.config.ts: cloudflare must be false and nitro preset must be 'vercel'.\n",
  );
  process.exit(1);
}

const distIndex = "dist/index.html";
if (!existsSync(distIndex)) {
  console.error("\n[build] Missing dist/index.html — prepare-dist step did not run.\n");
  process.exit(1);
}

console.log("[build] Vercel output OK:", configPath);
console.log("[build] dist/index.html OK");
