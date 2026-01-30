import { Skeleton } from '@/components/ui/skeleton'

export function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border">
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 min-h-auto lg:min-h-162.5 items-center pt-24 pb-6 md:pt-28 md:pb-10 lg:py-0">
          {/* Hero Text Section */}
          <div className="flex flex-col items-start justify-center relative z-20 lg:col-span-5 pr-0 lg:pr-4">
            {/* Title */}
            <Skeleton className="h-16 sm:h-20 lg:h-32 w-full  max-w-100 mb-6 lg:mb-10" />

            {/* Paragraph */}
            <div className="w-full max-w-xl mb-8 lg:mb-10 border-l-4 border-border pl-4 md:pl-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Skeleton className="h-12 md:h-14 w-32 md:w-40" />
              <Skeleton className="h-12 md:h-14 w-32 md:w-40" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:col-span-7 gap-3 lg:gap-4 w-full h-full lg:pt-20 lg:pb-12 mt-4 lg:mt-0">
            {/* Featured Product Card */}
            <Skeleton className="w-full h-64 lg:h-auto rounded-lg" />

            {/* Secondary Products */}
            <div className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-rows-4 gap-3 lg:gap-4">
              <Skeleton className="w-full h-24 lg:h-auto rounded-lg" />
              <Skeleton className="w-full h-24 lg:h-auto rounded-lg" />
              <Skeleton className="w-full h-24 lg:h-auto rounded-lg" />
              <Skeleton className="w-full h-24 lg:h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
