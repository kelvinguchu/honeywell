'use client'

import React from 'react'
import { HiOutlineShoppingBag, HiOutlineHeart } from 'react-icons/hi2'
import { useCartStore, useWishlistStore } from '@/stores/cart-store'
import { useCartHydration } from './CartProvider'
import { cn } from '@/lib/utils'

interface CartIconButtonProps {
  readonly className?: string
}

interface WishlistIconButtonProps {
  readonly className?: string
}

export function CartIconButton({ className }: CartIconButtonProps) {
  const isHydrated = useCartHydration()
  const { openCart, getItemCount } = useCartStore()
  const count = isHydrated ? getItemCount() : 0
  const ariaLabel = count > 0 ? `Cart (${count} items)` : 'Cart'

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer',
        className,
      )}
    >
      <HiOutlineShoppingBag className="h-6 w-6" />
      {isHydrated && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}

export function WishlistIconButton({ className }: WishlistIconButtonProps) {
  const isHydrated = useCartHydration()
  const { openWishlist, getItemCount } = useWishlistStore()
  const count = isHydrated ? getItemCount() : 0
  const ariaLabel = count > 0 ? `Wishlist (${count} items)` : 'Wishlist'

  return (
    <button
      type="button"
      onClick={openWishlist}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer',
        className,
      )}
    >
      <HiOutlineHeart className="h-6 w-6" />
      {isHydrated && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
