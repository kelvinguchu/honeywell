import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { cacheKeys, getFromCache, setInCache, CACHE_TTL } from '@/lib/redis'
import type { Category, Product, ProductSery, Media } from '@/payload-types'

export interface CategoryWithImage extends Category {
  displayImage: Media | null
}

// Get all categories with caching
export async function getCachedCategories(): Promise<CategoryWithImage[]> {
  const cacheKey = cacheKeys.categories()

  // Check cache first
  const cached = await getFromCache<CategoryWithImage[]>(cacheKey)
  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0,
  })

  // Get display image for each category (first product's featured image)
  const categoriesWithImages: CategoryWithImage[] = await Promise.all(
    categories.map(async (category) => {
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          category: { equals: category.id },
        },
        limit: 1,
        depth: 1,
        select: {
          featuredImage: true,
        },
      })

      const displayImage = products[0]?.featuredImage as Media | null

      return {
        ...category,
        displayImage,
      }
    }),
  )

  // Cache the results
  await setInCache(cacheKey, categoriesWithImages, CACHE_TTL.CATEGORIES)

  return categoriesWithImages
}

// Get single category with caching
export async function getCachedCategory(slug: string): Promise<Category | null> {
  const cacheKey = cacheKeys.category(slug)

  const cached = await getFromCache<Category>(cacheKey)
  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 0,
  })

  const category = docs[0] || null

  if (category) {
    await setInCache(cacheKey, category, CACHE_TTL.CATEGORIES)
  }

  return category
}

// Get products with caching
export async function getCachedProducts(options: {
  page?: number
  limit?: number
  category?: string
  series?: string
  search?: string
}): Promise<{
  docs: Product[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}> {
  const { page = 1, limit = 12, category, series, search } = options

  // Build a cache key based on filters
  const filterString = [
    category && `cat:${category}`,
    series && `ser:${series}`,
    search && `q:${search}`,
  ]
    .filter(Boolean)
    .join(':')

  const cacheKey = cacheKeys.products(page, limit, filterString || undefined)

  const cached = await getFromCache<{
    docs: Product[]
    totalDocs: number
    totalPages: number
    page: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }>(cacheKey)

  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  // Build where clause
  const whereConditions: Where[] = []

  if (category) {
    whereConditions.push({ 'category.slug': { equals: category } })
  }

  if (series) {
    whereConditions.push({ 'series.slug': { equals: series } })
  }

  if (search) {
    whereConditions.push({
      or: [{ name: { like: search } }, { shortDescription: { like: search } }],
    })
  }

  const result = await payload.find({
    collection: 'products',
    page,
    limit,
    depth: 1,
    where: whereConditions.length > 0 ? { and: whereConditions } : undefined,
  })

  const response = {
    docs: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page || page,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }

  // Cache for shorter time if search query (more dynamic)
  const ttl = search ? CACHE_TTL.SEARCH : CACHE_TTL.PRODUCTS
  await setInCache(cacheKey, response, ttl)

  return response
}

// Get single product with caching
export async function getCachedProduct(slug: string): Promise<Product | null> {
  const cacheKey = cacheKeys.product(slug)

  const cached = await getFromCache<Product>(cacheKey)
  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
  })

  const product = docs[0] || null

  if (product) {
    await setInCache(cacheKey, product, CACHE_TTL.PRODUCT)
  }

  return product
}

export interface SeriesWithProducts {
  series: ProductSery
  products: Product[]
}

// Get all series with products and caching
export async function getCachedSeriesWithProducts(): Promise<SeriesWithProducts[]> {
  const cacheKey = cacheKeys.series()

  const cached = await getFromCache<SeriesWithProducts[]>(cacheKey)
  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  const { docs: seriesList } = await payload.find({
    collection: 'product-series',
    limit: 100,
    depth: 0,
  })

  const seriesWithProducts: SeriesWithProducts[] = await Promise.all(
    seriesList.map(async (series) => {
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          series: { equals: series.id },
        },
        limit: 6,
        depth: 1,
      })

      return {
        series,
        products,
      }
    }),
  )

  await setInCache(cacheKey, seriesWithProducts, CACHE_TTL.SERIES)

  return seriesWithProducts
}

// Get single series with products
export async function getCachedSeriesDetail(slug: string): Promise<SeriesWithProducts | null> {
  const cacheKey = cacheKeys.seriesDetail(slug)

  const cached = await getFromCache<SeriesWithProducts>(cacheKey)
  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'product-series',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 0,
  })

  const series = docs[0]
  if (!series) return null

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      series: { equals: series.id },
    },
    limit: 50,
    depth: 1,
  })

  const result: SeriesWithProducts = { series, products }

  await setInCache(cacheKey, result, CACHE_TTL.SERIES)

  return result
}

// Get header navigation data with caching
export async function getCachedHeaderData(): Promise<{
  categories: CategoryWithImage[]
  series: SeriesWithProducts[]
  featuredProducts: Product[]
}> {
  const cacheKey = cacheKeys.headerData()

  const cached = await getFromCache<{
    categories: CategoryWithImage[]
    series: SeriesWithProducts[]
    featuredProducts: Product[]
  }>(cacheKey)

  if (cached) {
    return cached
  }

  const payload = await getPayload({ config })

  // Fetch all data in parallel
  const [categoriesResult, seriesResult, productsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 12,
      depth: 0,
    }),
    payload.find({
      collection: 'product-series',
      limit: 3,
      depth: 0,
    }),
    payload.find({
      collection: 'products',
      where: {
        status: { in: ['new', 'active'] },
      },
      limit: 6,
      depth: 1,
      sort: '-createdAt',
    }),
  ])

  // Get display images for categories
  const categoriesWithImages: CategoryWithImage[] = await Promise.all(
    categoriesResult.docs.map(async (category) => {
      const { docs: prods } = await payload.find({
        collection: 'products',
        where: {
          category: { equals: category.id },
        },
        limit: 1,
        depth: 1,
        select: {
          featuredImage: true,
        },
      })

      return {
        ...category,
        displayImage: prods[0]?.featuredImage as Media | null,
      }
    }),
  )

  // Get products for each series
  const seriesWithProducts = await Promise.all(
    seriesResult.docs.map(async (series) => {
      const { docs: prods } = await payload.find({
        collection: 'products',
        where: {
          series: { equals: series.id },
        },
        limit: 4,
        depth: 1,
      })

      return {
        series,
        products: prods,
      }
    }),
  )

  const result = {
    categories: categoriesWithImages,
    series: seriesWithProducts,
    featuredProducts: productsResult.docs,
  }

  await setInCache(cacheKey, result, CACHE_TTL.HEADER_DATA)

  return result
}
