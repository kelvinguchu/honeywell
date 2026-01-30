'use client'

import React, { useState } from 'react'
import { HiMagnifyingGlass, HiXMark, HiAdjustmentsHorizontal } from 'react-icons/hi2'
import type { SeriesWithProducts } from '@/lib/series'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

interface SeriesSearchProps {
  seriesList: SeriesWithProducts[]
  onFilter: (filtered: SeriesWithProducts[]) => void
}

function formatTier(tierValue: string): string {
  return tierValue
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function SeriesSearch({ seriesList, onFilter }: Readonly<SeriesSearchProps>) {
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState<string>('all')
  const [isOpen, setIsOpen] = useState(false)

  // Get unique tiers
  const tiers = [...new Set(seriesList.map((s) => s.series.tier).filter(Boolean))] as string[]

  const applyFilters = (newSearch: string, newTier: string) => {
    let filtered = [...seriesList]

    if (newSearch.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.series.name.toLowerCase().includes(newSearch.toLowerCase()) ||
          item.series.description?.toLowerCase().includes(newSearch.toLowerCase()),
      )
    }

    if (newTier !== 'all') {
      filtered = filtered.filter((item) => item.series.tier === newTier)
    }

    onFilter(filtered)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    applyFilters(value, tier)
  }

  const handleTierChange = (value: string) => {
    setTier(value)
    applyFilters(search, value)
  }

  const clearFilters = () => {
    setSearch('')
    setTier('all')
    onFilter(seriesList)
    setIsOpen(false)
  }

  const hasFilters = search || tier !== 'all'
  const filterCount = (search ? 1 : 0) + (tier === 'all' ? 0 : 1)

  return (
    <div className="mb-6">
      {/* Mobile: Sheet */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full cursor-pointer">
              <HiAdjustmentsHorizontal className="h-5 w-5 mr-2" />
              Filter & Search
              {hasFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {filterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Series</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search series..."
                  className="w-full h-11 pl-10 pr-10 text-sm bg-background border border-border rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Tier Filter */}
              {tiers.length > 0 && (
                <div>
                  <span className="text-sm font-medium mb-2 block">Tier</span>
                  <Select value={tier} onValueChange={handleTierChange}>
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="cursor-pointer">
                        All Tiers
                      </SelectItem>
                      {tiers.map((t) => (
                        <SelectItem key={t} value={t} className="cursor-pointer">
                          {formatTier(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Clear Filters */}
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full cursor-pointer">
                  Clear Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Inline */}
      <div className="hidden md:flex md:items-end md:gap-4">
        <div className="flex-1 max-w-md relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search series..."
            className="w-full h-11 pl-10 pr-10 text-sm bg-background border border-border rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          )}
        </div>

        {tiers.length > 0 && (
          <div className="w-48">
            <Select value={tier} onValueChange={handleTierChange}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  All Tiers
                </SelectItem>
                {tiers.map((t) => (
                  <SelectItem key={t} value={t} className="cursor-pointer">
                    {formatTier(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} size="sm" className="cursor-pointer">
            <HiXMark className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active filters indicator */}
      {hasFilters && (
        <p className="text-sm text-muted-foreground mt-2">
          {search && <>Showing results for &quot;{search}&quot;</>}
          {search && tier !== 'all' && <> in </>}
          {tier !== 'all' && <>{formatTier(tier)} tier</>}
        </p>
      )}
    </div>
  )
}
