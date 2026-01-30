'use client'

import React, { useState, useEffect } from 'react'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'

interface VariantImage {
  image: string | number | Media
  id?: string | null
}

interface ProductVariant {
  color: string
  colorHex?: string | null
  eanCode: string
  variantPartCode?: string | null
  price?: number | null
  stock?: number | null
  available?: boolean | null
  images?: VariantImage[] | null
  id?: string | null
}

interface ProductVariantsProps {
  variants?: ProductVariant[] | null
  basePrice: number
  onVariantChange?: (variant: ProductVariant | null) => void
}

export function ProductVariants({
  variants,
  basePrice,
  onVariantChange,
}: Readonly<ProductVariantsProps>) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants?.[0] || null,
  )

  // Notify parent of initial variant
  useEffect(() => {
    onVariantChange?.(selectedVariant)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!variants || variants.length === 0) {
    return null
  }

  const handleSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    onVariantChange?.(variant)
  }

  const currentPrice = selectedVariant?.price || basePrice

  return (
    <div className="space-y-4">
      <h3 className="font-bold uppercase text-sm tracking-wider border-l-4 border-primary pl-3">
        Available Variants
      </h3>

      {/* Color Swatches */}
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.eanCode || variant.id}
            onClick={() => handleSelect(variant)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 border transition-all cursor-pointer',
              selectedVariant?.eanCode === variant.eanCode
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border hover:border-primary/50',
              !variant.available && 'opacity-50',
            )}
            disabled={!variant.available}
          >
            {/* Color Swatch */}
            {variant.colorHex && (
              <span
                className="w-5 h-5 rounded-full border border-border shrink-0"
                style={{ backgroundColor: variant.colorHex }}
              />
            )}
            <span className="text-sm font-medium">{variant.color}</span>
            {!variant.available && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Out of Stock
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Selected Variant Details */}
      {selectedVariant && (
        <div className="border border-border p-4 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Selected:</span>
            <span className="font-bold">{selectedVariant.color}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price:</span>
            <span className="font-bold text-lg text-primary">
              Ksh {currentPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Availability:</span>
            {selectedVariant.available ? (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <HiOutlineCheckCircle className="w-4 h-4" />
                In Stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                <HiOutlineXCircle className="w-4 h-4" />
                Out of Stock
              </span>
            )}
          </div>

          {selectedVariant.eanCode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">EAN Code:</span>
              <span className="font-mono text-xs">{selectedVariant.eanCode}</span>
            </div>
          )}

          {selectedVariant.variantPartCode && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Part Code:</span>
              <span className="font-mono text-xs">{selectedVariant.variantPartCode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export type { ProductVariant, VariantImage }
