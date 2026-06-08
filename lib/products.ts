import { getPublishedProducts, getProductBySlug as dbGetProductBySlug } from './local-db'

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

/**
 * Map a database Product to the site Product type.
 * Reads from localStorage so products created in the admin appear on the site.
 */
function mapToSiteProduct(p: ReturnType<typeof getPublishedProducts>[number]): Product {
  const badgeMap: Record<string, string> = {
    new: 'New',
    sale: 'Sale',
    trending: 'Trending',
    limited: 'Limited',
  }

  const firstTag = p.tags?.[0]?.toLowerCase() || ''
  const badge = badgeMap[firstTag] || (p.tags?.includes('new') ? 'New' : undefined)

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    image: p.thumbnail || p.images?.[0] || '/placeholder.svg',
    category: p.category || '',
    collection: typeof p.collection === 'string' ? p.collection : '',
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge,
    inStock: p.stockQuantity > 0,
  }
}

/**
 * Get all published products for the storefront.
 * Sources from localStorage via local-db so admin-created products appear here.
 */
export function getSiteProducts(): Product[] {
  try {
    const dbProducts = getPublishedProducts()
    return dbProducts.map(mapToSiteProduct)
  } catch {
    return []
  }
}

/**
 * Get a single product by slug for the product detail page.
 */
export function getSiteProductBySlug(slug: string): Product | undefined {
  try {
    const dbProduct = dbGetProductBySlug(slug)
    if (!dbProduct || dbProduct.status !== 'published') return undefined
    return mapToSiteProduct(dbProduct)
  } catch {
    return undefined
  }
}

// Static fallback for SSR / build time (server component usage)
// Client components should call getSiteProducts() instead
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
