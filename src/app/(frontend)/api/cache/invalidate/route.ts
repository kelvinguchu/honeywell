import { NextRequest, NextResponse } from 'next/server'
import {
  invalidateProductCache,
  invalidateCategoryCache,
  invalidateSeriesCache,
  invalidateSearchCache,
  invalidateHeaderCache,
  invalidateAllCache,
} from '@/lib/redis'

// Secret token for cache invalidation (set in environment)
const CACHE_SECRET = process.env.CACHE_INVALIDATION_SECRET

export async function POST(request: NextRequest) {
  // Verify secret token
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!CACHE_SECRET || token !== CACHE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type } = body as { type?: string }

    switch (type) {
      case 'products':
        await invalidateProductCache()
        await invalidateSearchCache()
        await invalidateHeaderCache()
        break
      case 'categories':
        await invalidateCategoryCache()
        await invalidateHeaderCache()
        break
      case 'series':
        await invalidateSeriesCache()
        await invalidateHeaderCache()
        break
      case 'all':
        await invalidateAllCache()
        break
      default:
        // Invalidate everything if no specific type
        await invalidateAllCache()
    }

    return NextResponse.json({
      success: true,
      message: `Cache invalidated for: ${type || 'all'}`,
    })
  } catch (error) {
    console.error('Cache invalidation error:', error)
    return NextResponse.json({ error: 'Failed to invalidate cache' }, { status: 500 })
  }
}
