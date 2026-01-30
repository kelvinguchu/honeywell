'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

interface ProductsPaginationProps {
  totalPages: number
  currentPage: number
  category?: string
  sort?: string
  basePath?: string
}

export function ProductsPagination({
  totalPages,
  currentPage,
  basePath = '/products',
}: Readonly<ProductsPaginationProps>) {
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  // Build URL preserving all current params
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (pageNum === 1) {
      params.delete('page')
    } else {
      params.set('page', pageNum.toString())
    }
    const queryString = params.toString()
    return queryString ? `${basePath}?${queryString}` : basePath
  }

  // Calculate page range to show
  const getPageRange = () => {
    const delta = 2 // Pages to show on each side of current
    const range: (number | 'ellipsis')[] = []
    const rangeWithDots: (number | 'ellipsis')[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    let prev = 0
    for (const i of range) {
      if (typeof i === 'number') {
        if (prev && i - prev > 1) {
          rangeWithDots.push('ellipsis')
        }
        rangeWithDots.push(i)
        prev = i
      }
    }

    return rangeWithDots
  }

  const pages = getPageRange()

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous button */}
      <Link
        href={currentPage > 1 ? buildPageUrl(currentPage - 1) : '#'}
        className={`inline-flex h-10 w-10 items-center justify-center border text-sm transition-colors ${
          currentPage === 1
            ? 'pointer-events-none opacity-50 bg-muted border-border'
            : 'bg-background hover:bg-muted border-border cursor-pointer'
        }`}
        aria-disabled={currentPage === 1}
      >
        <HiChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous page</span>
      </Link>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-before-${pages[index + 1] || 'end'}`}
              className="inline-flex h-10 w-10 items-center justify-center text-muted-foreground"
            >
              …
            </span>
          )
        }

        const isCurrent = page === currentPage

        return (
          <Link
            key={`page-${page}`}
            href={buildPageUrl(page)}
            className={`inline-flex h-10 w-10 items-center justify-center border text-sm font-bold transition-colors cursor-pointer ${
              isCurrent
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted border-border'
            }`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      })}

      {/* Next button */}
      <Link
        href={currentPage < totalPages ? buildPageUrl(currentPage + 1) : '#'}
        className={`inline-flex h-10 w-10 items-center justify-center border text-sm transition-colors ${
          currentPage === totalPages
            ? 'pointer-events-none opacity-50 bg-muted border-border'
            : 'bg-background hover:bg-muted border-border cursor-pointer'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <HiChevronRight className="h-5 w-5" />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  )
}
