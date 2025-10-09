// =====================================================
// 🌍 White Glove Service – Konfigurace mapy a sídla firmy
// Soubor: wgs-config-map.js
// Autor: GPT-5 & Hugo
// Verze: 2025-10
// =====================================================

console.log("🌐 Načítám konfiguraci WGS mapy...");

// 🧭 Funkce pro normalizaci pražských adres (stejná logika jako v seznam.html)
function normalizePrahaAddress(a) {
  if (!a) return "";
  let t = a.trim();

  // sjednocení formátu „Praha 9 - Běchovice“
  t = t.replace(/\bHlavní město Praha\b/gi, "Praha");
  t = t.replace(/\s+/g, " ");

  const doplnky = [
    { match: /do dubče/i, add: "Praha 9 - Běchovice" },
    { match: /běchovic/i, add: "Praha 9 - Běchovice" },
    { match: /190 ?11/i, add: "Praha 9 - Běchovice" }
  ];

  for (const d of doplnky) {
    if (d.match.test(t) && !t.toLowerCase().includes(d.add.toLowerCase())) {
      if (!/praha\s*\d/i.test(t)) t += ", " + d.add;
    }
  }

  if (/praha/i.test(t) && !/praha\s*\d/i.test(t)) {
    t += ", Praha 9 - Běchovice";
  }

  return t.trim();
}

// 🏢 Oficiální konfigurace WGS sídla
const WGS_CONFIG = {
  name: "White Glove Service s.r.o.",
  address: normalizePrahaAddress("Do Dubče 364, Praha 9 Běchovice, 19011"),
  lat: 50.08031890414999,   // přesně ověřeno: Do Dubče 364, 190 11 Praha 9 – Běchovice
  lng: 14.59812450867171
};

// 🌍 Export pro ostatní části systému (globální proměnné)
window.WGS_CONFIG = WGS_CONFIG;
window.WGS_COORDS = [WGS_CONFIG.lat, WGS_CONFIG.lng];

console.log("🌍 WGS config loaded:", WGS_CONFIG);
