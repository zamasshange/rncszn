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

type DbProduct = Awaited<ReturnType<typeof getPublishedProducts>>[number]

/**
 * Map a database Product to the site Product type.
 */
function mapToSiteProduct(p: DbProduct): Product {
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
 * Returns a Promise since it may fetch from Supabase.
 * Falls back to the static catalog if the DB is empty / unreachable.
 */
export async function getSiteProducts(): Promise<Product[]> {
  try {
    const dbProducts = await getPublishedProducts()
    if (dbProducts.length > 0) {
      return dbProducts.map(mapToSiteProduct)
    }
  } catch {
    // ignore and fall through
  }
  return products
}

/**
 * Get a single product by slug for the product detail page.
 */
export async function getSiteProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const dbProduct = await dbGetProductBySlug(slug)
    if (dbProduct && dbProduct.status === 'published') {
      return mapToSiteProduct(dbProduct)
    }
  } catch {
    // ignore and fall through
  }
  return products.find((p) => p.slug === slug)
}

// Static fallback for SSR / build time (server component usage)
// Client components should call getSiteProducts() instead
export const products: Product[] = [
  {
    id: 'p1',
    name: "Make SA Great Again Tee",
    slug: "make-sa-great-again-tee",
    price: 350,
    image: "/products/make-sa-great-again-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p2',
    name: "Girls First Tee",
    slug: "girls-first-tee",
    price: 350,
    image: "/products/girls-first-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p3',
    name: "Renaissance Landscape Tee",
    slug: "renaissance-landscape-tee",
    price: 350,
    image: "/products/renaissance-landscape-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p4',
    name: "No Hoes Allowed Tee",
    slug: "no-hoes-allowed-tee",
    price: 350,
    image: "/products/no-hoes-allowed-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p5',
    name: "Renaissance L.N.D Winter Tee",
    slug: "renaissance-lnd-winter-tee",
    price: 350,
    image: "/products/renaissance-lnd-winter-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p6',
    name: "You've Just Seen A... Tee",
    slug: "pornstar-tee",
    price: 350,
    image: "/products/pornstar-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p7',
    name: "I Love A$$ Tee",
    slug: "i-love-ass-tee",
    price: 350,
    image: "/products/i-love-ass-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p8',
    name: "HOR NY Tee",
    slug: "horny-ny-tee",
    price: 350,
    image: "/products/horny-ny-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p9',
    name: "I Want To Get High Tee",
    slug: "high-sex-tee",
    price: 350,
    image: "/products/high-sex-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p10',
    name: "Pan-African Logo Tee",
    slug: "pan-african-logo-tee",
    price: 350,
    image: "/products/pan-african-logo-tee.png",
    category: "Tops",
    collection: "Renaissance Tees",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p11',
    name: "Stars & Flame Hoodie",
    slug: "renaissance-stars-flame-hoodie",
    price: 720,
    image: "/products/renaissance-stars-flame-hoodie.png",
    category: "Outerwear",
    collection: "Heavyweight",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p12',
    name: "BDG Public Enemy Tee",
    slug: "bdg-public-enemy-tee",
    price: 380,
    image: "/products/bdg-public-enemy-tee.png",
    category: "Tops",
    collection: "Billion Dollar Gang",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p13',
    name: "BDG Crayon Tee",
    slug: "bdg-crayon-tee",
    price: 400,
    image: "/products/bdg-crayon-tee.png",
    category: "Tops",
    collection: "Billion Dollar Gang",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p14',
    name: "BDG Pixel Green Tee",
    slug: "bdg-pixel-green-tee",
    price: 350,
    image: "/products/bdg-pixel-green-tee.png",
    category: "Tops",
    collection: "Billion Dollar Gang",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p15',
    name: "No Hoes Allowed Baby Tee",
    slug: "no-hoes-baby-tee",
    price: 320,
    image: "/products/no-hoes-baby-tee.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p16',
    name: "Money Makes Me Tank",
    slug: "money-makes-me-tank",
    price: 280,
    image: "/products/money-makes-me-tank.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p17',
    name: "HOR NY Baby Tee",
    slug: "horny-ny-baby-tee",
    price: 320,
    image: "/products/horny-ny-baby-tee.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p18',
    name: "NAKED Distressed Tank",
    slug: "naked-distressed-tank",
    price: 300,
    image: "/products/naked-distressed-tank.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p19',
    name: "SEX. Distressed Tank",
    slug: "sex-distressed-tank",
    price: 300,
    image: "/products/sex-distressed-tank.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p20',
    name: "EBONY Baby Tee",
    slug: "ebony-baby-tee",
    price: 300,
    image: "/products/ebony-baby-tee.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p21',
    name: "EBONY Denim Mini",
    slug: "ebony-denim-mini",
    price: 420,
    image: "/products/ebony-denim-mini.png",
    category: "Bottoms",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p22',
    name: "Camo Stars Shorts",
    slug: "camo-stars-shorts",
    price: 450,
    image: "/products/camo-stars-shorts.png",
    category: "Bottoms",
    collection: "Bottoms Archive",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p23',
    name: "Renaissance Logo Shorts",
    slug: "logo-denim-shorts",
    price: 420,
    image: "/products/logo-denim-shorts.png",
    category: "Bottoms",
    collection: "Bottoms Archive",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p24',
    name: "HOR NY Sweats",
    slug: "horny-ny-sweats",
    price: 520,
    image: "/products/horny-ny-sweats.png",
    category: "Bottoms",
    collection: "Bottoms Archive",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p25',
    name: "Camo Graffiti Cap",
    slug: "camo-graffiti-cap",
    price: 280,
    image: "/products/camo-graffiti-cap.png",
    category: "Accessories",
    collection: "Accessories",
    colors: ['Default'],
    sizes: ['OS'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p26',
    name: "EBONY Block Tee",
    slug: "ebony-block-tee",
    price: 300,
    image: "/products/ebony-block-tee.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
  },
  {
    id: 'p27',
    name: "EBONY NY Tee",
    slug: "ebony-ny-tee",
    price: 320,
    image: "/products/ebony-ny-tee.png",
    category: "Tops",
    collection: "Girls Drop",
    colors: ['Default'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    badge: undefined,
    inStock: true,
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
