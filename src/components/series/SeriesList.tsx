import React from 'react'
import Link from 'next/link'
import type { SeriesWithProducts } from '@/lib/series'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import type { Media } from '@/payload-types'

interface SeriesListProps {
  seriesList: SeriesWithProducts[]
}

export function SeriesList({ seriesList }: Readonly<SeriesListProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {seriesList.map(({ series, products }) => {
        // Use first product's image as series cover if available
        const coverImage = products[0]?.featuredImage as Media | null
        const imageUrl =
          coverImage && typeof coverImage !== 'string' && coverImage.url
            ? coverImage.url
            : '/logo.png'
        const hasImage = Boolean(coverImage?.url)

        return (
          <Link
            key={series.id}
            href={`/series/${series.slug}`}
            className="group flex flex-col h-full bg-white border border-border transition-all duration-300 hover:shadow-xl hover:border-primary/50"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full overflow-hidden border-b border-border bg-white">
              <img
                src={imageUrl}
                alt={series.name}
                className={`absolute inset-0 w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110 p-8 ${
                  hasImage ? '' : 'opacity-20 grayscale sepia'
                }`}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Tier Badge */}
              {series.tier && (
                <span className="absolute top-3 right-3 text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-1">
                  {series.tier}
                </span>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col grow justify-between bg-card">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {series.name}
                  </h3>
                  <HiOutlineArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <div className="h-1 w-8 bg-border group-hover:bg-primary group-hover:w-full transition-all duration-500 ease-out mb-3" />

                {series.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {series.description}
                  </p>
                )}
              </div>

              {/* CTA Pill */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors border border-border px-3 py-1 rounded-full group-hover:border-primary">
                  Explore Series
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
