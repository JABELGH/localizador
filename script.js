const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const locationEl = document.getElementById('location');
const coordsEl = document.getElementById('coords');
const refreshBtn = document.getElementById('refreshLocation');

function startClock() {
  function update() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    timeEl.textContent = `${hh}:${mm}:${ss}`;
    const fecha = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',year: 'numeric',month: 'long',day: 'numeric',timeZoneName: 'short'
    }).format(now);
    dateEl.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  }
  update();setInterval(update, 1000);
}

function getPosition(options = { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocalización no soportada.'));return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=es`;
    const resp = await fetch(url,{headers:{'Accept':'application/json'}});
    if (!resp.ok) throw new Error('Error en reverse geocoding');
    return await resp.json();
  } catch (err) { return null; }
}

async function showLocation() {
  locationEl.textContent = 'Obteniendo ubicación…';coordsEl.textContent='';
  try {
    const pos = await getPosition();
    const lat = pos.coords.latitude.toFixed(6);
    const lon = pos.coords.longitude.toFixed(6);
    coordsEl.textContent = `Lat: ${lat} · Lon: ${lon}`;
    const geodata = await reverseGeocode(lat, lon);
    if (geodata && geodata.display_name) {
      locationEl.textContent = geodata.display_name;
    } else {
      locationEl.textContent = `Coordenadas: ${lat}, ${lon}`;
    }
  } catch (err) {locationEl.textContent = 'Error: ' + (err.message||err);}
}

startClock();showLocation();
refreshBtn.addEventListener('click',showLocation);
