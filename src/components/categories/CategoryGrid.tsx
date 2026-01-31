import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CategoryWithImage } from '@/lib/category-showcase'
import { ArrowRight } from 'lucide-react'
import type { Media } from '@/payload-types'

interface CategoryGridProps {
  categories: CategoryWithImage[]
}

export function CategoryGrid({ categories }: Readonly<CategoryGridProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => {
        const image = category.displayImage as Media | null

        // Determine the image URL safely
        let imageUrl = '/logo.png' // Fallback

        if (image && typeof image !== 'string' && image.url) {
          imageUrl = image.url
        } else if (typeof category.image === 'object' && category.image?.url) {
          imageUrl = category.image.url
        }

        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group block border border-border bg-card hover:border-primary transition-colors"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={category.name}
                  fill
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-105 p-8"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex bg-muted items-center justify-center h-full text-muted-foreground font-mono">
                  NO IMAGE
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-2">
                  {category.name}
                </h2>
                <span className="inline-flex items-center text-white text-xs font-bold uppercase tracking-wider border-b-2 border-primary pb-0.5">
                  View Products{' '}
                  <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
