/* ====================================================================
💎 WHITE GLOVE SERVICE – Synchronizace dat s GitHubem
====================================================================
Verze systému:       v1.0
Datum sestavení:     2025-10-08
Autor:               Hugo (White Glove Service) & GPT-5
Projekt:             WGS reklamace / servisní systém
Soubor:              wgs-sync.js
Worker:              https://wgs-token.72nvwf4pb2.workers.dev/update
Repozitář:           https://github.com/radecek222-boop/reklamace
Popis:
  Zajišťuje obousměrnou synchronizaci dat mezi frontendem (localStorage)
  a GitHub repozitářem přes Cloudflare Workera.

Funkce:
  • saveCustomerEdit(item) – uloží upravený záznam lokálně
  • sendUpdatesToGitHub() – odešle změny na GitHub
  • autoSyncOnLoad() – při načtení stránky odešle čekající změny
  • autoSyncOnExit() – před zavřením stránky pošle změny
==================================================================== */

/* 🧩 1. Uložení upraveného záznamu do localStorage */
function saveCustomerEdit(updatedItem) {
  if (!updatedItem || !updatedItem.cislo) return;
  const key = "updatedRecords";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  const index = existing.findIndex(r => r.cislo === updatedItem.cislo);
  if (index >= 0) existing[index] = updatedItem;
  else existing.push(updatedItem);

  localStorage.setItem(key, JSON.stringify(existing));
  console.log("💾 Lokálně uloženo k synchronizaci:", updatedItem.cislo);
}

/* 🧩 2. Odeslání všech změn na GitHub */
async function sendUpdatesToGitHub(jsonData) {
  if (!jsonData) return;
  try {
    const res = await fetch("https://wgs-token.72nvwf4pb2.workers.dev/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData
    });
    if (!res.ok) throw new Error(await res.text());
    console.log("✅ Změny úspěšně odeslány na GitHub.");
    localStorage.removeItem("updatedRecords");
  } catch (err) {
    console.warn("⚠️ Nepodařilo se odeslat změny:", err.message);
  }
}

/* 🧩 3. Automatická synchronizace při načtení stránky */
async function autoSyncOnLoad() {
  const pending = localStorage.getItem("updatedRecords");
  if (!pending) return;
  console.log("🔄 Detekovány čekající změny, synchronizuji s GitHubem…");
  await sendUpdatesToGitHub(pending);
}

/* 🧩 4. Automatická synchronizace při zavření stránky */
window.addEventListener("beforeunload", () => {
  const pending = localStorage.getItem("updatedRecords");
  if (pending) {
    console.log("📤 Ukládám změny před odchodem ze stránky…");
    navigator.sendBeacon(
      "https://wgs-token.72nvwf4pb2.workers.dev/update",
      new Blob([pending], { type: "application/json" })
    );
  }
});

/* 🧩 5. Spuštění automatické synchronizace při načtení */
window.addEventListener("DOMContentLoaded", autoSyncOnLoad);
