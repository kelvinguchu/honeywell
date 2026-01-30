import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/skeletons/ProductCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      {/* Back Link Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Heading Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 md:h-12 w-64 md:w-96" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => i).map((index) => (
          <div key={index} className="h-full">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
