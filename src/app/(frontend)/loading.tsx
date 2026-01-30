import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { HeroSkeleton } from '@/components/skeletons/HeroSkeleton'
import { CategoryCardSkeleton } from '@/components/skeletons/CategoryCardSkeleton'
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

export default function Loading() {
  return (
    <>
      <HeroSkeleton />

      {/* CategoryShowcase Skeleton */}
      <section className="py-6 md:py-10 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          {/* Heading */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <Skeleton className="h-8 w-48 md:h-10 md:w-64" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }, (_, i) => i).map((index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* NewArrivals Skeleton */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <Skeleton className="h-8 w-48 md:h-10 md:w-64" />
            {/* View All Button hidden md:flex */}
            <Skeleton className="hidden md:block h-6 w-24" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {Array.from({ length: 4 }, (_, i) => i).map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SeriesSection Skeleton */}
      <section className="py-6 md:py-10 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <Skeleton className="h-8 w-48 md:h-10 md:w-64 mb-6 md:mb-8" />

          <div className="flex flex-col gap-8 md:gap-16">
            {Array.from({ length: 2 }, (_, i) => i).map((index) => (
              <div key={index} className="space-y-4 md:space-y-8">
                {/* Series Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-6 w-32" />
                </div>

                {/* Series Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {Array.from({ length: 4 }, (_, j) => j).map((jIndex) => (
                    <ProductCardSkeleton key={jIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
