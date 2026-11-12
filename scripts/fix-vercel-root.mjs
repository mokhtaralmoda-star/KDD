import fs from "node:fs";
const p = "server/package.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));
j.scripts = j.scripts || {};
j.scripts.build = "cd .. && npm ci --no-audit --no-fund && npm run build && rm -rf server/dist && cp -r dist server/dist";
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
const v = { rewrites: [{ source: "/(.*)", destination: "/index.html" }] };
fs.writeFileSync("server/vercel.json", JSON.stringify(v, null, 2) + "\n", "utf8");
console.log("done");
