import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiter for search API: 30 requests per 10 seconds per IP
export const searchRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '10 s'),
  analytics: true,
  prefix: 'ratelimit:search',
})

// Rate limiter for general API: 100 requests per minute per IP
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:api',
})

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  SEARCH: 60 * 5, // 5 minutes for search results
  PRODUCTS: 60 * 10, // 10 minutes for product lists
  PRODUCT: 60 * 15, // 15 minutes for single product
  CATEGORIES: 60 * 30, // 30 minutes for categories
  SERIES: 60 * 30, // 30 minutes for series
  HEADER_DATA: 60 * 15, // 15 minutes for header navigation data
} as const

// Cache key generators
export const cacheKeys = {
  search: (query: string, limit: number) => `cache:search:${query.toLowerCase().trim()}:${limit}`,
  products: (page: number, limit: number, filters?: string) =>
    `cache:products:${page}:${limit}${filters ? ':' + filters : ''}`,
  product: (slug: string) => `cache:product:${slug}`,
  categories: () => 'cache:categories:all',
  category: (slug: string) => `cache:category:${slug}`,
  series: () => 'cache:series:all',
  seriesDetail: (slug: string) => `cache:series:${slug}`,
  headerData: () => 'cache:header:data',
}

// Generic cache helpers
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get<T>(key)
    return cached
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setInCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, data, { ex: ttlSeconds })
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    // Get all keys matching the pattern
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Redis invalidate error:', error)
  }
}

// Invalidate specific cache types
export const invalidateProductCache = () => invalidateCache('cache:product*')
export const invalidateCategoryCache = () => invalidateCache('cache:category*')
export const invalidateSeriesCache = () => invalidateCache('cache:series*')
export const invalidateSearchCache = () => invalidateCache('cache:search*')
export const invalidateHeaderCache = () => invalidateCache('cache:header*')
export const invalidateAllCache = () => invalidateCache('cache:*')
