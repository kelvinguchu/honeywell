'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { QuickActions } from '@/components/cart'
import type { Product } from '@/payload-types'

interface HeroProductCardProps {
  readonly product: Product
  readonly featured?: boolean
}

export function HeroProductCard({ product, featured = false }: HeroProductCardProps) {
  const image =
    product.featuredImage && typeof product.featuredImage !== 'string'
      ? product.featuredImage
      : null

  if (featured) {
    return (
      <div className="relative group bg-primary/5 border-2 border-primary lg:border lg:border-border lg:hover:border-primary lg:bg-card transition-colors duration-300 overflow-hidden">
        {/* Featured Badge */}
        <div className="absolute top-0 left-0 lg:left-auto lg:right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase z-10">
          Featured
        </div>

        {/* Action Buttons */}
        <QuickActions
          product={product}
          size="md"
          className="absolute right-3 top-1/2 -translate-y-1/2 lg:top-12 lg:right-4 lg:translate-y-0"
        />

        <Link
          href={`/products/${product.slug}`}
          className="flex flex-row lg:flex-col items-center lg:items-stretch p-4 pr-16 lg:p-8 lg:h-full gap-4 lg:gap-0"
        >
          {/* Mobile: Small left image, Desktop: Large top image */}
          <div className="relative w-24 h-24 lg:w-full lg:flex-1 lg:aspect-square shrink-0 lg:mb-6 bg-white lg:bg-transparent border border-border lg:border-0">
            {image?.url ? (
              <Image
                src={image.url}
                alt={image.alt || product.name}
                fill
                className="object-contain p-2 lg:p-4 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/5">
                <Image
                  src="/logo.png"
                  alt="Honeywell"
                  width={100}
                  height={30}
                  className="opacity-20 grayscale"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 lg:flex-none min-w-0">
            <h3 className="text-base lg:text-2xl font-bold uppercase leading-tight mb-1 lg:mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="text-base lg:text-lg font-bold text-primary mb-1 lg:mb-4">
              {product.basePrice ? (
                `Ksh ${product.basePrice.toLocaleString()}`
              ) : (
                <span className="text-sm text-muted-foreground">On Request</span>
              )}
            </div>
            <span className="hidden lg:inline-flex items-center text-sm font-bold border-b-2 border-primary pb-0.5">
              View Product <HiOutlineArrowRight className="ml-2 w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative group bg-card border border-border hover:border-primary transition-colors duration-300 overflow-hidden">
      {/* Action Buttons */}
      <QuickActions
        product={product}
        size="sm"
        className="absolute right-3 top-1/2 -translate-y-1/2 lg:top-1/2"
      />

      <Link
        href={`/products/${product.slug}`}
        className="flex flex-row items-center gap-3 p-3 pr-16 lg:pr-14 w-full"
      >
        {/* Image */}
        <div className="relative w-16 h-16 shrink-0 bg-white border border-border">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/5">
              <Image
                src="/logo.png"
                alt="Honeywell"
                width={30}
                height={10}
                className="opacity-20 grayscale"
              />
            </div>
          )}
        </div>
        {/* Text */}
        <div className="min-w-0 flex flex-col justify-center flex-1">
          <h4 className="font-bold uppercase text-xs mb-1 group-hover:text-primary line-clamp-2 leading-tight">
            {product.name}
          </h4>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {product.basePrice ? `Ksh ${product.basePrice.toLocaleString()}` : 'View'}
          </span>
        </div>
      </Link>
    </div>
  )
}
