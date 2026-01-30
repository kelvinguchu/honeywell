import React from 'react'
import { getSeriesWithProducts } from '@/lib/series'
import { SeriesClient } from '@/components/series/SeriesClient'
import { Heading } from '@/components/ui/heading'

export const metadata = {
  title: 'Series | Honeywell',
  description: 'Discover our exclusive product series.',
}

export default async function SeriesPage() {
  const seriesList = await getSeriesWithProducts()

  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      <Heading as="h1">Product Series</Heading>
      <SeriesClient seriesList={seriesList} />
    </div>
  )
}
