import React from 'react'
import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { getSeriesWithProducts } from '@/lib/series'
import { ProductCard } from '@/components/products/ProductCard'
import { Heading } from '@/components/ui/heading'
import type { Media } from '@/payload-types'

export const SeriesSection = async () => {
  const seriesData = await getSeriesWithProducts()

  if (!seriesData || seriesData.length === 0) {
    return null
  }

  return (
    <section className="py-6 md:py-10 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <Heading>Product Series</Heading>

        <div className="flex flex-col gap-8 md:gap-16">
          {seriesData.map(({ series, products }) => (
            <div key={series.id} className="space-y-4 md:space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight">
                    {series.name}
                  </h3>
                  {series.logo && (series.logo as Media).url && (
                    <div className="relative h-8 w-20 md:h-10 md:w-24 opacity-80 mix-blend-multiply">
                      <img
                        src={(series.logo as Media).url!}
                        alt={(series.logo as Media).alt || series.name}
                        className="absolute inset-0 w-full h-full object-contain object-left"
                      />
                    </div>
                  )}
                </div>

                <Link
                  href={`/products?series=${series.id}`}
                  className="inline-flex items-center gap-2 font-bold hover:text-primary hover:underline decoration-2 underline-offset-4 text-sm md:text-base group md:self-end"
                >
                  View Full Collection
                  <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
