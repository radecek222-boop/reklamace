import fs from "fs";
import iconv from "iconv-lite";

const file = "orders.json";
const text = fs.readFileSync(file, "utf8");

// 🧩 Rekódování textu, který byl dvakrát zkomolen (UTF8->CP1250->UTF8)
const fixed = iconv.decode(Buffer.from(text, "binary"), "utf8");

fs.writeFileSync(file + ".bak2", text); // záloha
fs.writeFileSync(file, fixed, "utf8");

console.log("✅ Dvojitě poškozené UTF-8 znaky byly opraveny.");
console.log("📁 Záloha uložena jako", file + ".bak2");
