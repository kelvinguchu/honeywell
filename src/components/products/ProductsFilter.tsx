'use client'

import React, { useState, useTransition, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  HiMagnifyingGlass,
  HiXMark,
  HiFunnel,
  HiChevronDown,
  HiAdjustmentsHorizontal,
} from 'react-icons/hi2'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { Category, ProductSery } from '@/payload-types'

interface ProductsFilterProps {
  categories: Category[]
  series: ProductSery[]
  totalProducts?: number
}

const STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Active', value: 'active' },
  { label: 'Coming Soon', value: 'coming-soon' },
]

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Name A-Z', value: 'name' },
  { label: 'Name Z-A', value: '-name' },
  { label: 'Price: Low to High', value: 'basePrice' },
  { label: 'Price: High to Low', value: '-basePrice' },
]

// Extracted reusable components
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: Readonly<{
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}>) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer">
        {title}
        <HiChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}

function FilterOptions({
  options,
  currentValue,
  onSelect,
}: Readonly<{
  options: { label: string; value: string; count?: number }[]
  currentValue: string
  onSelect: (value: string | null) => void
}>) {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(currentValue === option.value ? null : option.value)}
          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
            currentValue === option.value
              ? 'bg-primary text-primary-foreground font-medium'
              : 'hover:bg-muted text-foreground'
          }`}
        >
          <span className="flex items-center justify-between">
            {option.label}
            {option.count !== undefined && (
              <span className="text-xs opacity-70">({option.count})</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search products...',
  showLabel = false,
}: Readonly<{
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
  showLabel?: boolean
}>) {
  return (
    <div>
      {showLabel && (
        <span className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
          Search
        </span>
      )}
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-9 text-sm bg-background border border-border rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <HiXMark className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Custom hook for filter logic
function useProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSearch = searchParams.get('search') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentSeries = searchParams.get('series') || ''
  const currentStatus = searchParams.get('status') || ''
  const currentSort = searchParams.get('sort') || '-createdAt'

  const [searchValue, setSearchValue] = useState(currentSearch)

  useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      params.delete('page')

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        updateFilters({ search: searchValue || null })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchValue, currentSearch, updateFilters])

  const clearAllFilters = useCallback(() => {
    setSearchValue('')
    startTransition(() => {
      router.push(pathname, { scroll: false })
    })
  }, [router, pathname])

  const hasActiveFilters =
    currentSearch ||
    currentCategory ||
    currentSeries ||
    currentStatus ||
    currentSort !== '-createdAt'

  const activeFilterCount = [currentCategory, currentSeries, currentStatus, currentSearch].filter(
    Boolean,
  ).length

  return {
    isPending,
    searchValue,
    setSearchValue,
    currentSearch,
    currentCategory,
    currentSeries,
    currentStatus,
    currentSort,
    updateFilters,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  }
}

export function ProductsFilter({
  categories,
  series,
  totalProducts,
}: Readonly<ProductsFilterProps>) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const {
    isPending,
    searchValue,
    setSearchValue,
    currentSearch,
    currentCategory,
    currentSeries,
    currentStatus,
    currentSort,
    updateFilters,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useProductFilters()

  const categoryOptions = categories.map((cat) => ({ label: cat.name, value: cat.slug }))
  const seriesOptions = series.map((s) => ({ label: s.name, value: s.slug }))

  const filterContent = (
    <div className="space-y-2">
      <div className="pb-4 border-b border-border">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue('')}
          showLabel
        />
      </div>

      <div className="border-b border-border">
        <FilterSection title="Category">
          <FilterOptions
            options={categoryOptions}
            currentValue={currentCategory}
            onSelect={(value) => updateFilters({ category: value })}
          />
        </FilterSection>
      </div>

      <div className="border-b border-border">
        <FilterSection title="Series">
          <FilterOptions
            options={seriesOptions}
            currentValue={currentSeries}
            onSelect={(value) => updateFilters({ series: value })}
          />
        </FilterSection>
      </div>

      <div className="border-b border-border">
        <FilterSection title="Status">
          <FilterOptions
            options={STATUS_OPTIONS}
            currentValue={currentStatus}
            onSelect={(value) => updateFilters({ status: value })}
          />
        </FilterSection>
      </div>

      {hasActiveFilters && (
        <div className="pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full cursor-pointer"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {totalProducts !== undefined && (
            <span className="text-sm text-muted-foreground">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
            </span>
          )}

          <div className="hidden md:flex flex-wrap gap-2">
            {currentSearch && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                Search: {currentSearch}
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('')
                    updateFilters({ search: null })
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                >
                  <HiXMark className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                <button
                  type="button"
                  onClick={() => updateFilters({ category: null })}
                  className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                >
                  <HiXMark className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentSeries && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {series.find((s) => s.slug === currentSeries)?.name || currentSeries}
                <button
                  type="button"
                  onClick={() => updateFilters({ series: null })}
                  className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                >
                  <HiXMark className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label || currentStatus}
                <button
                  type="button"
                  onClick={() => updateFilters({ status: null })}
                  className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                >
                  <HiXMark className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mobile search */}
          <div className="relative flex-1 sm:hidden">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-border rounded-md outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Desktop inline filters */}
          <div className="hidden md:flex items-center gap-2">
            {/* Desktop search */}
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                className="w-48 h-10 pl-9 pr-3 text-sm bg-background border border-border rounded-md outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={currentCategory}
                onChange={(e) => updateFilters({ category: e.target.value || null })}
                className="h-10 pl-3 pr-8 text-sm bg-background border border-border rounded-md outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Series dropdown */}
            <div className="relative">
              <select
                value={currentSeries}
                onChange={(e) => updateFilters({ series: e.target.value || null })}
                className="h-10 pl-3 pr-8 text-sm bg-background border border-border rounded-md outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">All Series</option>
                {seriesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => updateFilters({ status: e.target.value || null })}
                className="h-10 pl-3 pr-8 text-sm bg-background border border-border rounded-md outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Sort dropdown (all screens) */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="h-10 pl-3 pr-8 text-sm bg-background border border-border rounded-md outline-none focus:border-primary appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <HiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Mobile filter button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden relative cursor-pointer">
                <HiFunnel className="h-5 w-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false} className="w-full sm:max-w-sm p-0">
              <SheetHeader className="p-4 border-b border-border flex-row items-center justify-between space-y-0">
                <SheetTitle className="flex items-center gap-2">
                  <HiAdjustmentsHorizontal className="h-5 w-5" />
                  Filters
                </SheetTitle>
                <SheetClose asChild>
                  <button
                    type="button"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                    aria-label="Close filters"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                </SheetClose>
              </SheetHeader>
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">{filterContent}</div>
            </SheetContent>
          </Sheet>

          {/* Desktop clear filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="hidden md:flex cursor-pointer"
            >
              <HiXMark className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {isPending && (
        <div className="mt-4 flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
