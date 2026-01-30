import { Skeleton } from '@/components/ui/skeleton'

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white border border-border">
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-white">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col grow justify-between bg-card">
        <div>
          <div className="flex items-center justify-between mb-2">
            {/* Title */}
            <Skeleton className="h-7 w-1/2" />
          </div>
          {/* Divider */}
          <div className="h-1 w-8 bg-border mb-3" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Pill */}
        <div className="mt-4">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}
