export interface Variant {
  colorName: string
  colorHex: string | null
  images: string[]
  sizes: { label: string; price: number; stock: number }[]
}

export interface CartItem {
  id: number
  name: string
  short: string
  price: number
  color: string
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
  color: string
  sizes: string[]
  stock: number
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
  variants: Variant[]
}
