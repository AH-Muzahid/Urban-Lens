import * as turf from "@turf/turf";
import { OverpassResponse } from "@/types/overpass";
import { BENCHMARK_RANGES } from "@/data/benchmarks";

export interface UrbanMetrics {
  walkability: {
    value: number; // Raw value (count)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  greenspace: {
    value: number; // Raw value (%)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  density: {
    value: number; // Raw value (count)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  metadata: {
    coverage: number;
    confidence: "High" | "Medium" | "Low";
    locationName: string;
    radius: number;
  };
}

function calculateScore(value: number, range: { min: number, max: number }): number {
  const score = ((value - range.min) / (range.max - range.min)) * 100;
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function calculateMetrics(
  data: OverpassResponse, 
  _center: [number, number], // [lat, lng]

  radiusMeters: number
): UrbanMetrics {
  const elements = data.elements;
  
  // 1. Walkability Calculation
  const amenities = elements.filter(el => el.tags?.amenity || el.tags?.shop || el.tags?.leisure === "playground");
  const amenityCounts: Record<string, number> = {};
  amenities.forEach(el => {
    const type = el.tags?.amenity || el.tags?.shop || "other";
    amenityCounts[type] = (amenityCounts[type] || 0) + 1;
  });

  const walkabilityValue = amenities.length;
  const walkabilityScore = calculateScore(walkabilityValue, BENCHMARK_RANGES.amenities);
  const walkabilitySubtext = Object.entries(amenityCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count
    .slice(0, 3)
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join(" | ");

  // 2. Greenspace Calculation
  const greenElements = elements.filter(el => 
    el.tags?.leisure === "park" || 
    el.tags?.landuse === "grass" || 
    el.tags?.landuse === "forest" ||
    el.tags?.landuse === "meadow" ||
    el.tags?.natural === "wood"
  );

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

  // 3. Density Calculation
  const buildings = elements.filter(el => el.tags?.building);
  const buildingCount = buildings.length;
  const densityScore = calculateScore(buildingCount, BENCHMARK_RANGES.buildings);

  // 4. Metadata & Confidence
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
      subtext: walkabilitySubtext || "No major amenities found",
      details: {
        sources: ["OSM Nodes", "Shop Tags", "Amenity Tags"],
        method: `Count of POIs normalized against global urban benchmarks.`,
        limitations: "Under-mapped areas may show artificially low scores."
      }
    },
    greenspace: {
      value: greenspacePercentage,
      score: greenspaceScore,
      label: `${greenspaceScore}/100`,
      subtext: `${greenspacePercentage.toFixed(1)}% area coverage`,
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
      subtext: buildingCount > 0 ? `${buildingCount} structures detected` : "Minimal geometry found",
      details: {
        sources: ["OSM Building Footprints"],
        method: "Footprint count normalized against high-density urban references.",
        limitations: "Building mapping varies significantly by region."
      }
    },
    metadata: {
      coverage,
      confidence,
      locationName: "Selected Area",
      radius: radiusMeters
    }
  };
}

