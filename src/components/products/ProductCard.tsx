import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Product } from '@/payload-types'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { QuickActions } from '@/components/cart'

interface ProductCardProps {
  product: Product
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const image =
    product.featuredImage && typeof product.featuredImage !== 'string'
      ? product.featuredImage
      : null

  return (
    <div
      className={cn(
        'group flex flex-col h-full border border-border bg-card text-card-foreground hover:shadow-lg transition-shadow duration-300',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-white group">
        <Link href={`/products/${product.slug}`} className="block w-full h-full cursor-pointer">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-contain object-center transition-transform duration-300 group-hover:scale-105 p-4"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/5 p-12">
              <Image
                src="/logo.png"
                alt="Honeywell"
                fill
                className="object-contain object-center opacity-75 grayscale sepia-[.2] p-12"
              />
            </div>
          )}
        </Link>
        {product.status === 'new' && (
          <div className="absolute left-0 top-0 bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground z-10 pointer-events-none">
            New
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute right-2 top-2">
          <QuickActions product={product} size="md" />
        </div>
      </div>

      <div className="flex flex-col grow">
        <div className="p-4 flex flex-col grow">
          <Link
            href={`/products/${product.slug}`}
            className="text-base font-bold leading-tight group-hover:text-primary decoration-2 underline-offset-2 hover:underline cursor-pointer"
          >
            {product.name}
          </Link>
          <div className="grow" />
        </div>

        <div className="mt-auto border-t border-border p-4 flex items-center justify-between gap-2">
          <span className="font-bold text-lg text-primary">
            {product.basePrice ? `Ksh ${product.basePrice.toLocaleString()}` : 'On Request'}
          </span>

          <Link
            href={`/products/${product.slug}`}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-none transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
          >
            View <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
