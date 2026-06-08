'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="overflow-hidden rounded-3xl chrome-surface">
        <div className="flex flex-col items-center gap-8 bg-card/40 px-6 py-16 text-center backdrop-blur md:px-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/70">
            Newsletter
          </p>
          <h2 className="max-w-2xl text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-6xl">
            Get early access to every drop
          </h2>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-foreground/70">
            Join the list for first looks, restock alerts, and members-only
            releases. No noise — just the future, early.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm text-background"
            >
              <Check className="size-4" />
              You&apos;re on the list.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-foreground/20 bg-card p-1.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
