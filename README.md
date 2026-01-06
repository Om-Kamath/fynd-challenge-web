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

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenAI API key

### Local Development

1. Clone the repository:
```bash
git clone <repo-url>
cd fynd-challenge-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
OPENAI_API_KEY=sk-your-api-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open in browser:
- User Dashboard: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin

## 🌐 Deployment (Vercel)

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel Dashboard:
   - `MONGODB_URI`
   - `OPENAI_API_KEY`

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables
4. Deploy

## 📁 Project Structure

```
fynd-challenge-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # User Dashboard
│   │   ├── admin/
│   │   │   └── page.tsx          # Admin Dashboard
│   │   ├── api/
│   │   │   ├── reviews/
│   │   │   │   └── route.ts      # Reviews API
│   │   │   └── health/
│   │   │       └── route.ts      # Health check
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── db.ts                 # Database operations
│   │   ├── llm.ts                # LLM operations
│   │   └── types.ts              # TypeScript types & schemas
│   └── components/
│       ├── StarRating.tsx
│       ├── ReviewForm.tsx
│       ├── ReviewList.tsx
│       └── Analytics.tsx
├── package.json
├── vercel.json
└── README.md
```

## 🔐 Error Handling

The system handles:
- ✅ Empty reviews (processed with rating-only analysis)
- ✅ Long reviews (truncated to 5000 characters)
- ✅ LLM API failures (graceful fallback to default responses)
- ✅ Database connection issues (appropriate error messages)
- ✅ Network errors (retry mechanisms)

## 📱 URLs After Deployment

- **User Dashboard**: `https://your-app.vercel.app`
- **Admin Dashboard**: `https://your-app.vercel.app/admin`

## 🧪 Testing

Submit a test review:
```bash
curl -X POST https://your-app.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "review": "Great service!"}'
```

## 📄 License

MIT License
