/**
 * Vercel uses Output Directory "dist" by default. Populate dist with static
 * assets plus index.html so the site is not empty (which causes bom1:: 404).
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const staticDir = join(root, ".vercel/output/static");
const distDir = join(root, "dist");
const serverEntry = join(
  root,
  ".vercel/output/functions/__server.func/index.mjs",
);
const port = 4173;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderHomepage() {
  const { default: nodeHandler } = await import(pathToFileURL(serverEntry));

  const server = createServer(nodeHandler);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  try {
    await wait(300);
    const res = await fetch(`http://127.0.0.1:${port}/`, {
      headers: { accept: "text/html" },
    });
    if (!res.ok) {
      throw new Error(`SSR render failed: HTTP ${res.status}`);
    }
    return res.text();
  } finally {
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

async function main() {
  if (!existsSync(staticDir)) {
    console.error("[prepare-dist] Missing .vercel/output/static — run vite build first.");
    process.exit(1);
  }
  if (!existsSync(serverEntry)) {
    console.error("[prepare-dist] Missing server function — check nitro vercel preset.");
    process.exit(1);
  }

  if (existsSync(distDir)) rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });
  cpSync(staticDir, distDir, { recursive: true });

  console.log("[prepare-dist] Rendering homepage into dist/index.html …");
  const html = await renderHomepage();
  writeFileSync(join(distDir, "index.html"), html, "utf8");

  console.log("[prepare-dist] dist/ ready for Vercel (outputDirectory: dist)");
}

main().catch((err) => {
  console.error("[prepare-dist]", err?.stack ?? err);
  process.exit(1);
});
