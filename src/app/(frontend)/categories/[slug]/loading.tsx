import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      {/* Back Link Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-6 md:mb-10">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 md:h-10 w-64 md:w-80" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }, (_, i) => i).map((index) => (
          <div key={index} className="h-full">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8 md:mt-12 flex justify-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}
