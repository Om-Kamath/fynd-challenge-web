"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewList } from "@/components/ReviewList";
import { Analytics } from "@/components/Analytics";
import {
  RefreshCw,
  Filter,
  Shield,
  ArrowLeft,
  Activity,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { ReviewRecord } from "@/lib/types";

interface ReviewsData {
  reviews: ReviewRecord[];
  total: number;
  analytics: {
    averageRating: number;
    ratingDistribution: Record<string, number>;
    totalReviews: number;
    reviewsToday: number;
    reviewsThisWeek: number;
  };
}

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function AdminDashboard() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchReviews = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      }
      setError(null);

      const url = ratingFilter
        ? `/api/reviews?rating=${ratingFilter}`
        : "/api/reviews";

      const response = await fetch(url, {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.error?.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [ratingFilter]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchReviews();

    const interval = setInterval(() => {
      fetchReviews(false);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchReviews]);

  // Re-fetch when filter changes
  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, fetchReviews]);

  const handleManualRefresh = () => {
    fetchReviews(true);
  };

  const filteredReviews = data?.reviews || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">User Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-800">Admin Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
                <span>Live</span>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}

              {/* Manual Refresh */}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Error loading data</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={handleManualRefresh}
              className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
            </div>

            {data ? (
              <Analytics analytics={data.analytics} />
            ) : (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="shimmer h-4 w-32 rounded mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="shimmer h-12 rounded" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Reviews
                  {data && (
                    <span className="text-gray-400 font-normal ml-2">
                      ({filteredReviews.length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Filter by rating:</span>
                <select
                  value={ratingFilter || ""}
                  onChange={(e) =>
                    setRatingFilter(e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <ReviewList reviews={filteredReviews} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>Admin Dashboard • Internal Use Only</p>
            <p>Auto-refreshes every 30 seconds</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
