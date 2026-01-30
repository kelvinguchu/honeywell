'use client'

import React, { useState } from 'react'
import type { SeriesWithProducts } from '@/lib/series'
import { SeriesSearch } from './SeriesSearch'
import { SeriesList } from './SeriesList'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { HiSquares2X2 } from 'react-icons/hi2'

interface SeriesClientProps {
  seriesList: SeriesWithProducts[]
}

export function SeriesClient({ seriesList }: Readonly<SeriesClientProps>) {
  const [filteredSeries, setFilteredSeries] = useState(seriesList)

  return (
    <>
      <SeriesSearch seriesList={seriesList} onFilter={setFilteredSeries} />
      {filteredSeries.length > 0 ? (
        <SeriesList seriesList={filteredSeries} />
      ) : (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HiSquares2X2 className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No series found</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filter settings.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  )
}
