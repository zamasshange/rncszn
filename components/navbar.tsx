'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/shop' },
  { label: 'Drops', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Gradient backdrop for logo visibility over hero */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-transparent pointer-events-none transition-opacity duration-500 md:from-background/60 md:via-background/20',
        scrolled && 'opacity-0',
      )} />

      <div
        className={cn(
          'relative z-10 mx-auto flex max-w-[1400px] items-center justify-between transition-all duration-500',
          'px-4 py-3 md:px-8 md:py-4',
          scrolled &&
            'mt-2 rounded-full border border-border/70 bg-card/80 px-5 py-2.5 backdrop-blur-xl md:mx-4 md:mt-3',
        )}
      >
        {/* LEFT: Hamburger (mobile) or Nav Links (desktop) */}
        <div className="shrink-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-foreground transition-colors hover:text-foreground/80 md:hidden"
          >
            <Menu className="size-6" />
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {links.slice(0, 3).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CENTER: Logo */}
        <Link
          href="/"
          aria-label="Renaissance home"
          className="shrink-0 mx-auto"
        >
          <Image
            src="/renaissance-logo-dark.png"
            alt="RENAISSANCE"
            width={170}
            height={66}
            priority
            className="h-6 w-auto sm:h-7 md:h-8"
          />
        </Link>

        {/* RIGHT: Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <nav className="hidden items-center gap-8 md:flex">
            {links.slice(3).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            aria-label="Search"
            className="hidden sm:block text-foreground/70 transition-colors hover:text-foreground"
          >
            <Search className="size-5" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden text-foreground/70 transition-colors hover:text-foreground sm:block"
          >
            <User className="size-5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-foreground transition-colors hover:text-foreground/80"
          >
            <ShoppingBag className="size-6 md:size-5" />
            <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              2
            </span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Image
                src="/renaissance-logo-dark.png"
                alt="RENAISSANCE"
                width={150}
                height={58}
                className="h-7 w-auto"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-5 pt-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-4 font-serif text-3xl"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
