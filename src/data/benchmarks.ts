export interface BenchmarkLocation {
  name: string;
  city: string;
  country: string;
  coords: [number, number]; // [lat, lng]
  stats: {
    amenities: number; // For walkability
    greenAreaPct: number; // For greenspace
    buildings: number; // For density
  };
}

/**
 * Benchmark Set v0.1
 * Hand-picked locations with high OSM data completeness.
 * These serve as the reference for the 0-100 scoring system.
 */
export const BENCHMARK_LOCATIONS: BenchmarkLocation[] = [
  {
    name: "Upper West Side",
    city: "New York",
    country: "USA",
    coords: [40.787, -73.9754],
    stats: { amenities: 320, greenAreaPct: 15.5, buildings: 1250 }
  },
  {
    name: "Shibuya Center",
    city: "Tokyo",
    country: "Japan",
    coords: [35.661777, 139.704051],
    stats: { amenities: 580, greenAreaPct: 2.1, buildings: 2100 }
  },
  {
    name: "Covent Garden",
    city: "London",
    country: "UK",
    coords: [51.5117, -0.1240],
    stats: { amenities: 450, greenAreaPct: 8.4, buildings: 1100 }
  },
  {
    name: "Le Marais",
    city: "Paris",
    country: "France",
    coords: [48.8575, 2.3592],
    stats: { amenities: 380, greenAreaPct: 4.2, buildings: 1500 }
  },
  {
    name: "Mitte",
    city: "Berlin",
    country: "Germany",
    coords: [52.5200, 13.4050],
    stats: { amenities: 310, greenAreaPct: 12.8, buildings: 850 }
  },
  {
    name: "El Born",
    city: "Barcelona",
    country: "Spain",
    coords: [41.3833, 2.1833],
    stats: { amenities: 290, greenAreaPct: 3.5, buildings: 1350 }
  },
  {
    name: "Vesterbro",
    city: "Copenhagen",
    country: "Denmark",
    coords: [55.671, 12.551],
    stats: { amenities: 210, greenAreaPct: 10.2, buildings: 680 }
  },
  {
    name: "Downtown Toronto",
    city: "Toronto",
    country: "Canada",
    coords: [43.6532, -79.3832],
    stats: { amenities: 410, greenAreaPct: 6.8, buildings: 1400 }
  },
  {
    name: "Aoyama",
    city: "Tokyo",
    country: "Japan",
    coords: [35.662, 139.712],
    stats: { amenities: 240, greenAreaPct: 14.5, buildings: 920 }
  },
  {
    name: "Greenwich Village",
    city: "New York",
    country: "USA",
    coords: [40.7336, -74.0027],
    stats: { amenities: 350, greenAreaPct: 5.5, buildings: 1150 }
  }
];

export const BENCHMARK_RANGES = {
  amenities: { min: 0, max: 600 },
  greenAreaPct: { min: 0, max: 30 },
  buildings: { min: 0, max: 2500 },
  transit: { min: 0, max: 80 },
  noise: { min: 0, max: 200 } // Weighted units: motorways=10, trunks=8, etc.
};
