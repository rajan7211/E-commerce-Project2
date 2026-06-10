import Redis from "ioredis";
import logger from "./logger.config";

//  CREATE THE REDIS CLIENT (the connection)
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  lazyConnect: true,         
  maxRetriesPerRequest: 1,   
  enableOfflineQueue: false, 
});
let isConnected = false;

redis.on("ready", () => {
  isConnected = true;
  logger.info("Redis connected");
});

redis.on("error", () => {
  isConnected = false;
});

// call this once when the server starts 
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
  } catch {
    logger.warn("Redis not available ❌ - app will work without cache");
  }
};


//  GET FROM CACHE 

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (!isConnected) return null;
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
};

//  SAVE TO CACHE (with TTL in seconds)

export const setCache = async (
  key: string,
  value: unknown,
  seconds: number = 300, // default 5 minutes
): Promise<void> => {
  if (!isConnected) return;
  try {
    await redis.set(key, JSON.stringify(value), "EX", seconds);
  } catch {
    // caching is optional - never break the API for it
  }
};


// CLEAR PRODUCT CACHE (call when products change)

export const clearProductCache = async (): Promise<void> => {
  if (!isConnected) return;
  try {
    const keys = await redis.keys("products:*");
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cache cleared: ${keys.length} product keys deleted`);
    }
  } catch {
    // ignore
  }
};

export default redis;