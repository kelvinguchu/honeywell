import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { searchRateLimiter, cacheKeys, getFromCache, setInCache, CACHE_TTL } from '@/lib/redis'

interface SearchResults {
  products: unknown[]
  categories: unknown[]
  series: unknown[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const limit = Number.parseInt(searchParams.get('limit') || '8', 10)

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [], categories: [], series: [] })
  }

  // Rate limiting by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  const { success, remaining, reset } = await searchRateLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      },
    )
  }

  const searchTerm = query.trim()
  const cacheKey = cacheKeys.search(searchTerm, limit)

  // Check cache first
  const cached = await getFromCache<SearchResults>(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'X-Cache': 'HIT',
        'X-RateLimit-Remaining': remaining.toString(),
      },
    })
  }

  const payload = await getPayload({ config })

  // Search products using 'like' operator (case-insensitive, all words must be present)
  const [productsResult, categoriesResult, seriesResult] = await Promise.all([
    payload.find({
      collection: 'products',
      where: {
        or: [{ name: { like: searchTerm } }, { shortDescription: { like: searchTerm } }],
      },
      limit,
      depth: 1,
      select: {
        name: true,
        slug: true,
        featuredImage: true,
        shortDescription: true,
        basePrice: true,
        status: true,
      },
    }),
    payload.find({
      collection: 'categories',
      where: {
        or: [{ name: { like: searchTerm } }, { description: { like: searchTerm } }],
      },
      limit: 4,
      depth: 0,
      select: {
        name: true,
        slug: true,
      },
    }),
    payload.find({
      collection: 'product-series',
      where: {
        or: [{ name: { like: searchTerm } }, { description: { like: searchTerm } }],
      },
      limit: 4,
      depth: 0,
      select: {
        name: true,
        slug: true,
        tier: true,
      },
    }),
  ])

  const results: SearchResults = {
    products: productsResult.docs,
    categories: categoriesResult.docs,
    series: seriesResult.docs,
  }

  // Cache the results
  await setInCache(cacheKey, results, CACHE_TTL.SEARCH)

  return NextResponse.json(results, {
    headers: {
      'X-Cache': 'MISS',
      'X-RateLimit-Remaining': remaining.toString(),
    },
  })
}
