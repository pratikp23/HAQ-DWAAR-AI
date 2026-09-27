import mongoose from "mongoose";

/**
 * Connect to MongoDB with graceful error handling.
 * Server starts even if MongoDB is temporarily unavailable.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/haqdwaar-ai";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("[MongoDB] Connected successfully to host: " + conn.connection.host);
    console.log("[MongoDB] Database Name: " + conn.connection.name);
  } catch (error) {
    console.warn("[MongoDB] Warning: Database connection failed at " + mongoUri);
    console.warn("[MongoDB] Reason: " + error.message);
    console.warn("[MongoDB] Server will continue running without database-dependent operations.");
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Database connection disconnected.");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Database reconnected.");
  });
};
