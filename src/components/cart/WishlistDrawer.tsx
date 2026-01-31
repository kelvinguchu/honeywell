'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  HiOutlineXMark,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineTrash,
} from 'react-icons/hi2'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useWishlistStore, useCartStore } from '@/stores/cart-store'
import { useCartHydration } from './CartProvider'

export function WishlistDrawer() {
  const isHydrated = useCartHydration()
  const { items, isOpen, closeWishlist, removeItem, moveToCart, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state) => state.addItem)

  const itemCount = isHydrated ? items.length : 0

  const handleMoveToCart = (productId: string) => {
    moveToCart(productId, addToCart)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeWishlist()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="min-w-[95vw] md:min-w-[40vw] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
              <HiOutlineHeart className="h-5 w-5" />
              Wishlist
              {isHydrated && itemCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label="Close wishlist"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!isHydrated || itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <HiOutlineHeart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Your wishlist is empty
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Save items you love to your wishlist
              </p>
              <SheetClose asChild>
                <Button asChild className="rounded-none">
                  <Link href="/products">Explore Products</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.productId} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="relative w-20 h-20 shrink-0 bg-muted border border-border"
                      onClick={closeWishlist}
                    >
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            src="/logo.png"
                            alt="Honeywell"
                            width={40}
                            height={20}
                            className="opacity-20 grayscale"
                          />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeWishlist}
                        className="font-medium text-sm leading-tight hover:text-primary line-clamp-2"
                      >
                        {item.productName}
                      </Link>

                      <p className="font-bold text-primary mt-1">
                        {item.price > 0 ? `Ksh ${item.price.toLocaleString()}` : 'On Request'}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          className="rounded-none h-8 text-xs gap-1"
                          onClick={() => handleMoveToCart(item.productId)}
                        >
                          <HiOutlineShoppingBag className="h-3 w-3" />
                          Add to Cart
                        </Button>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove from wishlist"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isHydrated && itemCount > 0 && (
          <SheetFooter className="border-t border-border p-4 block">
            <div className="space-y-3">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-none h-10"
                  onClick={closeWishlist}
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>

              <button
                type="button"
                onClick={clearWishlist}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors underline"
              >
                Clear Wishlist
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
