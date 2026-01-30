'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  HiMagnifyingGlass,
  HiXMark,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineSquares2X2,
} from 'react-icons/hi2'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Product, Category, ProductSery, Media } from '@/payload-types'

type SearchProduct = Pick<
  Product,
  'id' | 'name' | 'slug' | 'featuredImage' | 'shortDescription' | 'basePrice' | 'status'
>
type SearchCategory = Pick<Category, 'id' | 'name' | 'slug'>
type SearchSeries = Pick<ProductSery, 'id' | 'name' | 'slug' | 'tier'>

interface SearchResults {
  products: SearchProduct[]
  categories: SearchCategory[]
  series: SearchSeries[]
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({
    products: [],
    categories: [],
    series: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getImageUrl = (image: string | Media | null | undefined) => {
    if (!image) return '/logo.png'
    if (typeof image === 'string') return image
    return image.url || '/logo.png'
  }

  const hasImage = (image: string | Media | null | undefined) => {
    if (!image) return false
    if (typeof image === 'string') return true
    return Boolean(image.url)
  }

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults({ products: [], categories: [], series: [] })
      setHasSearched(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setHasSearched(false)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`, {
        signal: abortControllerRef.current.signal,
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setHasSearched(true)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Search error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, search])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults({ products: [], categories: [], series: [] })
      setHasSearched(false)
    }
  }, [open])

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const hasResults =
    results.products.length > 0 || results.categories.length > 0 || results.series.length > 0

  const closeDialog = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Search"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <HiMagnifyingGlass className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, series..."
            className="flex-1 h-14 px-3 text-base bg-transparent border-0 outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <HiXMark className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
          <div className="ml-2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
            <kbd className="font-sans">⌘</kbd>
            <kbd className="font-sans">K</kbd>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && hasSearched && !hasResults && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HiOutlineCube className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No results found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          )}

          {!isLoading && query.length < 2 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <HiMagnifyingGlass className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">Start typing to search</p>
              <p className="text-xs mt-1">Minimum 2 characters</p>
            </div>
          )}

          {!isLoading && hasResults && (
            <div className="divide-y divide-border">
              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <HiOutlineSquares2X2 className="h-4 w-4" />
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        onClick={closeDialog}
                        className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Series */}
              {results.series.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <HiOutlineTag className="h-4 w-4" />
                    Series
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {results.series.map((s) => (
                      <Link
                        key={s.id}
                        href={`/series/${s.slug}`}
                        onClick={closeDialog}
                        className="px-3 py-1.5 text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {s.name}
                        {s.tier && (
                          <span className="text-[10px] uppercase tracking-wider opacity-70">
                            {s.tier}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <HiOutlineCube className="h-4 w-4" />
                    Products
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={closeDialog}
                        className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="relative w-14 h-14 shrink-0 bg-white border border-border rounded overflow-hidden">
                          <Image
                            src={getImageUrl(product.featuredImage)}
                            alt={product.name}
                            fill
                            className={`object-contain p-1 ${
                              hasImage(product.featuredImage) ? '' : 'opacity-20 grayscale sepia'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium group-hover:text-primary line-clamp-1 transition-colors">
                            {product.name}
                          </div>
                          {product.shortDescription && (
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {product.shortDescription}
                            </div>
                          )}
                          {product.basePrice && (
                            <div className="text-xs font-bold text-primary mt-0.5">
                              Ksh. {product.basePrice.toLocaleString('en-KE')}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasResults && (
          <div className="border-t border-border px-4 py-3 bg-muted/30">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={closeDialog}
              className="text-sm font-bold text-primary hover:underline cursor-pointer"
            >
              View all results for &quot;{query}&quot; →
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
