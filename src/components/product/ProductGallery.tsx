'use client'

import React, { useState, useEffect } from 'react'
import type { Media, Product } from '@/payload-types'
import { cn } from '@/lib/utils'

interface VariantImage {
  image: string | number | Media
  id?: string | null
}

interface ProductGalleryProps {
  featuredImage?: number | Media | null
  gallery?: Product['gallery']
  productName: string
  variantImages?: VariantImage[] | null
  variantColor?: string
}

export function ProductGallery({
  featuredImage,
  gallery,
  productName,
  variantImages,
  variantColor,
}: Readonly<ProductGalleryProps>) {
  const [selectedImage, setSelectedImage] = useState<number | Media | null>(featuredImage || null)

  // Product gallery images
  const productImages = [
    featuredImage,
    ...(gallery?.map((item) => item.image).filter(Boolean) || []),
  ].filter((img): img is Media => !!img && typeof img !== 'number')

  // Remove duplicates based on ID
  const uniqueProductImages = productImages.filter(
    (img, index, self) => index === self.findIndex((t) => t.id === img.id),
  )

  // Extract variant images as Media
  const variantMediaImages: Media[] =
    variantImages
      ?.map((img) => img.image)
      .filter((img): img is Media => !!img && typeof img !== 'number' && typeof img !== 'string') ||
    []

  // Reset to featured image when variant changes
  useEffect(() => {
    setSelectedImage(featuredImage || null)
  }, [featuredImage, variantColor])

  const handleImageClick = (image: Media) => {
    setSelectedImage(image)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Stage Image */}
      <div className="aspect-square relative overflow-hidden bg-muted border border-border">
        {selectedImage && typeof selectedImage !== 'number' && selectedImage.url && (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt || productName}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
        )}
        {(!selectedImage || typeof selectedImage === 'number' || !selectedImage.url) && (
          <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground">
            <span className="text-4xl font-bold uppercase">No Image</span>
          </div>
        )}
      </div>

      {/* Product Gallery Thumbnails */}
      {uniqueProductImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {uniqueProductImages.map((image, i) => (
            <button
              key={image.id || i}
              onClick={() => handleImageClick(image)}
              className={cn(
                'relative shrink-0 w-20 h-20 border cursor-pointer hover:opacity-100 transition-all',
                (selectedImage as Media)?.id === image.id
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border opacity-70 hover:border-primary/50',
              )}
            >
              <img
                src={image.url || ''}
                alt={image.alt || `${productName} view ${i + 1}`}
                className="absolute inset-0 w-full h-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}

      {/* Variant Images Section */}
      {variantMediaImages.length > 0 && (
        <div className="border-t border-border pt-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
            {variantColor ? `${variantColor} Variant Images` : 'Variant Images'}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {variantMediaImages.map((image, i) => (
              <button
                key={image.id || i}
                onClick={() => handleImageClick(image)}
                className={cn(
                  'relative shrink-0 w-20 h-20 border cursor-pointer hover:opacity-100 transition-all bg-white',
                  (selectedImage as Media)?.id === image.id
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-border opacity-70 hover:border-primary/50',
                )}
              >
                <img
                  src={image.url || ''}
                  alt={`${variantColor || 'Variant'} view ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
