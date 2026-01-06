"use client";

import { format } from "date-fns";
import { StarDisplay } from "./StarRating";
import { ChevronRight, Lightbulb, FileText } from "lucide-react";
import { ReviewRecord } from "@/lib/types";

interface ReviewListProps {
  reviews: ReviewRecord[];
  isLoading?: boolean;
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="shimmer h-4 w-24 rounded mb-3" />
            <div className="shimmer h-3 w-full rounded mb-2" />
            <div className="shimmer h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Reviews will appear here as they are submitted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewRecord;
}

function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = format(new Date(review.createdAt), "MMM d, yyyy 'at' h:mm a");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden card-hover animate-fadeIn">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StarDisplay rating={review.rating} size="sm" />
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            review.rating >= 4
              ? "bg-green-100 text-green-700"
              : review.rating >= 3
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {review.rating >= 4 ? "Positive" : review.rating >= 3 ? "Neutral" : "Negative"}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Original Review */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Customer Review
          </h4>
          <p className="text-gray-700">
            {review.review || (
              <span className="text-gray-400 italic">No written review provided</span>
            )}
          </p>
        </div>

        {/* AI Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
              AI Summary
            </h4>
          </div>
          <p className="text-blue-800 text-sm">{review.aiSummary}</p>
        </div>

        {/* Recommended Actions */}
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Recommended Actions
            </h4>
          </div>
          <ul className="space-y-2">
            {review.aiRecommendedActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-amber-800 text-sm">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
