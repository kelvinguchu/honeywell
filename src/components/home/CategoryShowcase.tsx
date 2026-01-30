import Link from 'next/link'
import Image from 'next/image'
import { getCategoriesWithImages } from '@/lib/category-showcase'
import type { Media } from '@/payload-types'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { Heading } from '@/components/ui/heading'

export async function CategoryShowcase() {
  const categories = await getCategoriesWithImages()

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <section className="py-6 md:py-10 border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <Heading>Categories</Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => {
            const image = category.displayImage as Media | null
            const imageUrl = image?.url || '/logo.png'
            const hasImage = Boolean(image?.url)

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col h-full bg-white border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/50"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-white ">
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    className={`object-contain object-center transition-transform duration-500 group-hover:scale-110 p-8 ${
                      hasImage ? '' : 'opacity-20 grayscale sepia'
                    }`}
                  />
                  {/* Hover Overlay only on image */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col grow justify-between bg-card">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <HiOutlineArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <div className="h-1 w-8 bg-border group-hover:bg-primary group-hover:w-full transition-all duration-500 ease-out mb-3" />

                    {category.description && typeof category.description === 'string' && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Counter or Pill */}
                  <div className="mt-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors border border-border px-3 py-1 rounded-full group-hover:border-primary">
                      View Collection
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
