'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  })

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div style={{ perspective: 1000 }}>
      <Link
        ref={ref}
        href={`/product/${product.slug}`}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          x.set(0)
          y.set(0)
        }}
        className="group block"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[4/5] overflow-hidden rounded-xl border border-dashed border-foreground/20 bg-transparent transition-all duration-300 group-hover:border-solid group-hover:border-foreground/35"
        >
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-5 drop-shadow-[0_10px_28px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out group-hover:scale-[1.02] md:p-7"
          />

          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-card/85 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-foreground backdrop-blur">
              {product.badge}
            </span>
          )}

          {!product.inStock && (
            <span className="absolute right-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-background">
              Sold Out
            </span>
          )}

          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-3 bottom-3"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="flex items-center justify-between rounded-full bg-card/90 px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-foreground backdrop-blur">
              Quick add
              <Plus className="size-4" />
            </span>
          </motion.div>
        </motion.div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.collection}
            </p>
            <h3 className="mt-1 text-sm text-foreground">{product.name}</h3>
          </div>
          <div className="text-right text-sm">
            {product.salePrice ? (
              <span className="flex flex-col items-end">
                <span className="text-foreground">R{product.salePrice}</span>
                <span className="text-xs text-muted-foreground line-through">
                  R{product.price}
                </span>
              </span>
            ) : (
              <span className="text-foreground">R{product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
