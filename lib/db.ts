import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    'Warning: MONGODB_URI environment variable is not set. Database functionality will be disabled.'
  );
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection | null> | null;
}

// Global cache for the connection to prevent creating multiple connections
const globalCache = globalThis as typeof globalThis & {
  mongoose: MongooseCache;
};

let cached = globalCache.mongoose;

if (!cached) {
  cached = globalCache.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection | null> {
  if (!MONGODB_URI) {
    console.warn('MongoDB connection skipped: MONGODB_URI not configured');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;