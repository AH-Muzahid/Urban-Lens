import { OverpassResponse } from "@/types/overpass";

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

// Circuit Breaker State (In-memory, per serverless container)
let failureCount = 0;
let lastFailureTime = 0;
const FAILURE_THRESHOLD = 3;
const COOLDOWN_PERIOD_MS = 60000; // 1 minute cooldown

export class OverpassError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "OverpassError";
  }
}

/**
 * Fetches data from the Overpass API using a QL query.
 * Implements a basic circuit breaker and utilizes Next.js fetch caching.
 */
export async function fetchFromOverpass(query: string): Promise<OverpassResponse> {
  const now = Date.now();

  // Check Circuit Breaker
  if (failureCount >= FAILURE_THRESHOLD) {
    if (now - lastFailureTime < COOLDOWN_PERIOD_MS) {
      throw new OverpassError("Circuit breaker open: Overpass API is currently unavailable due to repeated failures. Please try again later.");
    } else {
      // Half-open state: allow the next request to try and recover
      failureCount = 0;
    }
  }

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
      // Next.js caching: revalidate every 1 hour (3600 seconds) to reduce load on OSM
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new OverpassError(`Overpass API responded with status: ${response.status}`, response.status);
    }

    const data = (await response.json()) as OverpassResponse;
    
    // Reset circuit breaker on successful response
    failureCount = 0;
    
    return data;
  } catch (error) {
    // Trip circuit breaker
    failureCount++;
    lastFailureTime = Date.now();
    
    if (error instanceof OverpassError) {
      throw error;
    }
    
    throw new OverpassError(`Failed to fetch from Overpass API: ${(error as Error).message}`);
  }
}
