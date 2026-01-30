import { getPayload, Where } from 'payload'
import config from '@/payload.config'
import type { Product } from '@/payload-types'

function getRelationId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object' && 'id' in value) {
    const relation = value as { id?: string | number }
    if (relation.id === undefined || relation.id === null) return null
    return typeof relation.id === 'number' ? String(relation.id) : relation.id
  }
  return null
}

export async function getNewArrivals(limit: number = 4): Promise<Product[]> {
  const payload = await getPayload({ config })

  const { docs: newProducts } = await payload.find({
    collection: 'products',
    where: {
      status: {
        equals: 'new',
      },
      featuredImage: {
        exists: true,
      },
    },
    limit,
    depth: 1,
  })

  if (newProducts.length > 0) {
    return newProducts as unknown as Product[]
  }

  const { docs: activeProducts } = await payload.find({
    collection: 'products',
    limit,
    depth: 1,
    where: {
      status: {
        equals: 'active',
      },
    },
  })

  return activeProducts as unknown as Product[]
}

export async function getProducts(options?: {
  limit?: number
  page?: number
  categorySlug?: string
  seriesSlug?: string
  status?: string
  search?: string
  sort?: string
}): Promise<{ docs: Product[]; totalPages: number; page: number; totalDocs: number }> {
  const payload = await getPayload({ config })
  const {
    limit = 12,
    page = 1,
    categorySlug,
    seriesSlug,
    status,
    search,
    sort = '-createdAt',
  } = options || {}

  // Build where conditions
  const whereConditions: Where[] = []

  // Exclude discontinued by default unless specifically requested
  if (status) {
    whereConditions.push({ status: { equals: status } })
  } else {
    whereConditions.push({ status: { not_equals: 'discontinued' } })
  }

  // Category filter
  if (categorySlug) {
    const { docs: categories } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    })

    if (categories.length > 0) {
      whereConditions.push({ category: { equals: categories[0].id } })
    }
  }

  // Series filter
  if (seriesSlug) {
    const { docs: seriesList } = await payload.find({
      collection: 'product-series',
      where: { slug: { equals: seriesSlug } },
      limit: 1,
    })

    if (seriesList.length > 0) {
      whereConditions.push({ series: { equals: seriesList[0].id } })
    }
  }

  // Search filter
  if (search) {
    whereConditions.push({
      or: [{ name: { like: search } }, { shortDescription: { like: search } }],
    })
  }

  const where: Where = whereConditions.length > 0 ? { and: whereConditions } : {}

  const {
    docs: products,
    totalPages,
    totalDocs,
    page: currentPage,
  } = await payload.find({
    collection: 'products',
    where,
    limit,
    page,
    sort,
    depth: 1,
  })

  return {
    docs: products as unknown as Product[],
    totalPages,
    totalDocs,
    page: currentPage || 1,
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  return (docs[0] as unknown as Product) || null
}

export async function getCategoryBySlug(slug: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return docs[0] || null
}

export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  const payload = await getPayload({ config })
  const related: Product[] = []
  const added = new Set<string>()

  const seriesId = getRelationId(product.series)
  const categoryId = getRelationId(product.category)
  const productId = String(product.id)

  const baseAnd: Where[] = [
    { status: { not_equals: 'discontinued' } },
    { id: { not_equals: productId } },
  ]

  const addDocs = (docs: unknown[]) => {
    docs.forEach((doc) => {
      const relatedProduct = doc as Product
      const id = String(relatedProduct.id)
      if (!added.has(id) && related.length < limit) {
        added.add(id)
        related.push(relatedProduct)
      }
    })
  }

  if (seriesId && related.length < limit) {
    const { docs } = await payload.find({
      collection: 'products',
      where: { and: [...baseAnd, { series: { equals: seriesId } }] },
      limit,
      sort: '-createdAt',
      depth: 1,
    })
    addDocs(docs)
  }

  if (categoryId && related.length < limit) {
    const { docs } = await payload.find({
      collection: 'products',
      where: { and: [...baseAnd, { category: { equals: categoryId } }] },
      limit,
      sort: '-createdAt',
      depth: 1,
    })
    addDocs(docs)
  }

  if (related.length < limit) {
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        and: [
          ...baseAnd,
          {
            or: [{ status: { equals: 'new' } }, { status: { equals: 'active' } }],
          },
        ],
      },
      limit,
      sort: '-createdAt',
      depth: 1,
    })
    addDocs(docs)
  }

  return related.slice(0, limit)
}
