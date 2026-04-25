import { NextRequest, NextResponse } from "next/server";
import { fetchFromOverpass, OverpassError } from "@/services/overpass/client";
import { calculateMetrics } from "@/services/metrics/processor";

const MIN_RADIUS_METERS = 100;
const MAX_RADIUS_METERS = 3000;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

function enforceRateLimit(clientIp: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(clientIp);

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientIp, {
      count: 1,
      windowStart: now,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  existing.count += 1;
  rateLimitStore.set(clientIp, existing);

  const retryAfterSeconds = Math.ceil((existing.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000);

  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - existing.count),
    retryAfterSeconds,
  };
}

function jsonWithRateLimitHeaders(
  payload: unknown,
  status: number,
  remaining: number,
  retryAfterSeconds: number
) {
  const response = NextResponse.json(payload, { status });
  response.headers.set("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Window", Math.floor(RATE_LIMIT_WINDOW_MS / 1000).toString());

  if (status === 429) {
    response.headers.set("Retry-After", retryAfterSeconds.toString());
  }

  return response;
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = enforceRateLimit(clientIp);

  if (!rateLimitResult.allowed) {
    return jsonWithRateLimitHeaders(
      {
        error: "Rate limit exceeded",
        code: "RATE_LIMITED",
        message: `Too many analysis requests. Please retry in ${rateLimitResult.retryAfterSeconds} seconds.`,
      },
      429,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const radiusParam = searchParams.get("radius") || "500";

  if (!latParam || !lngParam) {
    return jsonWithRateLimitHeaders(
      {
        error: "Missing coordinates",
        code: "MISSING_COORDINATES",
        message: "Both 'lat' and 'lng' query parameters are required.",
      },
      400,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  const lat = Number(latParam);
  const lng = Number(lngParam);
  const radius = Number(radiusParam);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return jsonWithRateLimitHeaders(
      {
        error: "Invalid coordinates",
        code: "INVALID_COORDINATES",
        message: "Coordinates must be valid numbers.",
      },
      400,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return jsonWithRateLimitHeaders(
      {
        error: "Coordinates out of range",
        code: "COORDINATES_OUT_OF_RANGE",
        message: "Latitude must be between -90 and 90, and longitude between -180 and 180.",
      },
      422,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  if (!Number.isInteger(radius)) {
    return jsonWithRateLimitHeaders(
      {
        error: "Invalid radius",
        code: "INVALID_RADIUS",
        message: "Radius must be an integer value in meters.",
      },
      400,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  if (radius < MIN_RADIUS_METERS || radius > MAX_RADIUS_METERS) {
    return jsonWithRateLimitHeaders(
      {
        error: "Radius out of range",
        code: "RADIUS_OUT_OF_RANGE",
        message: `Radius must be between ${MIN_RADIUS_METERS} and ${MAX_RADIUS_METERS} meters.`,
      },
      422,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }

  try {
    // Combine queries into one Overpass call for efficiency
    // We create a bounding box based on the radius
    // 1 degree lat is approx 111km
    const cosLat = Math.cos(lat * Math.PI / 180);
    if (Math.abs(cosLat) < 1e-6) {
      return jsonWithRateLimitHeaders(
        {
          error: "Unsupported latitude",
          code: "UNSUPPORTED_LATITUDE",
          message: "Latitude too close to poles for stable bounding box calculations.",
        },
        422,
        rateLimitResult.remaining,
        rateLimitResult.retryAfterSeconds
      );
    }

    const latDiff = radius / 111000;
    const lngDiff = radius / (111000 * cosLat);
    
    const bbox = [
      lat - latDiff,
      lng - lngDiff,
      lat + latDiff,
      lng + lngDiff
    ].join(",");

    // Build a unified query
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

    const data = await fetchFromOverpass(query);
    const metrics = calculateMetrics(data, [lat, lng], radius);

    return jsonWithRateLimitHeaders(metrics, 200, rateLimitResult.remaining, rateLimitResult.retryAfterSeconds);
  } catch (error) {
    console.error("Analysis API failed:", error);

    if (error instanceof OverpassError) {
      return jsonWithRateLimitHeaders(
        {
          error: "Upstream data provider unavailable",
          code: "OVERPASS_UNAVAILABLE",
          message: "OpenStreetMap Overpass data source is temporarily unavailable. Please retry shortly.",
          details: error.message,
        },
        503,
        rateLimitResult.remaining,
        rateLimitResult.retryAfterSeconds
      );
    }

    return jsonWithRateLimitHeaders(
      {
        error: "Failed to analyze area",
        code: "ANALYZE_INTERNAL_ERROR",
        message: "Unexpected server error while processing analysis request.",
      },
      500,
      rateLimitResult.remaining,
      rateLimitResult.retryAfterSeconds
    );
  }
}
