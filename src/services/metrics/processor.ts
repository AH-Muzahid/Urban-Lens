import * as turf from "@turf/turf";
import { OverpassResponse } from "@/types/overpass";
import { BENCHMARK_RANGES } from "@/data/benchmarks";
import { UrbanMetrics } from "@/types/metrics";

function calculateScore(value: number, range: { min: number, max: number }): number {
  const score = ((value - range.min) / (range.max - range.min)) * 100;
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateMetrics(
  data: OverpassResponse, 
  center: [number, number], // [lat, lng]
  radiusMeters: number
): UrbanMetrics {
  const elements = data.elements;
  
  // 1. Walkability Calculation
  const amenities = elements.filter(el => el.tags?.amenity || el.tags?.shop || el.tags?.leisure === "playground");
  const schools = elements.filter(el => el.tags?.amenity === "school").length;
  const hospitals = elements.filter(el => el.tags?.amenity === "hospital" || el.tags?.amenity === "clinic").length;
  const shops = elements.filter(el => el.tags?.shop).length;

  const walkabilityValue = amenities.length;
  const walkabilityScore = calculateScore(walkabilityValue, BENCHMARK_RANGES.amenities);
  const walkabilitySubtext = `Schools: ${schools} | Hospitals: ${hospitals} | Shops: ${shops}`;

  // 2. Greenspace Calculation
  const greenElements = elements.filter(el => 
    el.tags?.leisure === "park" || 
    el.tags?.landuse === "grass" || 
    el.tags?.landuse === "forest" ||
    el.tags?.landuse === "meadow" ||
    el.tags?.natural === "wood"
  );
  const parkCount = elements.filter(el => el.tags?.leisure === "park").length;

  let totalGreenAreaSqm = 0;
  greenElements.forEach(el => {
    if (el.geometry && el.geometry.length > 2) {
      const coords = el.geometry.map(g => [g.lon, g.lat]);
      if (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1]) {
        coords.push(coords[0]);
      }
      try {
        const poly = turf.polygon([coords]);
        totalGreenAreaSqm += turf.area(poly);
      } catch {
        // Silently ignore invalid polygons
      }
    }
  });

  const totalRadiusAreaSqm = Math.PI * Math.pow(radiusMeters, 2);
  const greenspacePercentage = (totalGreenAreaSqm / totalRadiusAreaSqm) * 100;
  const greenspaceScore = calculateScore(greenspacePercentage, BENCHMARK_RANGES.greenAreaPct);
  const greenspaceSubtext = `${parkCount} parks within radius | ${greenspacePercentage.toFixed(1)}% coverage`;

  // 3. Density Calculation
  const buildings = elements.filter(el => el.tags?.building);
  const buildingCount = buildings.length;
  const densityScore = calculateScore(buildingCount, BENCHMARK_RANGES.buildings);
  const densitySubtext = `${buildingCount} structures detected | High Density`;

  // 4. Transit Calculation
  const transitStops = elements.filter(el => 
    el.tags?.highway === "bus_stop" || 
    el.tags?.railway === "station" || 
    el.tags?.railway === "stop" ||
    el.tags?.amenity === "bus_station" ||
    el.tags?.public_transport === "stop_position" ||
    el.tags?.public_transport === "platform"
  );
  const transitCount = transitStops.length;
  const transitScore = calculateScore(transitCount, BENCHMARK_RANGES.transit);
  
  const railStations = transitStops.filter(el => el.tags?.railway === "station").length;
  const busStops = transitStops.filter(el => el.tags?.highway === "bus_stop" || el.tags?.amenity === "bus_station").length;
  
  const transitSubtext = `${railStations} Stations | ${busStops} Bus Stops`;

  // 5. Metadata & Confidence
  const hasBuildings = buildingCount > 0;
  const hasAmenities = walkabilityValue > 0;
  
  let confidence: "High" | "Medium" | "Low" = "Medium";
  if (!hasBuildings) confidence = "Low";
  if (hasBuildings && hasAmenities) confidence = "High";

  const coverage = Math.min(Math.round((elements.length / 500) * 100), 100);

  return {
    walkability: {
      value: walkabilityValue,
      score: walkabilityScore,
      label: `${walkabilityScore}/100`,
      subtext: walkabilitySubtext,
      details: {
        sources: ["OSM Nodes", "Shop Tags", "Amenity Tags"],
        method: "Count of POIs normalized against global urban benchmarks.",
        limitations: "Under-mapped areas may show artificially low scores."
      }
    },
    greenspace: {
      value: greenspacePercentage,
      score: greenspaceScore,
      label: `${greenspaceScore}/100`,
      subtext: greenspaceSubtext,
      details: {
        sources: ["OSM Polygons (Park, Landuse, Natural)"],
        method: "Area ratio normalized against urban greenspace benchmarks.",
        limitations: "Small clusters and street trees often omitted from geometry data."
      }
    },
    density: {
      value: buildingCount,
      score: densityScore,
      label: buildingCount > 0 ? `${densityScore}/100` : "Low Data",
      subtext: densitySubtext,
      details: {
        sources: ["OSM Building Footprints"],
        method: "Footprint count normalized against high-density urban references.",
        limitations: "Building mapping varies significantly by region."
      }
    },
    transit: {
      value: transitCount,
      score: transitScore,
      label: `${transitScore}/100`,
      subtext: transitSubtext,
      details: {
        sources: ["OSM Public Transport Nodes"],
        method: "Stop density normalized against high-frequency urban networks.",
        limitations: "Frequency and route variety are not captured in static stop counts."
      }
    },
    metadata: {
      coverage,
      confidence,
      locationName: "Selected Area",
      radius: radiusMeters,
      lat: center[0],
      lng: center[1]
    }
  };
}
