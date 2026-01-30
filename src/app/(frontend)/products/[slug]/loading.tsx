import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      {/* Back Link Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 md:mb-16">
        {/* Gallery Skeleton */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Skeleton className="w-full aspect-square md:aspect-auto md:h-125 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
            <Skeleton className="h-20 w-20" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <Skeleton className="h-10 w-3/4" />
          {/* Series Pill */}
          <Skeleton className="h-6 w-24 rounded-full" />
          {/* Price */}
          <Skeleton className="h-12 w-48" />

          <div className="h-px bg-border my-2" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>

          {/* Add To Cart */}
          <div className="mt-6 flex gap-4">
            <Skeleton className="h-12 w-full max-w-50" />
            <Skeleton className="h-12 w-full max-w-50" />
          </div>
        </div>
      </div>

      {/* Specifications Skeleton */}
      <div className="border-t border-border pt-8 md:pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  )
}
