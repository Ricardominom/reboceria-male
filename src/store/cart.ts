import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQty: (id: number, size: string, color: string, qty: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

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

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'rebozos-cart',
    },
  ),
)
