"use client";

import { ReviewForm } from "@/components/ReviewForm";
import { MessageSquare, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800">FeedbackAI</span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Admin Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Feedback System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your experience with us. Your feedback helps us improve and serve you better.
            Get an instant AI-powered response to your review.
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Share Your Feedback
          </h2>
          <ReviewForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 FeedbackAI. Built with AI-powered analytics.
          </p>
        </div>
      </footer>
    </div>
  );
}
