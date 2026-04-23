import * as turf from "@turf/turf";
import { OverpassResponse, OverpassElement } from "@/types/overpass";

export interface UrbanMetrics {
  walkability: {
    value: number;
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  greenspace: {
    value: number;
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  density: {
    value: number;
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
  };
}

export function calculateMetrics(
  data: OverpassResponse, 
  center: [number, number], // [lat, lng]
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
  const walkabilitySubtext = Object.entries(amenityCounts)
    .slice(0, 3)
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join(" | ");

  // 2. Greenspace Calculation
  const greenElements = elements.filter(el => 
    el.tags?.leisure === "park" || 
    el.tags?.landuse === "grass" || 
    el.tags?.landuse === "forest" ||
    el.tags?.landuse === "meadow"
  );

  let totalGreenAreaSqm = 0;
  greenElements.forEach(el => {
    if (el.geometry && el.geometry.length > 2) {
      const coords = el.geometry.map(g => [g.lon, g.lat]);
      // Ensure the ring is closed for turf.polygon
      if (coords[0][0] !== coords[coords.length-1][0] || coords[0][1] !== coords[coords.length-1][1]) {
        coords.push(coords[0]);
      }
      try {
        const poly = turf.polygon([coords]);
        totalGreenAreaSqm += turf.area(poly);
      } catch (e) {
        // Skip invalid polygons
      }
    }
  });

  const totalRadiusAreaSqm = Math.PI * Math.pow(radiusMeters, 2);
  const greenspacePercentage = (totalGreenAreaSqm / totalRadiusAreaSqm) * 100;

  // 3. Density Calculation (Building footprints)
  const buildings = elements.filter(el => el.tags?.building);
  const buildingCount = buildings.length;

  // 4. Metadata & Confidence Logic
  // Simple heuristic: if we have elements but low coverage, or vice versa
  const hasBuildings = buildingCount > 0;
  const hasAmenities = walkabilityValue > 0;
  
  let confidence: "High" | "Medium" | "Low" = "Medium";
  if (!hasBuildings) confidence = "Low";
  if (hasBuildings && hasAmenities) confidence = "High";

  // Coverage heuristic based on element density
  const coverage = Math.min(Math.round((elements.length / 500) * 100), 100);

  return {
    walkability: {
      value: walkabilityValue,
      label: `${walkabilityValue} amenities`,
      subtext: walkabilitySubtext || "No major amenities found",
      details: {
        sources: ["OpenStreetMap Nodes", "OSM Tags"],
        method: `Count of points of interest within ${radiusMeters}m radius.`,
        limitations: "OSM coverage varies by region; some local shops might be missing."
      }
    },
    greenspace: {
      value: greenspacePercentage,
      label: `${greenspacePercentage.toFixed(1)}%`,
      subtext: `${greenElements.length} green areas found`,
      details: {
        sources: ["OSM Polygons (leisure=park, landuse=grass)"],
        method: "Sum of green area polygons divided by total circle area.",
        limitations: "Private gardens and small tree clusters are often not mapped as polygons."
      }
    },
    density: {
      value: buildingCount,
      label: buildingCount > 0 ? `${buildingCount} buildings` : "Insufficient data",
      subtext: buildingCount > 0 ? "Building footprints detected" : "Missing building data",
      details: {
        sources: ["OSM Building Polygons"],
        method: "Count of mapped building footprints.",
        limitations: "Many areas lack detailed building footprint mapping in OSM."
      }
    },
    metadata: {
      coverage,
      confidence,
      locationName: "Selected Area" // Will be updated by reverse geocoding if possible
    }
  };
}
