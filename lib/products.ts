export type Product = {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number
  image: string
  category: string
  collection: string
  colors: string[]
  sizes: string[]
  badge?: string
  inStock: boolean
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Chrome Shell Puffer',
    slug: 'chrome-shell-puffer',
    price: 680,
    image: '/product-jacket.png',
    category: 'Outerwear',
    collection: 'Cyber Atelier',
    colors: ['Silver', 'Pearl'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Hyperline Cargo Pant',
    slug: 'hyperline-cargo-pant',
    price: 320,
    salePrice: 240,
    image: '/product-pants.png',
    category: 'Bottoms',
    collection: 'Cyber Atelier',
    colors: ['White', 'Bone'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'Sale',
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Holo Crop Tee',
    slug: 'holo-crop-tee',
    price: 180,
    image: '/product-top.png',
    category: 'Tops',
    collection: 'Mirror Drop',
    colors: ['Iridescent'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: 'Trending',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Liquid Chrome Mini Bag',
    slug: 'liquid-chrome-mini-bag',
    price: 420,
    image: '/product-bag.png',
    category: 'Accessories',
    collection: 'Mirror Drop',
    colors: ['Silver'],
    sizes: ['OS'],
    badge: 'Limited',
    inStock: false,
  },
]

export const reviews = [
  {
    name: 'Aria Vance',
    handle: '@ariavance',
    quote:
      'It does not feel like clothing. It feels like wearing the future. The chrome puffer is unreal in person.',
  },
  {
    name: 'Kenji Mori',
    handle: '@kenji.mori',
    quote:
      'Renaissance is the only brand making Y2K feel genuinely luxurious instead of costume. Obsessed.',
  },
  {
    name: 'Sloane Reyes',
    handle: '@sloanereyes',
    quote:
      'Every drop sells out for a reason. The detailing and quality are on another level entirely.',
  },
]
