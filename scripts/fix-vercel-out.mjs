import fs from "node:fs";
const v = {
  buildCommand: "cd .. && npm ci --no-audit --no-fund && npx vite build --config vite.kdd.config.ts",
  outputDirectory: "../dist",
  rewrites: [{ source: "/(.*)", destination: "/index.html" }]
};
fs.writeFileSync("server/vercel.json", JSON.stringify(v, null, 2) + "\n", "utf8");
console.log("ok");
