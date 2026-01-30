import React from 'react'
import type { ProductSery as ProductSeries, Media } from '@/payload-types'
import Image from 'next/image'

interface SeriesHeroProps {
  series: ProductSeries
}

export function SeriesHero({ series }: Readonly<SeriesHeroProps>) {
  const logo = series.logo as Media | null

  return (
    <div className="bg-muted/30 border-b border-border mb-12 pt-16">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {logo && typeof logo !== 'string' && logo.url && (
            <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
              <Image src={logo.url} alt={logo.alt || series.name} fill className="object-contain" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1">
                Series
              </span>
              {series.tier && (
                <span className="text-sm font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-1">
                  {series.tier} Tier
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              {series.name}
            </h1>
            {series.description && (
              <p className="text-lg text-muted-foreground max-w-3xl">{series.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
