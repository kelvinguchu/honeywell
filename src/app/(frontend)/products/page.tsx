import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getProducts } from '@/lib/products'
import { notFound } from 'next/navigation'
import { ProductsHeader } from '@/components/products/ProductsHeader'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductsPagination } from '@/components/products/ProductsPagination'
import { ProductsFilter } from '@/components/products/ProductsFilter'

export const metadata = {
  title: 'Products | Honeywell',
  description: 'Explore our range of premium audio and power accessories.',
}

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    series?: string
    status?: string
    search?: string
    page?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: Readonly<ProductsPageProps>) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const category = params.category
  const series = params.series
  const status = params.status
  const search = params.search
  const sort = params.sort

  // Fetch filter options
  const payload = await getPayload({ config })

  const [categoriesResult, seriesResult, productsResult] = await Promise.all([
    payload.find({
      collection: 'categories',
      limit: 100,
      depth: 0,
      sort: 'name',
    }),
    payload.find({
      collection: 'product-series',
      limit: 100,
      depth: 0,
      sort: 'name',
    }),
    getProducts({
      page,
      limit: 12,
      categorySlug: category,
      seriesSlug: series,
      status,
      search,
      sort,
    }),
  ])

  const { docs: products, totalPages, totalDocs } = productsResult

  if (!products) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      <ProductsHeader category={category} series={series} search={search} />

      {/* Filter bar */}
      <ProductsFilter
        categories={categoriesResult.docs}
        series={seriesResult.docs}
        totalProducts={totalDocs}
      />

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <ProductsPagination
            totalPages={totalPages}
            currentPage={page}
            category={category}
            sort={sort}
          />
        </>
      )}
    </div>
  )
}
