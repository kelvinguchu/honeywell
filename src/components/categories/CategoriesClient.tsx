'use client'

import React, { useState } from 'react'
import type { CategoryWithImage } from '@/lib/category-showcase'
import { CategorySearch } from './CategorySearch'
import { CategoryGrid } from './CategoryGrid'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { HiFolderOpen } from 'react-icons/hi2'

interface CategoriesClientProps {
  categories: CategoryWithImage[]
}

export function CategoriesClient({ categories }: Readonly<CategoriesClientProps>) {
  const [filteredCategories, setFilteredCategories] = useState(categories)

  return (
    <>
      <CategorySearch categories={categories} onFilter={setFilteredCategories} />
      {filteredCategories.length > 0 ? (
        <CategoryGrid categories={filteredCategories} />
      ) : (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HiFolderOpen className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No categories found</EmptyTitle>
            <EmptyDescription>Try adjusting your search terms.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </>
  )
}
