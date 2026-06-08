'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'

const categories = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories']
const sorts = [
  { key: 'new', label: 'Newest' },
  { key: 'low', label: 'Price: Low to High' },
  { key: 'high', label: 'Price: High to Low' },
] as const

export default function ShopPage() {
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<(typeof sorts)[number]['key']>('new')

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) => category === 'All' || p.category === category,
    )
    if (sort === 'low')
      list = [...list].sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
      )
    if (sort === 'high')
      list = [...list].sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
      )
    return list
  }, [category, sort])

  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Shop</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          The Collection
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {filtered.length} pieces engineered with couture precision and chrome
          obsession.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${
                  category === c
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground/70 hover:border-foreground/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="cursor-pointer bg-transparent text-foreground outline-none"
              aria-label="Sort products"
            >
              {sorts.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-5 pb-24 md:gap-7 lg:grid-cols-4"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
