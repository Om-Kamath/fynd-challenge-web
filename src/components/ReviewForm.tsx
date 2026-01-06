"use client";

import { useState, useCallback } from "react";
import { StarRating } from "./StarRating";
import { Loader2, CheckCircle2, AlertCircle, Send, RefreshCw } from "lucide-react";

interface ReviewFormProps {
  onSuccess?: () => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

const MAX_REVIEW_LENGTH = 5000;

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [aiResponse, setAiResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (rating === 0) {
        setErrorMessage("Please select a star rating");
        setFormState("error");
        return;
      }

      setFormState("submitting");
      setErrorMessage("");

      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            review: review.trim(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFormState("success");
          setAiResponse(data.data.aiResponse);
          onSuccess?.();
        } else {
          setFormState("error");
          setErrorMessage(data.error?.message || "Failed to submit review");
        }
      } catch (error) {
        console.error("Submission error:", error);
        setFormState("error");
        setErrorMessage("Network error. Please check your connection and try again.");
      }
    },
    [rating, review, onSuccess]
  );

  const handleReset = () => {
    setRating(0);
    setReview("");
    setFormState("idle");
    setAiResponse("");
    setErrorMessage("");
  };

  const isSubmitDisabled = rating === 0 || formState === "submitting";
  const charactersRemaining = MAX_REVIEW_LENGTH - review.length;

  return (
    <div className="w-full max-w-lg mx-auto">
      {formState === "success" ? (
        <div className="animate-fadeIn">
          {/* Success State */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Thank you!</h3>
                <p className="text-sm text-green-600">Your feedback has been submitted</p>
              </div>
            </div>
          </div>

          {/* AI Response */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">✨</span>
              </div>
              <h3 className="font-semibold text-gray-800">Our Response</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
          </div>

          {/* Submit Another Button */}
          <button
            onClick={handleReset}
            className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Submit Another Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience? <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-center py-2">
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={formState === "submitting"}
                size="lg"
              />
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 5 && "Excellent! 🎉"}
                {rating === 4 && "Great! 😊"}
                {rating === 3 && "Good 👍"}
                {rating === 2 && "Could be better 🤔"}
                {rating === 1 && "We're sorry to hear that 😞"}
              </p>
            )}
          </div>

          {/* Review Text Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Tell us more about your experience (optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={formState === "submitting"}
              placeholder="Share your thoughts, suggestions, or any feedback you'd like to give us..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              maxLength={MAX_REVIEW_LENGTH}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {charactersRemaining < 500 && charactersRemaining >= 0 && (
                  <span className={charactersRemaining < 100 ? "text-orange-500" : ""}>
                    {charactersRemaining} characters remaining
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {formState === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">Submission failed</p>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all ${
              isSubmitDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-[0.99]"
            }`}
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing your feedback...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
