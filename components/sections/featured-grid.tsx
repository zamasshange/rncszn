import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'

export function FeaturedGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            01 — New Arrivals
          </p>
          <h2 className="max-w-xl text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-6xl">
            The latest from the Cyber Atelier
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
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
