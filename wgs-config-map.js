// ======================================================
// 🌍 WGS – GLOBÁLNÍ KONFIGURACE MAP A ADRES
// ======================================================
// Tato data se načtou automaticky do všech stránek
// kde se přidá <script src="wgs-config.js"></script>
// ------------------------------------------------------

// 📍 Sídlo firmy (default home base)
const WGS_HOME = {
  name: "White Glove Service s.r.o.",
  address: "Do Dubče 364, Běchovice, Praha 9, 190 11",
  lat: 50.08031890414999,
  lng: 14.59812450867171
};

// 🌍 Výchozí mapové nastavení (např. Leaflet)
const WGS_MAP_DEFAULTS = {
  zoomStart: 11,
  zoomDetail: 14,
  tileLayer:
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
};

// ✅ Pomocná funkce pro získání adresy jako textu
function getWGSAddress() {
  return WGS_HOME.address;
}

// ✅ Pomocná funkce pro získání [lat, lng]
function getWGSCoords() {
  return [WGS_HOME.lat, WGS_HOME.lng];
}

// ✅ Inicializace mapy s výchozím bodem WGS
function initWGSMap(containerId) {
  const map = L.map(containerId).setView(getWGSCoords(), WGS_MAP_DEFAULTS.zoomStart);
  L.tileLayer(WGS_MAP_DEFAULTS.tileLayer, {
    attribution: WGS_MAP_DEFAULTS.attribution
  }).addTo(map);
  L.marker(getWGSCoords()).addTo(map).bindPopup(WGS_HOME.name).openPopup();
  return map;
}

console.log("🌐 WGS config loaded:", WGS_HOME);
