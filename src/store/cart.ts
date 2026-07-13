import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface AppliedCoupon {
  code: string
  type: string
  value: number
  discountAmount: number
}

interface CartStore {
  items: CartItem[]
  coupon: AppliedCoupon | null
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQty: (id: number, size: string, color: string, qty: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
  discount: () => number
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === incoming.id && i.size === incoming.size && i.color === incoming.color,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === incoming.id && i.size === incoming.size && i.color === incoming.color
                  ? { ...i, qty: i.qty + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...incoming, qty: 1 }] }
        })
      },

      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size && i.color === color)),
        }))
      },

      updateQty: (id, size, color, qty) => {
        if (qty <= 0) {
          get().removeItem(id, size, color)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size && i.color === color ? { ...i, qty } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [], coupon: null }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      discount: () => get().coupon?.discountAmount ?? 0,

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    { name: 'rebozos-cart' },
  ),
)
