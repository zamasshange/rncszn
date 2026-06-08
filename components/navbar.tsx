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
      <div
        className={cn(
          'mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 transition-all duration-500 md:px-8',
          scrolled &&
            'mt-3 rounded-full border border-border/70 bg-card/70 px-6 py-3 backdrop-blur-xl md:mx-4',
        )}
      >
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground md:hidden"
        >
          <Menu className="size-5" />
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

        <Link
          href="/"
          aria-label="Renaissance home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image
            src="/renaissance-logo-dark.png"
            alt="RENAISSANCE"
            width={170}
            height={66}
            priority
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <div className="flex items-center gap-5">
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
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            <Search className="size-[18px]" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden text-foreground/70 transition-colors hover:text-foreground sm:block"
          >
            <User className="size-[18px]" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-foreground/70 transition-colors hover:text-foreground"
          >
            <ShoppingBag className="size-[18px]" />
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
