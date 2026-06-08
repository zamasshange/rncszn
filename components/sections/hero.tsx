'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/magnetic'

const headline = ['THE', 'FUTURE', 'OF', 'Y2K']

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-secondary pb-12 pt-28 md:pb-16"
    >
      {/* Editorial image, right side, parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block"
      >
        <Image
          src="/hero-editorial.png"
          alt="Renaissance Y2K editorial campaign"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-secondary/90" />
      </motion.div>

      <div className="absolute right-0 top-0 h-[60svh] w-full md:hidden">
        <Image
          src="/hero-editorial.png"
          alt="Renaissance Y2K editorial campaign"
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative mx-auto w-full max-w-[1400px] px-5 md:px-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-foreground/40" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
            Spring Drop / 026
          </span>
        </div>

        <h1 className="font-serif text-[18vw] font-light leading-[0.82] tracking-tight text-foreground md:text-[12vw] lg:text-[11rem]">
          {headline.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 * i + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {word === 'Y2K' ? (
                  <span className="chrome-text italic">FASHION</span>
                ) : (
                  word
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
        >
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-foreground/70">
            A luxury house reengineering early-internet nostalgia into chrome,
            holographic, and editorial pieces built for what comes next.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90"
              >
                Shop Collection
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-7 py-3.5 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
              >
                Explore Drops
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
