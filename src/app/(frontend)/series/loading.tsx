import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryCardSkeleton } from '@/components/skeletons/CategoryCardSkeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      {/* Heading Skeleton */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <Skeleton className="h-8 md:h-12 w-48 md:w-64" />
      </div>

      {/* SeriesList Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }, (_, i) => i).map((index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
