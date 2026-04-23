/**
 * Builds an Overpass QL query to fetch amenities around a coordinate.
 * Uses a 500m bounding radius by default.
 */
export function buildAmenitiesQuery(lat: number, lng: number, radius: number = 500) {
  return `
    [out:json][timeout:25];
    (
      node["amenity"](around:${radius},${lat},${lng});
      way["amenity"](around:${radius},${lat},${lng});
      relation["amenity"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `.trim();
}

/**
 * Builds an Overpass QL query to fetch greenspaces (parks, forests, grass) around a coordinate.
 */
export function buildGreenspaceQuery(lat: number, lng: number, radius: number = 500) {
  return `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${radius},${lat},${lng});
      way["leisure"="park"](around:${radius},${lat},${lng});
      relation["leisure"="park"](around:${radius},${lat},${lng});
      
      node["natural"="wood"](around:${radius},${lat},${lng});
      way["natural"="wood"](around:${radius},${lat},${lng});
      relation["natural"="wood"](around:${radius},${lat},${lng});
      
      way["landuse"="grass"](around:${radius},${lat},${lng});
    );
    out geom;
  `.trim();
}

/**
 * Builds an Overpass QL query to fetch road networks (walkable paths, footways, streets).
 */
export function buildWalkabilityQuery(lat: number, lng: number, radius: number = 500) {
  return `
    [out:json][timeout:25];
    (
      way["highway"](around:${radius},${lat},${lng});
    );
    out geom;
  `.trim();
}
