import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { getNewArrivals } from '@/lib/products'
import { HeroProductCard } from './HeroProductCard'

export async function Hero() {
  const products = await getNewArrivals(5)
  const heroProducts = products.slice(0, 5)

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -skew-x-12 translate-x-1/4 hidden lg:block" />

      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 min-h-auto lg:min-h-162.5 items-center pt-24 pb-6 md:pt-28 md:pb-10 lg:py-0">
          {/* Hero Text Section */}
          <div className="flex flex-col items-start justify-center relative z-20 lg:col-span-5 pr-0 lg:pr-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.9] mb-6 lg:mb-10">
              Connect. <br />
              <span className="text-primary">Power.</span> <br />
              Play.
            </h1>

            <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed mb-8 lg:mb-10 border-l-4 border-border pl-4 md:pl-6">
              Your destination for premium Honeywell Audio, Power Solutions, and Accessories.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-none h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold tracking-wide uppercase"
                asChild
              >
                <Link href="/products">Shop All</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-none h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold tracking-wide uppercase border-2 hover:bg-muted"
                asChild
              >
                <Link href="/categories">
                  Category <HiOutlineArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:col-span-7 gap-3 lg:gap-4 w-full h-full lg:pt-20 lg:pb-12 mt-4 lg:mt-0">
            {/* Featured Product Card */}
            {heroProducts[0] && <HeroProductCard product={heroProducts[0]} featured />}

            {/* Secondary Products */}
            <div className="flex flex-col lg:grid lg:grid-cols-1 lg:grid-rows-4 gap-3 lg:gap-4">
              {heroProducts.slice(1).map((product) => (
                <HeroProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
