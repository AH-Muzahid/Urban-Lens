import { NextRequest, NextResponse } from "next/server";
import { fetchFromOverpass } from "@/services/overpass/client";
import { buildAmenitiesQuery, buildGreenspaceQuery } from "@/services/overpass/queries";
import { calculateMetrics } from "@/services/metrics/processor";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const radius = parseInt(searchParams.get("radius") || "500");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  try {
    // Combine queries into one Overpass call for efficiency
    // We create a bounding box based on the radius
    // 1 degree lat is approx 111km
    const latDiff = radius / 111000;
    const lngDiff = radius / (111000 * Math.cos(lat * Math.PI / 180));
    
    const bbox = [
      lat - latDiff,
      lng - lngDiff,
      lat + latDiff,
      lng + lngDiff
    ].join(",");

    // Build a unified query
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"](${bbox});
        way["amenity"](${bbox});
        node["shop"](${bbox});
        way["shop"](${bbox});
        way["leisure"="park"](${bbox});
        relation["leisure"="park"](${bbox});
        way["landuse"~"grass|forest|meadow"](${bbox});
        way["building"](${bbox});
      );
      out body geom;
    `;

    const data = await fetchFromOverpass(query);
    const metrics = calculateMetrics(data, [lat, lng], radius);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Analysis API failed:", error);
    return NextResponse.json({ error: "Failed to analyze area" }, { status: 500 });
  }
}
