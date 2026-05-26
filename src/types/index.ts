export interface CartItem {
  id: number
  name: string
  short: string
  price: number
  size: string
  image: string | null
  qty: number
}

export interface ProductCardData {
  id: number
  name: string
  short: string | null | undefined
  slug: string
  origin: string | null | undefined
  price: number
  comparePrice: number | null | undefined
  tag: string | null | undefined
  rating: number | null | undefined
  reviewCount: number | null | undefined
  image: string | null
  sizes: string[]
}

export interface ProductDetailData {
  id: number
  name: string
  slug: string
  origin: string | null | undefined
  price: number
  comparePrice: number | null | undefined
  tag: string | null | undefined
  rating: number | null | undefined
  reviewCount: number | null | undefined
  material: string | null | undefined
  description: string
  careInstructions: string
  colors: string[]
  sizes: string[]
  images: string[]
}
