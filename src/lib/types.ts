import { z } from "zod";

// ============================================
// JSON SCHEMAS FOR API PAYLOADS
// ============================================

/**
 * Schema for submitting a new review (Request Payload)
 */
export const ReviewSubmissionSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  review: z
    .string()
    .max(5000, "Review cannot exceed 5000 characters")
    .transform((val) => val.trim()),
});

/**
 * Schema for a complete review record (stored in DB)
 */
export const ReviewRecordSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  review: z.string(),
  aiResponse: z.string(),
  aiSummary: z.string(),
  aiRecommendedActions: z.array(z.string()),
  createdAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
});

/**
 * Schema for review submission response (Response Payload)
 */
export const ReviewSubmissionResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      aiResponse: z.string(),
    })
    .optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

/**
 * Schema for fetching all reviews response (Response Payload)
 */
export const ReviewListResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      reviews: z.array(ReviewRecordSchema),
      total: z.number(),
      analytics: z.object({
        averageRating: z.number(),
        ratingDistribution: z.record(z.string(), z.number()),
        totalReviews: z.number(),
        reviewsToday: z.number(),
        reviewsThisWeek: z.number(),
      }),
    })
    .optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
    })
    .optional(),
});

// ============================================
// TYPESCRIPT TYPES (derived from schemas)
// ============================================

export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;
export type ReviewRecord = z.infer<typeof ReviewRecordSchema>;
export type ReviewSubmissionResponse = z.infer<typeof ReviewSubmissionResponseSchema>;
export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>;

// ============================================
// ERROR CODES
// ============================================

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  LLM_ERROR: "LLM_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  EMPTY_REVIEW: "EMPTY_REVIEW",
  REVIEW_TOO_LONG: "REVIEW_TOO_LONG",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

// ============================================
// LLM RESPONSE TYPES
// ============================================

export interface LLMAnalysisResult {
  userResponse: string;
  summary: string;
  recommendedActions: string[];
}

// ============================================
// API ENDPOINT DOCUMENTATION
// ============================================

/**
 * API Endpoints:
 *
 * POST /api/reviews
 *   Request: ReviewSubmission
 *   Response: ReviewSubmissionResponse
 *
 * GET /api/reviews
 *   Response: ReviewListResponse
 *
 * GET /api/health
 *   Response: { status: "ok", timestamp: string }
 */
