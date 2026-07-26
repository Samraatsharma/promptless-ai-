import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in milliseconds
  source: "upstash-redis" | "in-memory";
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory token bucket store for local development fallback
const store = new Map<string, TokenBucket>();

const DEFAULT_LIMIT = 20;
const REFILL_INTERVAL_MS = 60 * 1000;

// Initialize Upstash Redis ratelimit instance if credentials are provided in production
let upstashRatelimit: Ratelimit | null = null;
try {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(DEFAULT_LIMIT, "1 m"),
      analytics: true,
      prefix: "@promptless-ai/ratelimit",
    });
  }
} catch {
  upstashRatelimit = null;
}

/**
 * Enforces token-bucket rate limiting for backend AI endpoints.
 * Uses Upstash Redis in serverless production environments, falling back to
 * an in-memory sliding window for local development.
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_LIMIT
): Promise<RateLimitResult> {
  // Use Upstash Redis distributed ratelimit if configured
  if (upstashRatelimit) {
    try {
      const res = await upstashRatelimit.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
        source: "upstash-redis",
      };
    } catch {
      // Fallback to in-memory if Redis call fails temporarily
    }
  }

  // In-memory fallback
  const now = Date.now();
  const bucket = store.get(identifier);

  if (!bucket) {
    store.set(identifier, {
      tokens: maxRequests - 1,
      lastRefill: now,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + REFILL_INTERVAL_MS,
      source: "in-memory",
    };
  }

  const elapsed = now - bucket.lastRefill;
  if (elapsed >= REFILL_INTERVAL_MS) {
    bucket.tokens = maxRequests - 1;
    bucket.lastRefill = now;
    store.set(identifier, bucket);
    return {
      success: true,
      limit: maxRequests,
      remaining: bucket.tokens,
      reset: now + REFILL_INTERVAL_MS,
      source: "in-memory",
    };
  }

  if (bucket.tokens <= 0) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: bucket.lastRefill + REFILL_INTERVAL_MS,
      source: "in-memory",
    };
  }

  bucket.tokens -= 1;
  store.set(identifier, bucket);

  return {
    success: true,
    limit: maxRequests,
    remaining: bucket.tokens,
    reset: bucket.lastRefill + REFILL_INTERVAL_MS,
    source: "in-memory",
  };
}

/**
 * Generates an HTTP 429 Too Many Requests response with standard RateLimit headers.
 */
export function buildRateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000);
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message:
        "Rate limit exceeded (max 20 requests/minute). Please wait before requesting another AI action.",
      retryAfter: Math.max(1, retryAfterSeconds),
      source: result.source,
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.reset.toString(),
        "Retry-After": Math.max(1, retryAfterSeconds).toString(),
      },
    }
  );
}

/**
 * Attaches standard RateLimit headers to successful NextResponse objects.
 */
export function attachRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.reset.toString());
  return response;
}
