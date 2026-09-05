import { build } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await build({
  entryPoints: ["frontend/src/app.js"],
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: false,
  outfile: "dist/app.js",
  legalComments: "none",
});

await cp("frontend/index.html", "dist/index.html");
await cp("frontend/src/styles.css", "dist/styles.css");
