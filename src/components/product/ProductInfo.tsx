import React from 'react'
import Link from 'next/link'
import type { Product, Category, ProductSery } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { HiOutlineCheckCircle, HiOutlineTag, HiOutlineSquares2X2 } from 'react-icons/hi2'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: Readonly<ProductInfoProps>) {
  const { name, status, shortDescription, description, basePrice, features, category, series } =
    product

  const categoryData = category as Category | null
  const seriesData = series as ProductSery | null

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {status === 'new' && (
            <Badge variant="default" className="rounded-none uppercase font-bold">
              New Arrival
            </Badge>
          )}
          {status === 'coming-soon' && (
            <Badge variant="secondary" className="rounded-none uppercase font-bold">
              Coming Soon
            </Badge>
          )}
          {status === 'discontinued' && (
            <Badge variant="destructive" className="rounded-none uppercase font-bold">
              Discontinued
            </Badge>
          )}
          {status === 'active' && (
            <Badge
              variant="outline"
              className="rounded-none uppercase font-bold border-green-500/50 text-green-600"
            >
              In Stock
            </Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2">
          {name}
        </h1>

        {/* Category & Series Links */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          {categoryData && (
            <Link
              href={`/categories/${categoryData.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              {categoryData.name}
            </Link>
          )}
          {seriesData && (
            <Link
              href={`/series/${seriesData.slug}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <HiOutlineTag className="w-4 h-4" />
              {seriesData.name} Series
            </Link>
          )}
        </div>

        {/* Price */}
        {basePrice !== undefined && basePrice !== null && (
          <div className="text-2xl md:text-3xl font-black text-primary mb-4">
            Ksh {basePrice.toLocaleString()}
          </div>
        )}

        <Separator className="my-4" />

        {/* Short Description */}
        {shortDescription && (
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {shortDescription}
          </p>
        )}
      </div>

      {/* Features Section */}
      {features && features.length > 0 && (
        <div>
          <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-l-4 border-primary pl-3">
            Key Features
          </h3>
          <ul className="space-y-2">
            {features.map((item) => (
              <li key={item.id || item.feature} className="flex items-start gap-2 text-sm">
                <HiOutlineCheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{item.feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Description */}
      {description && (
        <div>
          <h3 className="font-bold uppercase text-sm tracking-wider mb-3 border-l-4 border-primary pl-3">
            Description
          </h3>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground">
            <RichText data={description} />
          </div>
        </div>
      )}
    </div>
  )
}
