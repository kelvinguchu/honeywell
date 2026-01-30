import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full border border-border bg-card">
      {/* Image */}
      <div className="relative aspect-square border-b border-border bg-muted/20">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-col grow">
        <div className="p-4 flex flex-col grow gap-4">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />
          <div className="grow" />
        </div>

        <div className="mt-auto border-t border-border p-4 flex items-center justify-between gap-2">
          {/* Price */}
          <Skeleton className="h-7 w-24" />
          {/* Button */}
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}
