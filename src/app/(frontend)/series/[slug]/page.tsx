import React from 'react'
import { getSeriesBySlug } from '@/lib/series'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Heading } from '@/components/ui/heading'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const data = await getSeriesBySlug(slug)

  if (!data) return { title: 'Not Found' }

  return {
    title: `${data.series.name} Series | Honeywell`,
    description: data.series.description || `Explore the ${data.series.name} series.`,
  }
}

interface SeriesDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function SeriesDetailPage({ params }: Readonly<SeriesDetailPageProps>) {
  const { slug } = await params
  const data = await getSeriesBySlug(slug)

  if (!data) {
    return notFound()
  }

  const { series, products } = data

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <Link
        href="/series"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase text-sm font-bold tracking-wide">Back to Series List</span>
      </Link>

      <Heading>Products in {series.name}</Heading>

      <ProductGrid products={products} />
    </div>
  )
}
