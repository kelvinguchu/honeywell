import React from 'react'
import './styles.css'
import { Montserrat } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getNewArrivals } from '@/lib/products'
import { getCategoriesWithImages } from '@/lib/category-showcase'
import { getSeriesWithProducts } from '@/lib/series'
import { CartProvider, CartDrawer, WishlistDrawer } from '@/components/cart'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  description: 'The modern electronics home',
  title: 'Honeywell',
  icons: {
    icon: '/favicon.png',
  }
}

export default async function RootLayout(props: { readonly children: React.ReactNode }) {
  const { children } = props

  const [categories, series, featuredProducts] = await Promise.all([
    getCategoriesWithImages(),
    getSeriesWithProducts(),
    getNewArrivals(3),
  ])

  const headerData = {
    categories,
    series,
    featuredProducts,
  }

  const footerData = {
    categories,
    series,
  }

  return (
    <html lang="en">
      <body className={`flex min-h-screen flex-col ${montserrat.className}`}>
        <CartProvider>
          <Header data={headerData} />
          <main className="flex-1">{children}</main>
          <Footer data={footerData} />
          <CartDrawer />
          <WishlistDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
