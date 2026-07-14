'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'

type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  image: string
  size: string
  qty: number
}

const demoCart: CartItem[] = []

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(demoCart)

  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Cart</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          Your Cart
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </section>

      {items.length === 0 ? (
        <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-32 text-center">
          <ShoppingBag className="size-16 text-muted-foreground/30 mx-auto mb-6" />
          <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90"
          >
            Continue Shopping
            <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-border pb-6">
                  <Link href={`/product/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted md:size-32">
                    <Image src={item.image || '/placeholder.svg'} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium text-foreground hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">Size: {item.size}</p>
                      <div className="mt-3 flex items-center rounded-full border border-border">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="flex size-8 items-center justify-center text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="flex size-8 items-center justify-center text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-sm font-medium text-foreground">R{item.price * item.qty}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border p-6 h-fit sticky top-32">
              <h3 className="text-xs uppercase tracking-[0.18em] text-foreground mb-6">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">R{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground">{shipping === 0 ? 'Free' : `R${shipping}`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>R{total}</span>
                </div>
              </div>
              <button className="mt-6 w-full rounded-full bg-foreground py-4 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90">
                Checkout
              </button>
              <Link href="/shop" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
