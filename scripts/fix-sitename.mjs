import fs from "node:fs";
let bad = 0;
const rep = (f, o, n) => {
  let t = fs.readFileSync(f, "utf8");
  const c = t.split(o).length - 1;
  if (c !== 1) { console.log("FAIL " + f + " x" + c); bad++; return; }
  fs.writeFileSync(f, t.split(o).join(n), "utf8");
  console.log("ok " + f);
};
rep("client/src/kdd/lib/socketClient.ts",
  "    token: id,\n    deviceId: id,\n  };",
  "    token: id,\n    deviceId: id,\n    siteName: \"KDD\",\n  };");
rep("client/src/lib/store.ts",
  's.emit("visitor:register", { existingVisitorId, clientIp });',
  's.emit("visitor:register", { existingVisitorId, clientIp, siteName: "KDD" });');
process.exit(bad ? 1 : 0);
