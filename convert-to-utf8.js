import fs from "fs";
import iconv from "iconv-lite";

const file = process.argv[2];
if (!file) {
  console.error("Použití: node convert-to-utf8.js orders.json");
  process.exit(1);
}

try {
  const buffer = fs.readFileSync(file);
  // 🧩 Převod z Windows-1250 (CP1250) na UTF-8
  const text = iconv.decode(buffer, "win1250");

  // vytvoření zálohy
  fs.writeFileSync(file + ".bak", buffer);

  // přepsání jako čistý UTF-8 bez BOM
  fs.writeFileSync(file, text, { encoding: "utf8" });

  console.log(`✅ Soubor ${file} byl úspěšně převeden do UTF-8.`);
  console.log("Záloha vytvořena jako:", file + ".bak");
} catch (err) {
  console.error("❌ Chyba při převodu:", err.message);
}
