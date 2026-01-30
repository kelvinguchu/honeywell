import React from 'react'
import Link from 'next/link'
import Logo from '../admin/Logo'
import type { CategoryWithImage } from '@/lib/category-showcase'
import type { SeriesWithProducts } from '@/lib/series'

interface FooterProps {
  readonly data?: {
    categories: CategoryWithImage[]
    series: SeriesWithProducts[]
  }
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="space-y-6">
            <Link href="/" className="block">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Engineered for excellence. Experience our premium collection of audio, power, and
              connectivity solutions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {data?.categories?.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categories/${cat.slug}`} className="hover:text-primary">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className="hover:text-primary font-medium">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Series</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {data?.series?.map((item) => (
                <li key={item.series.id}>
                  <Link href={`/series/${item.series.slug}`} className="hover:text-primary">
                    {item.series.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/series" className="hover:text-primary font-medium">
                  All Series
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Honeywell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
