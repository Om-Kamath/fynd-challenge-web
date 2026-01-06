import OpenAI from "openai";
import { LLMAnalysisResult } from "./types";

// ============================================
// OpenAI Client Configuration
// ============================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// ============================================
// Constants
// ============================================

const MAX_REVIEW_LENGTH_FOR_PROCESSING = 5000;
const MODEL = "gpt-3.5-turbo";

// ============================================
// Prompt Templates
// ============================================

const SYSTEM_PROMPT = `You are a helpful customer feedback analyst for a company. Your role is to:
1. Provide empathetic, professional responses to customer reviews
2. Summarize customer feedback concisely
3. Suggest actionable recommendations for the business

Always be professional, empathetic, and constructive. Focus on understanding the customer's experience and providing value.`;

function getUserResponsePrompt(rating: number, review: string): string {
  const sentiment =
    rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative";
  return `A customer has submitted a ${sentiment} review with a rating of ${rating}/5 stars.

Review: "${review || "(No written review provided)"}"

Generate a personalized, empathetic response to this customer (2-3 sentences). The response should:
- Thank them for their feedback
- Acknowledge their specific experience if mentioned
- ${rating < 4 ? "Express commitment to improvement" : "Express gratitude for their support"}

Keep the response professional and concise.`;
}

function getSummaryPrompt(rating: number, review: string): string {
  return `Summarize the following customer review in 1-2 sentences. Focus on the key points and sentiment.

Rating: ${rating}/5 stars
Review: "${review || "(No written review provided)"}"

If no review text is provided, create a brief summary based on the rating alone.`;
}

function getRecommendationsPrompt(rating: number, review: string): string {
  return `Based on this customer feedback, suggest 2-3 specific, actionable recommendations for the business to improve or maintain customer satisfaction.

Rating: ${rating}/5 stars
Review: "${review || "(No written review provided)"}"

Format each recommendation as a brief, actionable item. Return only the recommendations, one per line, without numbering or bullet points.`;
}

// ============================================
// LLM Functions
// ============================================

/**
 * Generate a user-facing response to their review
 */
async function generateUserResponse(
  rating: number,
  review: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: getUserResponsePrompt(rating, review) },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      getDefaultUserResponse(rating)
    );
  } catch (error) {
    console.error("Error generating user response:", error);
    return getDefaultUserResponse(rating);
  }
}

/**
 * Generate a summary of the review for admin dashboard
 */
async function generateSummary(
  rating: number,
  review: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: getSummaryPrompt(rating, review) },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      getDefaultSummary(rating, review)
    );
  } catch (error) {
    console.error("Error generating summary:", error);
    return getDefaultSummary(rating, review);
  }
}

/**
 * Generate recommended actions for admin dashboard
 */
async function generateRecommendations(
  rating: number,
  review: string
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: getRecommendationsPrompt(rating, review) },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    const recommendations = content
      .split("\n")
      .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
      .filter((line) => line.length > 0)
      .slice(0, 3);

    return recommendations.length > 0
      ? recommendations
      : getDefaultRecommendations(rating);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return getDefaultRecommendations(rating);
  }
}

// ============================================
// Main Analysis Function
// ============================================

/**
 * Analyze a review and generate all AI responses
 * Handles empty reviews, long reviews, and API failures gracefully
 */
export async function analyzeReview(
  rating: number,
  review: string
): Promise<LLMAnalysisResult> {
  // Handle long reviews by truncating
  const truncatedReview =
    review.length > MAX_REVIEW_LENGTH_FOR_PROCESSING
      ? review.substring(0, MAX_REVIEW_LENGTH_FOR_PROCESSING) + "..."
      : review;

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not configured, using fallback responses");
    return {
      userResponse: getDefaultUserResponse(rating),
      summary: getDefaultSummary(rating, truncatedReview),
      recommendedActions: getDefaultRecommendations(rating),
    };
  }

  // Process all LLM calls in parallel for efficiency
  const [userResponse, summary, recommendedActions] = await Promise.all([
    generateUserResponse(rating, truncatedReview),
    generateSummary(rating, truncatedReview),
    generateRecommendations(rating, truncatedReview),
  ]);

  return {
    userResponse,
    summary,
    recommendedActions,
  };
}

// ============================================
// Fallback Responses (for API failures)
// ============================================

function getDefaultUserResponse(rating: number): string {
  if (rating >= 4) {
    return "Thank you so much for your wonderful feedback! We truly appreciate your support and are delighted to hear about your positive experience. Your kind words motivate our team to continue delivering excellent service.";
  } else if (rating >= 3) {
    return "Thank you for taking the time to share your feedback. We value your honest opinion and are always looking for ways to improve. Please don't hesitate to reach out if there's anything specific we can help with.";
  } else {
    return "Thank you for bringing this to our attention. We sincerely apologize that your experience didn't meet expectations. Your feedback is crucial for our improvement, and we're committed to addressing these concerns.";
  }
}

function getDefaultSummary(rating: number, review: string): string {
  const sentiment =
    rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "negative";
  if (!review || review.trim().length === 0) {
    return `Customer submitted a ${sentiment} rating of ${rating}/5 stars without additional comments.`;
  }
  return `Customer expressed ${sentiment} sentiment (${rating}/5 stars) regarding their experience.`;
}

function getDefaultRecommendations(rating: number): string[] {
  if (rating >= 4) {
    return [
      "Continue maintaining current service quality standards",
      "Consider asking satisfied customers for referrals or testimonials",
      "Identify specific aspects that led to this positive experience and replicate them",
    ];
  } else if (rating >= 3) {
    return [
      "Follow up with customer to identify specific improvement areas",
      "Review recent service interactions for potential issues",
      "Consider implementing feedback collection at key touchpoints",
    ];
  } else {
    return [
      "Prioritize direct outreach to resolve customer concerns",
      "Conduct internal review of processes related to this feedback",
      "Implement preventive measures to avoid similar issues",
    ];
  }
}
