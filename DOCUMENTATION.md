# AI Feedback System - Documentation

## Project Overview

A production-ready web application with two dashboards for collecting and analyzing customer feedback using AI.

- **User Dashboard** (`/`): Public-facing form for submitting reviews with star ratings
- **Admin Dashboard** (`/admin`): Internal dashboard with live-updating review list). analytics, and AI-generated insights

---

## File Structure

```
fynd-challenge-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with fonts and metadata
│   │   ├── globals.css         # Global styles and Tailwind imports
│   │   ├── page.tsx            # User Dashboard (home page)
│   │   ├── admin/
│   │   │   └── page.tsx        # Admin Dashboard
│   │   └── api/
│   │       ├── reviews/
│   │       │   └── route.ts    # Reviews API (GET/POST endpoints)
│   │       └── health/
│   │           └── route.ts    # Health check endpoint
│   ├── components/             # Reusable React components
│   │   ├── StarRating.tsx      # Star rating input & display
│   │   ├── ReviewForm.tsx      # Feedback submission form
│   │   ├── ReviewList.tsx      # List of reviews for admin
│   │   └── Analytics.tsx       # Analytics dashboard widgets
│   └── lib/                    # Core utilities and services
│       ├── types.ts            # TypeScript types & Zod schemas
│       ├── db.ts               # MongoDB database operations
│       └── llm.ts              # OpenAI LLM integration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── next.config.js              # Next.js configuration
├── vercel.json                 # Vercel deployment configuration
├── .env.example                # Example environment variables
├── .env.local                  # Local environment variables (git-ignored)
└── .gitignore                  # Git ignore rules
```

---

## File Descriptions

### `/src/app/` - Pages & API Routes

| File | Description |
|------|-------------|
| `layout.tsx` | Root layout that wraps all pages. Sets up Inter font, metadata (title, description), and imports global CSS. |
| `globals.css` | Global styles including Tailwind directives, custom animations (shimmer, fadeIn, pulse), and scrollbar styling. |
| `page.tsx` | **User Dashboard** - Public page with hero section and feedback form. Users can rate (1-5 stars) and submit reviews. |
| `admin/page.tsx` | **Admin Dashboard** - Internal page showing all reviews with AI summaries, recommended actions, analytics, and filtering. Auto-refreshes every 30 seconds. |
| `api/reviews/route.ts` | **Reviews API** - `POST` to submit new review (triggers LLM analysis), `GET` to fetch all reviews with analytics. Returns JSON with explicit schemas. |
| `api/health/route.ts` | **Health Check API** - Returns system health status including database connectivity. Used for monitoring. |

### `/src/components/` - UI Components

| File | Description |
|------|-------------|
| `StarRating.tsx` | Interactive star rating component with hover effects. Includes `StarRating` (input) and `StarDisplay` (read-only) variants. |
| `ReviewForm.tsx` | Complete feedback form with validation, loading states, error handling, and success state showing AI response. |
| `ReviewList.tsx` | Renders list of review cards showing rating, review text, AI summary, and recommended actions. Handles empty and loading states. |
| `Analytics.tsx` | Dashboard widgets showing total reviews, average rating, reviews today/this week, rating distribution bar chart, and sentiment breakdown. |

### `/src/lib/` - Core Services

| File | Description |
|------|-------------|
| `types.ts` | **Type Definitions & Schemas** - Zod schemas for request/response validation (`ReviewSubmissionSchema`, `ReviewRecordSchema`), TypeScript types, and error codes. |
| `db.ts` | **Database Layer** - MongoDB operations: `saveReview()`, `getAllReviews()`, `getAnalytics()`, `checkHealth()`. Handles connection pooling. |
| `llm.ts` | **LLM Service** - OpenAI integration for generating user responses, summaries, and recommended actions. Includes fallback responses for API failures. |

### Root Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Project metadata, npm scripts (`dev`, `build`, `start`), and dependencies (Next.js, React, MongoDB, OpenAI, Zod, Tailwind). |
| `tsconfig.json` | TypeScript compiler options with path alias `@/*` for clean imports. |
| `tailwind.config.ts` | Tailwind CSS configuration with custom color palette and animations. |
| `next.config.js` | Next.js settings (React strict mode enabled). |
| `vercel.json` | Vercel deployment configuration specifying environment variable references. |
| `.gitignore` | Files excluded from git: `node_modules`, `.next`, `.env.local`, IDE files, OS files. |

---

## API Endpoints

### `POST /api/reviews`
Submit a new review.

**Request:**
```json
{
  "rating": 4,
  "review": "Great service, very helpful!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "aiResponse": "Thank you for your wonderful feedback..."
  }
}
```

### `GET /api/reviews`
Fetch all reviews with analytics.

**Query Parameters:**
- `rating` (optional): Filter by star rating (1-5)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [...],
    "total": 10,
    "analytics": {
      "averageRating": 4.2,
      "ratingDistribution": {"1": 0, "2": 1, "3": 2, "4": 5, "5": 2},
      "totalReviews": 10,
      "reviewsToday": 3,
      "reviewsThisWeek": 8
    }
  }
}
```

### `GET /api/health`
Check system health.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T12:00:00.000Z",
  "services": {
    "database": true,
    "api": true
  }
}
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (from MongoDB Atlas) |
| `OPENAI_API_KEY` | OpenAI API key for LLM features |

---

## Deployment to Vercel

See `DEPLOY.md` for step-by-step deployment instructions.
