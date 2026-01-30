import React from 'react'
import { getProducts, getCategoryBySlug } from '@/lib/products'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductsPagination } from '@/components/products/ProductsPagination'
import { ProductsHeader } from '@/components/products/ProductsHeader'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) return { title: 'Not Found' }

  return {
    title: `${category.name} | Honeywell`,
    description: `Shop for ${category.name} at Honeywell.`,
  }
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
    sort?: string
  }>
}

export default async function CategoryPage({ params, searchParams }: Readonly<CategoryPageProps>) {
  const { slug } = await params
  const { page: pageStr, sort } = await searchParams
  const page = Number(pageStr) || 1

  const { docs: products, totalPages } = await getProducts({
    page,
    limit: 12,
    categorySlug: slug,
    sort,
  })

  const categoryData = await getCategoryBySlug(slug)

  if (!categoryData && products.length === 0) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      <Link
        href="/categories"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-sm font-bold tracking-wide">Back to Categories</span>
      </Link>

      <ProductsHeader category={categoryData ? categoryData.name : slug} />
      <ProductGrid products={products} />
      <ProductsPagination
        totalPages={totalPages}
        currentPage={page}
        basePath={`/categories/${slug}`}
        sort={sort}
      />
    </div>
  )
}
