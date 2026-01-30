import React from 'react'
import { Heading } from '@/components/ui/heading'

interface ProductsHeaderProps {
  category?: string
  series?: string
  search?: string
}

export function ProductsHeader({ category, series, search }: Readonly<ProductsHeaderProps>) {
  let title = 'All Products'

  if (search) {
    title = `Search: "${search}"`
  } else if (category && series) {
    title = `${formatSlug(category)} - ${formatSlug(series)}`
  } else if (category) {
    title = formatSlug(category)
  } else if (series) {
    title = `${formatSlug(series)} Series`
  }

  return <Heading as="h1">{title}</Heading>
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
