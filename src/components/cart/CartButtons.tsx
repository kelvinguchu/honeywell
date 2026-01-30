'use client'

import React from 'react'
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiShoppingBag } from 'react-icons/hi2'
import { useCartStore, useWishlistStore } from '@/stores/cart-store'
import { useCartHydration } from './CartProvider'
import { cn } from '@/lib/utils'
import type { Product } from '@/payload-types'

type ButtonSize = 'sm' | 'md' | 'lg'

interface AddToCartButtonProps {
  readonly product: Product
  readonly variantId?: string | null
  readonly variantColor?: string | null
  readonly variantSku?: string | null
  readonly className?: string
  readonly size?: ButtonSize
  readonly showText?: boolean
}

interface WishlistButtonProps {
  readonly product: Product
  readonly className?: string
  readonly size?: ButtonSize
}

interface QuickActionsProps {
  readonly product: Product
  readonly className?: string
  readonly size?: ButtonSize
  readonly direction?: 'row' | 'column'
}

function getProductImage(product: Product): string | null {
  if (!product.featuredImage) return null
  if (typeof product.featuredImage === 'string') return null
  return product.featuredImage.url || null
}

export function AddToCartButton({
  product,
  variantId,
  variantColor,
  variantSku,
  className,
  size = 'md',
  showText = false,
}: Readonly<AddToCartButtonProps>) {
  const isHydrated = useCartHydration()
  const addItem = useCartStore((state) => state.addItem)
  const isInCart = useCartStore((state) => state.isInCart)

  const inCart = isHydrated && isInCart(product.id, variantId)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: getProductImage(product),
      variantId,
      variantColor,
      variantSku,
      price: product.basePrice || 0,
    })
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  if (showText) {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!isHydrated}
        className={cn(
          'font-semibold py-2 px-4 rounded-none transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer disabled:opacity-50',
          inCart
            ? 'bg-primary/90 text-white hover:bg-primary'
            : 'bg-primary hover:bg-primary/90 text-white',
          className,
        )}
        aria-label={inCart ? 'Add more to cart' : 'Add to cart'}
      >
        {inCart ? (
          <HiShoppingBag className={iconSizes[size]} />
        ) : (
          <HiOutlineShoppingBag className={iconSizes[size]} />
        )}
        {inCart ? 'In Cart' : 'Add to Cart'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!isHydrated}
      className={cn(
        'flex items-center justify-center rounded-full shadow-md transition-colors cursor-pointer disabled:opacity-50',
        inCart
          ? 'bg-primary text-white hover:bg-primary/90'
          : 'bg-white text-gray-900 hover:bg-primary hover:text-white',
        sizeClasses[size],
        className,
      )}
      aria-label={inCart ? 'Add more to cart' : 'Add to cart'}
    >
      {inCart ? (
        <HiShoppingBag className={iconSizes[size]} />
      ) : (
        <HiOutlineShoppingBag className={iconSizes[size]} />
      )}
    </button>
  )
}

export function WishlistButton({ product, className, size = 'md' }: Readonly<WishlistButtonProps>) {
  const isHydrated = useCartHydration()
  const { addItem, removeItem, isInWishlist } = useWishlistStore()

  const inWishlist = isHydrated && isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        productImage: getProductImage(product),
        price: product.basePrice || 0,
      })
    }
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      disabled={!isHydrated}
      className={cn(
        'flex items-center justify-center rounded-full shadow-md transition-colors cursor-pointer disabled:opacity-50',
        inWishlist
          ? 'bg-primary text-white hover:bg-primary/90'
          : 'bg-white text-gray-900 hover:bg-primary hover:text-white',
        sizeClasses[size],
        className,
      )}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? (
        <HiHeart className={iconSizes[size]} />
      ) : (
        <HiOutlineHeart className={iconSizes[size]} />
      )}
    </button>
  )
}

export function QuickActions({
  product,
  className,
  size = 'md',
  direction = 'column',
}: Readonly<QuickActionsProps>) {
  return (
    <div
      className={cn('flex gap-2 z-20', direction === 'column' ? 'flex-col' : 'flex-row', className)}
    >
      <WishlistButton product={product} size={size} />
      <AddToCartButton product={product} size={size} />
    </div>
  )
}
