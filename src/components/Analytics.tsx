"use client";

import { TrendingUp, TrendingDown, Users, Star, Calendar, BarChart3 } from "lucide-react";

interface AnalyticsProps {
  analytics: {
    averageRating: number;
    ratingDistribution: Record<string, number>;
    totalReviews: number;
    reviewsToday: number;
    reviewsThisWeek: number;
  };
}

export function Analytics({ analytics }: AnalyticsProps) {
  const maxDistribution = Math.max(...Object.values(analytics.ratingDistribution), 1);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Reviews */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalReviews}</p>
          <p className="text-xs text-gray-500">Total Reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>

        {/* Reviews Today */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.reviewsToday}</p>
          <p className="text-xs text-gray-500">Today</p>
        </div>

        {/* Reviews This Week */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.reviewsThisWeek}</p>
          <p className="text-xs text-gray-500">This Week</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = analytics.ratingDistribution[star.toString()] || 0;
            const percentage = maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;
            const totalPercentage =
              analytics.totalReviews > 0
                ? ((count / analytics.totalReviews) * 100).toFixed(0)
                : "0";

            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  {percentage > 0 && (
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4
                          ? "bg-green-500"
                          : star === 3
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-400 ml-1">({totalPercentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentiment Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Sentiment Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <SentimentCard
            label="Positive"
            count={
              (analytics.ratingDistribution["4"] || 0) +
              (analytics.ratingDistribution["5"] || 0)
            }
            total={analytics.totalReviews}
            color="green"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <SentimentCard
            label="Neutral"
            count={analytics.ratingDistribution["3"] || 0}
            total={analytics.totalReviews}
            color="yellow"
            icon={<span className="text-sm">—</span>}
          />
          <SentimentCard
            label="Negative"
            count={
              (analytics.ratingDistribution["1"] || 0) +
              (analytics.ratingDistribution["2"] || 0)
            }
            total={analytics.totalReviews}
            color="red"
            icon={<TrendingDown className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}

interface SentimentCardProps {
  label: string;
  count: number;
  total: number;
  color: "green" | "yellow" | "red";
  icon: React.ReactNode;
}

function SentimentCard({ label, count, total, color, icon }: SentimentCardProps) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : "0";

  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{percentage}%</p>
      <p className="text-xs opacity-75">{count} reviews</p>
    </div>
  );
}
