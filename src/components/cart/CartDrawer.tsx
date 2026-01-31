'use client'

import React from 'react'
import Link from 'next/link'
import {
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlineMinus,
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
import { useCartStore } from '@/stores/cart-store'
import { useCartHydration } from './CartProvider'

export function CartDrawer() {
  const isHydrated = useCartHydration()
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore()

  const total = isHydrated ? getTotal() : 0
  const itemCount = isHydrated ? items.length : 0

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="min-w-[95vw] md:min-w-[40vw] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-tight">
              <HiOutlineShoppingBag className="h-5 w-5" />
              Your Cart
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
                aria-label="Close cart"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!isHydrated || itemCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <HiOutlineShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Add items to your cart to see them here
              </p>
              <SheetClose asChild>
                <Button asChild className="rounded-none">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId || 'default'}`} className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="relative w-20 h-20 shrink-0 bg-muted border border-border"
                      onClick={closeCart}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="absolute inset-0 w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src="/logo.png"
                            alt="Honeywell"
                            className="w-[40px] h-[20px] object-contain opacity-20 grayscale"
                          />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={closeCart}
                        className="font-medium text-sm leading-tight hover:text-primary line-clamp-2"
                      >
                        {item.productName}
                      </Link>

                      {item.variantColor && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Color: {item.variantColor}
                        </p>
                      )}

                      <p className="font-bold text-primary mt-1">
                        Ksh {item.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.variantId)
                            }
                            className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <HiOutlineMinus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.variantId)
                            }
                            className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <HiOutlinePlus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <HiOutlineTrash className="h-5 w-5" />
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
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">Ksh {total.toLocaleString()}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="w-full rounded-none h-12 text-sm font-bold uppercase tracking-wide"
                  disabled
                >
                  Checkout
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-none h-12 text-sm"
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/products">Shop More</Link>
                  </Button>
                </SheetClose>
              </div>

              {/* Clear Cart */}
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors underline"
              >
                Clear Cart
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
