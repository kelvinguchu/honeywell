'use client'

import React, { useState } from 'react'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import type { CategoryWithImage } from '@/lib/category-showcase'

interface CategorySearchProps {
  categories: CategoryWithImage[]
  onFilter: (filtered: CategoryWithImage[]) => void
}

export function CategorySearch({ categories, onFilter }: Readonly<CategorySearchProps>) {
  const [search, setSearch] = useState('')

  const handleSearch = (value: string) => {
    setSearch(value)
    if (!value.trim()) {
      onFilter(categories)
      return
    }

    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(value.toLowerCase()) ||
        cat.description?.toLowerCase().includes(value.toLowerCase()),
    )
    onFilter(filtered)
  }

  return (
    <div className="mb-6">
      <div className="relative max-w-md">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search categories..."
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
      {search && (
        <p className="text-sm text-muted-foreground mt-2">
          Showing results for &quot;{search}&quot;
        </p>
      )}
    </div>
  )
}
