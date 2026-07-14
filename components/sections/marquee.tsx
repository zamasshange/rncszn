'use client'

import { motion } from 'framer-motion'

const items = [
  'RENAISSANCE x MOWA',
  'AUGUST 5TH',
  'LIMITED DROP',
]

export function Marquee() {
  return (
    <div className="border-y border-border bg-foreground py-4 text-background overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-sm uppercase tracking-[0.25em]">
              {item}
            </span>
            <span className="text-background/40">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
