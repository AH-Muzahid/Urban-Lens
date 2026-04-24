const lat = 19.98888;
const lng = -0.10229;
const radius = 500;
const latDiff = radius / 111000;
const lngDiff = radius / (111000 * Math.cos(lat * Math.PI / 180));
const bbox = [lat - latDiff, lng - lngDiff, lat + latDiff, lng + lngDiff].join(',');
const query = `[out:json][timeout:25];
(
  node["amenity"](${bbox});
  way["amenity"](${bbox});
  node["shop"](${bbox});
  way["shop"](${bbox});
  way["leisure"="park"](${bbox});
  relation["leisure"="park"](${bbox});
  way["landuse"~"grass|forest|meadow"](${bbox});
  way["building"](${bbox});
  node["highway"="bus_stop"](${bbox});
  node["railway"~"station|stop"](${bbox});
  way["railway"~"station|stop"](${bbox});
  node["public_transport"~"stop_position|platform"](${bbox});
  node["amenity"="bus_station"](${bbox});
  way["highway"~"motorway|trunk|primary|secondary|tertiary"](${bbox});
);
out body geom;`;

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'User-Agent': 'UrbanLens/1.0 (contact: dev@urbanlens.example.com)',
  },
  body: 'data=' + encodeURIComponent(query)
}).then(async r => {
  console.log('Status:', r.status);
  console.log('Body:', await r.text());
}).catch(console.error);
