/**
 * Convert all .json files in this repo to clean UTF-8 (no BOM)
 * ------------------------------------------------------------
 * Usage:
 *   1️⃣  Save this file as convert-to-utf8.js
 *   2️⃣  Run in terminal:  node convert-to-utf8.js
 * ------------------------------------------------------------
 */

import fs from "fs";
import path from "path";

const rootDir = process.cwd();

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) walk(filepath, filelist);
    else if (file.endsWith(".json")) filelist.push(filepath);
  }
  return filelist;
}

const files = walk(rootDir);
if (files.length === 0) {
  console.log("⚠️  Žádné JSON soubory nenalezeny.");
  process.exit(0);
}

for (const file of files) {
  try {
    const buffer = fs.readFileSync(file);
    let text = buffer.toString("utf8");

    // Odstranění případného BOM
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

    // Pokus o dekódování nevalidního textu
    text = text.replace(/ÃÂ|ÃÂ|ÃÂ|ÃÂ|Å¯|Å¡/g, match => {
      const map = {
        "ÃÂ¡": "á", "ÃÂ": "č", "ÃÂ¯": "ů", "ÃÂ¡": "š", "ÃÂ½": "ý",
        "ÃÂ­": "í", "ÃÂ©": "é", "ÃÂ³": "ó", "ÃÂ¾": "ž"
      };
      return map[match] || match;
    });

    // Kontrola JSON formátu
    const parsed = JSON.parse(text);
    const clean = JSON.stringify(parsed, null, 2);

    fs.writeFileSync(file, clean, { encoding: "utf8" });
    console.log(`✅ ${file} převeden do UTF-8`);
  } catch (err) {
    console.error(`❌ Chyba při zpracování ${file}: ${err.message}`);
  }
}

console.log("\n🎉 Hotovo! Všechny JSON soubory jsou nyní v UTF-8 bez BOM.\n");
