import fs from "node:fs";
const p = "server/vercel.json";
const v = {
  buildCommand: "cd .. && npm ci --no-audit --no-fund && npx vite build --config vite.kdd.config.ts && rm -rf server/dist && cp -r dist server/dist",
  outputDirectory: "dist",
  rewrites: [{ source: "/(.*)", destination: "/index.html" }]
};
fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", "utf8");
console.log("ok");
