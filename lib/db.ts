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
    console.error('MongoDB connection failed: MONGODB_URI not configured');
    throw new Error('Database configuration missing');
  }

  console.log('Attempting MongoDB connection...');

  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log('Creating new MongoDB connection promise...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose.connection;
    }).catch((error) => {
      console.error('MongoDB connection failed:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection established');
  } catch (e) {
    console.error('Failed to establish MongoDB connection:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;