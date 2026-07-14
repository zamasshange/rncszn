'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getSiteProducts, type Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'

export function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getSiteProducts().then(setProducts)
  }, [])

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            01 — New Arrivals
          </p>
          <h2 className="max-w-xl text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-6xl">
            Fresh from the archive
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground"
          >
            View all products
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
        {products.slice(0, 8).map((product, i) => (
          <Reveal key={product.id} delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-sm text-muted-foreground">No products yet. Add some from the admin panel!</p>
          </div>
        )}
      </div>
    </section>
  )
}
