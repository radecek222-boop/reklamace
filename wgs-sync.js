/* ===============================================================
📦 WHITE GLOVE SERVICE – SYNC SCRIPT
Soubor: wgs-sync.js
Autor: Hugo & GPT-5
Datum: 2025-10-09
Funkce: propojuje protokol.html (uložení PDF k zákazníkovi)
        s GitHub repo /orders.json přes Cloudflare Worker.
================================================================ */

const WORKER_URL = "https://wgs-token.72nvwf4pb2.workers.dev/orders";

/**
 * 🧩 saveCustomerEdit(record)
 * Uloží záznam do GitHubu (přes Worker).
 * - record = { cislo, protokol: {name, date, file} }
 */
async function saveCustomerEdit(record) {
  if (!record || !record.cislo) {
    console.warn("⚠️ Neplatný záznam – chybí číslo reklamace.");
    return;
  }

  const overlay = document.getElementById("waitOverlay");
  if (overlay) overlay.classList.add("active");

  try {
    console.log("📤 Odesílám data na Worker:", record);

    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });

    const data = await res.json();
    console.log("✅ Odpověď Workeru:", data);

    if (data.ok) {
      showSuccess();
    } else {
      alert("⚠️ Uložení se nezdařilo: " + (data.error || "Neznámá chyba."));
    }
  } catch (err) {
    console.error("❌ Chyba při odesílání na Worker:", err);
    alert("❌ Chyba při ukládání dat. Zkontrolujte připojení.");
  } finally {
    if (overlay) overlay.classList.remove("active");
  }
}

/**
 * ✅ Zobrazí zelené potvrzení ✓
 */
function showSuccess() {
  const el = document.getElementById("successCheck");
  if (!el) return;
  el.classList.add("active");
  setTimeout(() => el.classList.remove("active"), 1800);
}

/**
 * 📥 Načti aktuální orders.json
 */
async function loadOrders() {
  try {
    const res = await fetch(WORKER_URL);
    return await res.json();
  } catch (e) {
    console.error("❌ Nelze načíst orders.json:", e);
    return [];
  }
}
