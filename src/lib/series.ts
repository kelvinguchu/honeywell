import { getPayload } from 'payload'
import config from '@/payload.config'
import type { ProductSery as ProductSeries, Product } from '@/payload-types'

export interface SeriesWithProducts {
  series: ProductSeries
  products: Product[]
}

export async function getSeriesWithProducts(): Promise<SeriesWithProducts[]> {
  const payload = await getPayload({ config })

  const { docs: seriesDocs } = await payload.find({
    collection: 'product-series',
    limit: 10,
    depth: 1,
    sort: 'sortOrder',
  })

  const results = await Promise.all(
    seriesDocs.map(async (series) => {
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          series: {
            equals: series.id,
          },
          featuredImage: {
            exists: true,
          },
        },
        limit: 4,
        sort: '-createdAt',
        depth: 1,
      })

      return {
        series: series as unknown as ProductSeries,
        products: products as unknown as Product[],
      }
    }),
  )

  return results.filter((item) => item.products.length > 0)
}

export async function getSeriesBySlug(slug: string): Promise<SeriesWithProducts | null> {
  const payload = await getPayload({ config })

  const { docs: seriesDocs } = await payload.find({
    collection: 'product-series',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  if (!seriesDocs.length) {
    return null
  }

  const series = seriesDocs[0] as unknown as ProductSeries

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      series: {
        equals: series.id,
      },
    },
    limit: 100, // Fetch more for the detail page
    sort: '-createdAt',
    depth: 1,
  })

  return {
    series,
    products: products as unknown as Product[],
  }
}
