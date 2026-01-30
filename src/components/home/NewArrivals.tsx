import React from 'react'
import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { getNewArrivals } from '@/lib/products'
import { ProductCard } from '@/components/products/ProductCard'
import { Heading } from '@/components/ui/heading'

export const NewArrivals = async () => {
  const productsToShow = await getNewArrivals()

  if (productsToShow.length === 0) {
    return null
  }

  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <Heading
          action={
            <Link
              href="/products?sort=-createdAt"
              className="hidden md:flex items-center gap-2 font-semibold hover:text-primary hover:underline decoration-2 underline-offset-4"
            >
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          New Arrivals
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/products?sort=-createdAt"
            className="inline-flex items-center gap-2 font-semibold hover:text-primary hover:underline decoration-2 underline-offset-4"
          >
            View All New Arrivals <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
