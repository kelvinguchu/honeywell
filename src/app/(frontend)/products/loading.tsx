import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      {/* ProductsHeader Skeleton */}
      <div className="mb-6 md:mb-10">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 md:h-10 w-64 md:w-80" />
      </div>

      {/* ProductsFilter Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6 md:mb-8 pb-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* ProductGrid Skeleton */}
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
