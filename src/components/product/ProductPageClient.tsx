'use client'

import React, { useState } from 'react'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import {
  ProductVariants,
  type ProductVariant,
  type VariantImage,
} from '@/components/product/ProductVariants'
import type { Media, Product } from '@/payload-types'

interface ProductPageClientProps {
  product: Product
}

export function ProductPageClient({ product }: Readonly<ProductPageClientProps>) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const hasVariants = product.variants && product.variants.length > 0

  // Get variant images for the currently selected variant
  const variantImages: VariantImage[] | null = selectedVariant?.images || null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 md:mb-16">
      {/* Gallery - Sticky on large screens */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <ProductGallery
          featuredImage={product.featuredImage as Media | null}
          gallery={product.gallery}
          productName={product.name}
          variantImages={variantImages}
          variantColor={selectedVariant?.color}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6">
        <ProductInfo product={product} />

        {/* Variants Section */}
        {hasVariants && (
          <ProductVariants
            variants={product.variants as ProductVariant[]}
            basePrice={product.basePrice}
            onVariantChange={setSelectedVariant}
          />
        )}
      </div>
    </div>
  )
}
