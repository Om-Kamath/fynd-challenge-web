import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/db";

// ============================================
// GET /api/health - Health check endpoint
// ============================================

/**
 * GET /api/health
 *
 * Response (JSON):
 * {
 *   "status": "ok" | "degraded" | "error",
 *   "timestamp": string,
 *   "services": {
 *     "database": boolean,
 *     "api": boolean
 *   }
 * }
 */
export async function GET() {
  try {
    const dbHealthy = await checkHealth();

    const response = {
      status: dbHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy,
        api: true,
      },
    };

    return NextResponse.json(response, {
      status: dbHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          database: false,
          api: true,
        },
      },
      { status: 503 }
    );
  }
}
