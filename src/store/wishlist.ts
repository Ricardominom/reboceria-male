import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: number
  name: string
  slug: string
  image: string | null
  price: number
}

interface WishlistStore {
  items: WishlistItem[]
  toggle: (item: WishlistItem) => void
  remove: (id: number) => void
  isInWishlist: (id: number) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id)
        set({
          items: exists ? get().items.filter((i) => i.id !== item.id) : [...get().items, item],
        })
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'rm-wishlist' },
  ),
)
