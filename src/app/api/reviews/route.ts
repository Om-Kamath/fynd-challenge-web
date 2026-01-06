import { NextRequest, NextResponse } from "next/server";
import {
  ReviewSubmissionSchema,
  ReviewRecord,
  ReviewSubmissionResponse,
  ReviewListResponse,
  ErrorCodes,
} from "@/lib/types";
import { saveReview, getAllReviews, getAnalytics } from "@/lib/db";
import { analyzeReview } from "@/lib/llm";

// ============================================
// CORS Headers for cross-origin requests
// ============================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ============================================
// OPTIONS - Handle CORS preflight
// ============================================

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(request: NextRequest): Promise<NextResponse<ReviewSubmissionResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input using Zod schema
    const validationResult = ReviewSubmissionSchema.safeParse(body);

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");

      // Check for specific validation errors
      let errorCode: string = ErrorCodes.VALIDATION_ERROR;
      if (errorMessage.includes("5000")) {
        errorCode = ErrorCodes.REVIEW_TOO_LONG;
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
          },
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const { rating, review } = validationResult.data;

    // Generate unique ID for this review
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Analyze review with LLM (server-side)
    let llmResult;
    try {
      llmResult = await analyzeReview(rating, review);
    } catch (llmError) {
      console.error("LLM analysis failed:", llmError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.LLM_ERROR,
            message: "Failed to process review with AI. Please try again.",
          },
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Create review record
    const reviewRecord: ReviewRecord = {
      id,
      rating,
      review,
      aiResponse: llmResult.userResponse,
      aiSummary: llmResult.summary,
      aiRecommendedActions: llmResult.recommendedActions,
      createdAt,
      processedAt: new Date().toISOString(),
    };

    // Save to database
    try {
      await saveReview(reviewRecord);
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCodes.DATABASE_ERROR,
            message: "Failed to save review. Please try again.",
          },
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Return success response with AI response for user
    return NextResponse.json(
      {
        success: true,
        data: {
          id: reviewRecord.id,
          aiResponse: reviewRecord.aiResponse,
        },
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.UNKNOWN_ERROR,
          message: "An unexpected error occurred. Please try again.",
        },
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function GET(request: NextRequest): Promise<NextResponse<ReviewListResponse>> {
  try {
    // Fetch reviews and analytics
    const [reviews, analytics] = await Promise.all([
      getAllReviews(),
      getAnalytics(),
    ]);

    // Apply rating filter if provided
    const url = new URL(request.url);
    const ratingFilter = url.searchParams.get("rating");

    let filteredReviews = reviews;
    if (ratingFilter) {
      const ratingNum = parseInt(ratingFilter, 10);
      if (ratingNum >= 1 && ratingNum <= 5) {
        filteredReviews = reviews.filter((r) => r.rating === ratingNum);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          reviews: filteredReviews,
          total: filteredReviews.length,
          analytics,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: "Failed to fetch reviews. Please try again.",
        },
      },
      { status: 503, headers: corsHeaders }
    );
  }
}
