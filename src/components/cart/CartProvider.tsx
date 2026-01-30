'use client'

import React, { useEffect, useState } from 'react'

interface CartProviderProps {
  children: React.ReactNode
}

/**
 * CartProvider ensures cart/wishlist stores are only hydrated on the client
 * to prevent hydration mismatches with localStorage data
 */
export function CartProvider({ children }: CartProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // We still render children during SSR, but cart components
  // should check isHydrated before showing counts
  return (
    <CartHydrationContext.Provider value={isHydrated}>{children}</CartHydrationContext.Provider>
  )
}

const CartHydrationContext = React.createContext(false)

export function useCartHydration() {
  return React.useContext(CartHydrationContext)
}
