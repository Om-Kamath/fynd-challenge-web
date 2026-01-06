import { MongoClient, Db, Collection } from "mongodb";
import { ReviewRecord } from "./types";

// ============================================
// MongoDB Connection Configuration
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "fynd_feedback";
const COLLECTION_NAME = "reviews";

if (!MONGODB_URI) {
  console.warn(
    "Warning: MONGODB_URI is not set. Database operations will fail."
  );
}

// ============================================
// Connection Management
// ============================================

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Get MongoDB client with connection pooling
 */
async function getClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    await client.connect();
  }
  return client;
}

/**
 * Get database instance
 */
async function getDb(): Promise<Db> {
  if (!db) {
    const mongoClient = await getClient();
    db = mongoClient.db(DB_NAME);
  }
  return db;
}

/**
 * Get reviews collection
 */
async function getCollection(): Promise<Collection<ReviewRecord>> {
  const database = await getDb();
  return database.collection<ReviewRecord>(COLLECTION_NAME);
}

// ============================================
// Database Operations
// ============================================

/**
 * Save a new review to the database
 */
export async function saveReview(review: ReviewRecord): Promise<ReviewRecord> {
  try {
    const collection = await getCollection();
    await collection.insertOne(review as any);
    return review;
  } catch (error) {
    console.error("Error saving review:", error);
    throw new Error("Failed to save review to database");
  }
}

/**
 * Get all reviews, sorted by creation date (newest first)
 */
export async function getAllReviews(): Promise<ReviewRecord[]> {
  try {
    const collection = await getCollection();
    const reviews = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return reviews as unknown as ReviewRecord[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews from database");
  }
}

/**
 * Get reviews with filters
 */
export async function getReviewsWithFilters(filters: {
  rating?: number;
  startDate?: string;
  endDate?: string;
}): Promise<ReviewRecord[]> {
  try {
    const collection = await getCollection();
    const query: any = {};

    if (filters.rating) {
      query.rating = filters.rating;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    const reviews = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return reviews as unknown as ReviewRecord[];
  } catch (error) {
    console.error("Error fetching filtered reviews:", error);
    throw new Error("Failed to fetch filtered reviews from database");
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(): Promise<{
  averageRating: number;
  ratingDistribution: Record<string, number>;
  totalReviews: number;
  reviewsToday: number;
  reviewsThisWeek: number;
}> {
  try {
    const reviews = await getAllReviews();
    const total = reviews.length;

    if (total === 0) {
      return {
        averageRating: 0,
        ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
        totalReviews: 0,
        reviewsToday: 0,
        reviewsThisWeek: 0,
      };
    }

    // Calculate average rating
    const sumRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((sumRatings / total) * 10) / 10;

    // Calculate rating distribution
    const ratingDistribution: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    reviews.forEach((r) => {
      ratingDistribution[r.rating.toString()]++;
    });

    // Calculate time-based metrics
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const reviewsToday = reviews.filter(
      (r) => new Date(r.createdAt) >= todayStart
    ).length;

    const reviewsThisWeek = reviews.filter(
      (r) => new Date(r.createdAt) >= weekStart
    ).length;

    return {
      averageRating,
      ratingDistribution,
      totalReviews: total,
      reviewsToday,
      reviewsThisWeek,
    };
  } catch (error) {
    console.error("Error calculating analytics:", error);
    throw new Error("Failed to calculate analytics");
  }
}

/**
 * Check database connection health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const mongoClient = await getClient();
    await mongoClient.db("admin").command({ ping: 1 });
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Close database connection (for cleanup)
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
