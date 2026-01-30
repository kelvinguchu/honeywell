import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  productImage: string | null
  variantId?: string | null
  variantColor?: string | null
  variantSku?: string | null
  price: number
  quantity: number
}

export interface WishlistItem {
  productId: string
  productName: string
  productSlug: string
  productImage: string | null
  price: number
  addedAt: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string, variantId?: string | null) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  getItemCount: () => number
  getTotal: () => number
  getItem: (productId: string, variantId?: string | null) => CartItem | undefined
  isInCart: (productId: string, variantId?: string | null) => boolean
}

interface WishlistState {
  items: WishlistItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
  moveToCart: (productId: string, addToCart: CartState['addItem']) => void

  // Computed
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId,
          )

          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            }
            return { items: newItems, isOpen: true }
          }

          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId),
          ),
        }))
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getItem: (productId, variantId) => {
        return get().items.find(
          (item) => item.productId === productId && item.variantId === variantId,
        )
      },

      isInCart: (productId, variantId) => {
        return get().items.some(
          (item) => item.productId === productId && item.variantId === variantId,
        )
      },
    }),
    {
      name: 'honeywell-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
    },
  ),
)

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state // Already in wishlist
          }
          return {
            items: [...state.items, { ...item, addedAt: Date.now() }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      clearWishlist: () => set({ items: [] }),

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),

      moveToCart: (productId, addToCart) => {
        const item = get().items.find((i) => i.productId === productId)
        if (item) {
          addToCart({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            productImage: item.productImage,
            price: item.price,
          })
          get().removeItem(productId)
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId)
      },

      getItemCount: () => get().items.length,
    }),
    {
      name: 'honeywell-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
