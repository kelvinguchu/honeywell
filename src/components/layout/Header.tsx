'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HiBars3, HiChevronRight, HiArrowRight, HiXMark, HiChevronDown } from 'react-icons/hi2'
import Logo from '../admin/Logo'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Product, Media } from '@/payload-types'
import type { CategoryWithImage } from '@/lib/category-showcase'
import type { SeriesWithProducts } from '@/lib/series'
import { CartIconButton, WishlistIconButton } from '@/components/cart'
import { SearchDialog } from '@/components/search'

interface HeaderProps {
  readonly data?: {
    categories: CategoryWithImage[]
    series: SeriesWithProducts[]
    featuredProducts: Product[]
  }
}

export function Header({ data }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const headerClass =
    'bg-background/80 backdrop-blur-md border-border/5 supports-backdrop-filter:bg-background/60 shadow-sm'

  const getImageUrl = (image: string | Media | null | undefined) => {
    if (!image) return '/logo.png'
    if (typeof image === 'string') return image
    return image.url || '/logo.png'
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${headerClass}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-3 md:px-6">
        <Link href="/" className="flex items-center cursor-pointer">
          <Logo className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent text-foreground hover:bg-transparent hover:text-primary cursor-pointer',
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground hover:bg-transparent hover:text-primary cursor-pointer">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-150 p-6 bg-card border border-border shadow-none rounded-none">
                    <div className="flex items-end justify-between mb-6 pb-2 border-b border-border">
                      <div className="border-l-4 border-primary pl-3">
                        <h4 className="text-xl font-black uppercase tracking-tighter leading-none">
                          New Arrivals
                        </h4>
                      </div>
                      <Link
                        href="/products"
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        VIEW ALL <HiArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {data?.featuredProducts?.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="group block cursor-pointer"
                        >
                          <div className="relative aspect-square overflow-hidden bg-muted mb-2 rounded-none">
                            <Image
                              src={getImageUrl(product.featuredImage)}
                              alt={product.name}
                              fill
                              className="object-contain p-2 transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div className="text-sm font-medium leading-tight group-hover:text-primary line-clamp-2">
                            {product.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground hover:bg-transparent hover:text-primary cursor-pointer">
                  Categories
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-200 p-6 bg-card border border-border  shadow-none rounded-none">
                    <div className="flex items-end justify-between mb-6 pb-2 border-b border-border">
                      <div className="border-l-4 border-primary pl-3">
                        <h4 className="text-xl font-black uppercase tracking-tighter leading-none">
                          Shop by Category
                        </h4>
                      </div>
                      <Link
                        href="/categories"
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        VIEW ALL <HiArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {data?.categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          className="group flex flex-col items-center text-center p-2 rounded-none hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full bg-muted">
                            <Image
                              src={getImageUrl(cat.displayImage)}
                              alt={cat.name}
                              fill
                              className={`object-contain p-2 ${
                                cat.displayImage ? '' : 'opacity-20 grayscale sepia'
                              }`}
                            />
                          </div>
                          <span className="text-sm font-medium group-hover:text-primary">
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground hover:bg-transparent hover:text-primary cursor-pointer">
                  Series
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-200 p-6 bg-card border border-border shadow-none rounded-none">
                    <div className="grid grid-cols-3 gap-8">
                      {data?.series?.map((item) => (
                        <div key={item.series.id} className="space-y-4">
                          <h5 className="font-bold text-base text-primary border-b border-border pb-2">
                            <Link
                              href={`/series/${item.series.slug}`}
                              className="hover:underline cursor-pointer"
                            >
                              {item.series.name}
                            </Link>
                          </h5>
                          <ul className="space-y-2">
                            {item.products.map((prod) => (
                              <li key={prod.id}>
                                <Link
                                  href={`/products/${prod.slug}`}
                                  className="text-sm text-muted-foreground hover:text-foreground hover:underline block truncate cursor-pointer"
                                >
                                  {prod.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={`/series/${item.series.slug}`}
                            className="text-xs font-bold text-primary uppercase tracking-wide hover:underline inline-flex items-center mt-2 cursor-pointer"
                          >
                            Shop {item.series.name} <HiChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-1">
          <SearchDialog />
          <WishlistIconButton />
          <CartIconButton />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer md:hidden"
                aria-label="Menu"
              >
                <HiBars3 className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              showCloseButton={false}
              className="w-full sm:max-w-sm p-0 gap-0"
            >
              {/* Mobile Menu Header */}
              <SheetHeader className="p-3 border-b border-border flex-row items-center justify-between space-y-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Logo className="h-8 w-auto" />
                <SheetClose asChild>
                  <button
                    type="button"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                    aria-label="Close menu"
                  >
                    <HiXMark className="h-5 w-5" />
                  </button>
                </SheetClose>
              </SheetHeader>

              {/* Mobile Menu Content */}
              <nav className="flex-1 overflow-y-auto">
                {/* Home Link */}
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-4 py-3 text-base font-semibold border-b border-border hover:bg-muted/50 transition-colors"
                >
                  Home
                </Link>

                {/* Products Accordion */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    Products
                    <HiChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-muted/30">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          New Arrivals
                        </span>
                        <Link
                          href="/products"
                          onClick={closeMobileMenu}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          View All <HiArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {data?.featuredProducts?.slice(0, 6).map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={closeMobileMenu}
                            className="group block"
                          >
                            <div className="relative aspect-square overflow-hidden bg-white border border-border mb-1">
                              <Image
                                src={getImageUrl(product.featuredImage)}
                                alt={product.name}
                                fill
                                className="object-contain p-1 transition-transform group-hover:scale-105"
                              />
                            </div>
                            <div className="text-[10px] font-medium leading-tight group-hover:text-primary line-clamp-2">
                              {product.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Categories Accordion */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    Categories
                    <HiChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-muted/30">
                    <div className="py-2 border-b border-border">
                      {data?.categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
                        >
                          <div className="relative w-8 h-8 overflow-hidden rounded-full bg-white border border-border shrink-0">
                            <Image
                              src={getImageUrl(cat.displayImage)}
                              alt={cat.name}
                              fill
                              className={`object-contain p-1 ${
                                cat.displayImage ? '' : 'opacity-20 grayscale sepia'
                              }`}
                            />
                          </div>
                          <span className="text-sm font-medium">{cat.name}</span>
                          <HiChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                        </Link>
                      ))}
                      <Link
                        href="/categories"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:underline"
                      >
                        View All Categories <HiArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Series Accordion */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-base font-semibold border-b border-border hover:bg-muted/50 transition-colors cursor-pointer">
                    Series
                    <HiChevronDown className="h-4 w-4 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-muted/30">
                    <div className="py-2 border-b border-border">
                      {data?.series?.map((item) => (
                        <div key={item.series.id} className="px-4 py-2">
                          <Link
                            href={`/series/${item.series.slug}`}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between text-sm font-bold text-primary hover:underline mb-2"
                          >
                            {item.series.name}
                            <HiChevronRight className="h-4 w-4" />
                          </Link>
                          <div className="space-y-1 pl-2 border-l-2 border-border">
                            {item.products.slice(0, 3).map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.slug}`}
                                onClick={closeMobileMenu}
                                className="block text-xs text-muted-foreground hover:text-foreground truncate py-0.5"
                              >
                                {prod.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
