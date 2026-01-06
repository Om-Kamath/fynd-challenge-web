# AI Feedback System

A production-style web application with two dashboards for collecting and analyzing customer feedback using AI.

## 🚀 Features

### User Dashboard (Public-Facing)

- ⭐ Star rating selection (1-5)
- 📝 Write and submit reviews
- 🤖 Instant AI-generated personalized responses
- ✅ Clear success/error states

### Admin Dashboard (Internal-Facing)

- 📊 Live-updating review list (auto-refreshes every 30 seconds)
- 📈 Analytics: rating distribution, sentiment analysis, trends
- 🔍 Filter reviews by rating
- 🤖 AI-powered:
  - Review summaries
  - Recommended actions for each review

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **AI**: OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel

## 📋 API Endpoints

### POST /api/reviews

Submit a new review.

**Request Body:**

```json
{
  "rating": 5,
  "review": "Great experience!"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "aiResponse": "Thank you for your wonderful feedback..."
  }
}
```

### GET /api/reviews

Fetch all reviews with analytics.

**Query Parameters:**

- `rating` (optional): Filter by star rating (1-5)

**Response:**

```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "total": 42,
    "analytics": {
      "averageRating": 4.2,
      "ratingDistribution": {"1": 2, "2": 5, "3": 10, "4": 15, "5": 10},
      "totalReviews": 42,
      "reviewsToday": 5,
      "reviewsThisWeek": 20
    }
  }
}
```

### GET /api/health

Health check endpoint.
