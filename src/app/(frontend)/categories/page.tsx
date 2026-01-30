import React from 'react'
import { getCategoriesWithImages } from '@/lib/category-showcase'
import { CategoriesClient } from '@/components/categories/CategoriesClient'
import { Heading } from '@/components/ui/heading'

export const metadata = {
  title: 'Categories | Honeywell',
  description: 'Browse our products by category.',
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithImages()

  return (
    <div className="container mx-auto px-4 pt-20 pb-6 md:pt-24 md:pb-10">
      <Heading as="h1">Categories</Heading>
      <CategoriesClient categories={categories} />
    </div>
  )
}
