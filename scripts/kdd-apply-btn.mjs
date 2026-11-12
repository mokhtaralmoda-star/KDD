import fs from "node:fs";
const f = "kdd-public/admin.html";
const E = "utf8";
let t = fs.readFileSync(f, E);
const eol = t.includes("\r\n") ? "\r\n" : "\n";
const lines = t.split(eol);
let done = 0;
for (let i = lines.length - 1; i >= 0; i--) {
  const L = lines[i];
  if (L.includes("cardActionOTP") && L.includes(">OTP</button>") && !L.includes("isConnected") && !L.includes("function ")) {
    const indent = L.slice(0, L.length - L.trimStart().length);
    const app = L.replace("cardActionOTP", "cardActionApp").replace("bg-blue-600", "bg-purple-600").replace("hover:bg-blue-700", "hover:bg-purple-700").replace(">OTP</button>", ">تطبيق</button>");
    lines.splice(i, 0, indent + app.trimStart());
    done++;
  }
}
if (!done) { console.log("NO MATCH"); process.exit(1); }
fs.writeFileSync(f, lines.join(eol), E);
console.log("inserted x" + done);
console.log("cardActionApp total: " + (fs.readFileSync(f, E).split("cardActionApp").length - 1));
