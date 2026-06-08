'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'

export function LimitedDrop() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative h-[80svh] min-h-[520px] w-full overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image
            src="/drop-campaign.png"
            alt="Limited edition Renaissance drop campaign"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-foreground/5 to-transparent" />

        <div className="absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-end px-5 pb-14 md:px-8 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-background"
          >
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-background/80">
              02 — Limited Edition
            </p>
            <h2 className="text-balance font-serif text-5xl font-light leading-[0.95] md:text-7xl">
              The Mirror Drop
            </h2>
            <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-background/80">
              Forty-eight pieces. Hand-finished chrome and holographic textiles.
              Once they are gone, they are gone for good.
            </p>
            <Magnetic>
              <Link
                href="/shop"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-background/90"
              >
                Shop the Drop
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
