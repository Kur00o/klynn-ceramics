/**
 * Vercel publishes "dist" by default. This script fills dist/ with static assets
 * and pre-rendered HTML for every route (no SPA rewrites required).
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
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

const routes = [
  "/",
  "/bowls",
  "/plates",
  "/mugs",
  "/china-sets",
  "/gifting-sets",
  "/contact",
  "/product/kura-bowl",
  "/product/ash-bowl",
  "/product/loam-bowl",
  "/product/ember-bowl",
  "/product/linen-plate",
  "/product/marl-plate",
  "/product/vellum-plate",
  "/product/field-plate",
  "/product/morning-mug",
  "/product/ember-mug",
  "/product/cloud-mug",
  "/product/harvest-mug",
  "/product/the-host",
  "/product/first-home",
  "/product/morning-ritual",
  "/product/anniversary-set",
  "/product/earth-china",
  "/product/linen-china",
  "/product/ash-china",
];

function routeToFile(route) {
  if (route === "/") return join(distDir, "index.html");
  const segments = route.replace(/^\//, "").split("/");
  return join(distDir, ...segments, "index.html");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickPort() {
  return 30000 + Math.floor(Math.random() * 20000);
}

/** New server per route avoids srvx "remoteAddress" crash on reuse. */
async function renderRoute(path, nodeHandler) {
  const port = pickPort();
  const server = createServer(nodeHandler);

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  try {
    await wait(200);
    const res = await fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { accept: "text/html" },
    });
    if (!res.ok) {
      throw new Error(`${path} → HTTP ${res.status}`);
    }
    return res.text();
  } finally {
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

function generateFallbackIndex() {
  const assetsDir = join(distDir, "assets");
  const files = readdirSync(assetsDir);
  const jsFiles = files.filter((f) => f.endsWith(".js"));
  const mainJs = jsFiles.sort(
    (a, b) => statSync(join(assetsDir, b)).size - statSync(join(assetsDir, a)).size,
  )[0];
  const css = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

  if (!mainJs) throw new Error("No JS bundle found in dist/assets");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Klynn Ceramics: Handcrafted Ceramics</title>
  <meta name="description" content="Handcrafted ceramics designed for everyday rituals."/>
  ${css ? `<link rel="stylesheet" href="/assets/${css}"/>` : ""}
</head>
<body>
  <script type="module" src="/assets/${mainJs}"></script>
</body>
</html>`;
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

  let nodeHandler;
  try {
    const mod = await import(pathToFileURL(serverEntry));
    nodeHandler = mod.default;
  } catch (err) {
    console.warn("[prepare-dist] Could not load SSR server, using client-only fallback.");
    console.warn(err?.message ?? err);
    const html = generateFallbackIndex();
    writeFileSync(join(distDir, "index.html"), html, "utf8");
    console.log("[prepare-dist] Wrote fallback dist/index.html");
    return;
  }

  console.log("[prepare-dist] Pre-rendering", routes.length, "routes into dist/ …");
  let failed = 0;

  for (const route of routes) {
    try {
      const html = await renderRoute(route, nodeHandler);
      const outFile = routeToFile(route);
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, html, "utf8");
      console.log("  ✓", route);
    } catch (err) {
      failed++;
      console.warn("  ✗", route, "—", err?.message ?? err);
    }
  }

  if (!existsSync(join(distDir, "index.html"))) {
    console.warn("[prepare-dist] Homepage missing — writing fallback index.html");
    writeFileSync(join(distDir, "index.html"), generateFallbackIndex(), "utf8");
  }

  if (failed === routes.length) {
    console.error("[prepare-dist] All routes failed to render.");
    process.exit(1);
  }

  console.log(
    `[prepare-dist] dist/ ready (${routes.length - failed}/${routes.length} routes, outputDirectory: dist)`,
  );
}

main().catch((err) => {
  console.error("[prepare-dist]", err?.stack ?? err);
  process.exit(1);
});
