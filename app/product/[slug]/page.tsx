'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { ProductCard } from '@/components/product-card'
import { getSiteProductBySlug, getSiteProducts, type Product } from '@/lib/products'
import { Magnetic } from '@/components/magnetic'

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [active] = useState(0)
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    async function load() {
      const found = await getSiteProductBySlug(slug)
      if (found) {
        setProduct(found)
        setSize(found.sizes[1] ?? found.sizes[0])
      }
      const all = await getSiteProducts()
      setRelated(all.filter((p) => p.id !== found?.id).slice(0, 4))
    }
    load()
  }, [slug])

  if (!product) {
    return (
      <main className="bg-background">
        <Navbar />
        <section className="mx-auto flex max-w-[1400px] flex-col items-center justify-center px-5 pt-40 pb-32 md:px-8">
          <p className="text-sm text-muted-foreground">Product not found.</p>
          <Link href="/shop" className="mt-4 text-sm underline hover:no-underline">
            Back to shop
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  const gallery = [product.image]

  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-28 md:px-8 md:pt-36">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1a1a1c]"
            >
              <Image
                src={gallery[active] || '/placeholder.svg'}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 md:p-10"
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="lg:py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {product.collection}
            </p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-2xl text-foreground">
                    R{product.salePrice}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    R{product.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl text-foreground">
                  R{product.price}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
              From the Renaissance archive — street drop, not mall stock. Boxy
              fit, loud print, made for the crew that gets it.
            </p>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-foreground">
                  Size
                </span>
                <button className="text-xs uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4">
                  Size guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                      size === s
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-foreground hover:border-foreground/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + actions */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex size-11 items-center justify-center text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex size-11 items-center justify-center text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/50"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`size-4 ${wishlisted ? 'fill-foreground' : ''}`}
                />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="flex-1" strength={0.2}>
                <button
                  disabled={!product.inStock}
                  className="w-full rounded-full bg-foreground py-4 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-40"
                >
                  {product.inStock ? 'Add to cart' : 'Sold out'}
                </button>
              </Magnetic>
              <button className="flex-1 rounded-full border border-foreground py-4 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background">
                Buy now
              </button>
            </div>

            {/* Reassurance */}
            <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
              {[
                { icon: Truck, label: 'Free worldwide shipping' },
                { icon: RotateCcw, label: '30-day returns' },
                { icon: ShieldCheck, label: 'Authenticity guaranteed' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <item.icon className="size-4 shrink-0 text-foreground" />
                  <span className="text-xs leading-tight text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            You may also like
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
