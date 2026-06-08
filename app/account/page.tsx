'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Package, Heart, MapPin, LogOut } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('profile')

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'orders' as const, label: 'Orders', icon: Package },
    { key: 'wishlist' as const, label: 'Wishlist', icon: Heart },
    { key: 'addresses' as const, label: 'Addresses', icon: MapPin },
  ]

  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">Account</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          My Account
        </h1>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-foreground text-background'
                    : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-foreground/5 transition-colors">
              <LogOut className="size-4" />
              Sign Out
            </button>
          </aside>

          <div className="rounded-2xl border border-border p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Profile</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Guest"
                      className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="guest@renaissance.co.za"
                      className="w-full border-b border-border bg-transparent py-3 text-sm text-foreground outline-none focus:border-foreground"
                    />
                  </div>
                </div>
                <button className="mt-8 rounded-full bg-foreground px-8 py-3 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Order History</h2>
                <div className="space-y-4">
                  {[
                    { number: 'ORD-10293', date: 'June 8, 2026', status: 'Completed', total: '$748' },
                    { number: 'ORD-10292', date: 'June 7, 2026', status: 'Processing', total: '$462' },
                  ].map((order) => (
                    <div key={order.number} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{order.number}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{order.total}</p>
                        <p className="text-xs text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-12">
                <Heart className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Your wishlist is empty.</p>
                <Link href="/shop" className="mt-4 inline-block text-sm underline hover:no-underline">
                  Browse the shop
                </Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Saved Addresses</h2>
                <div className="rounded-lg border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Default</span>
                  </div>
                  <p className="text-sm text-foreground">90 Rivonia Road</p>
                  <p className="text-sm text-muted-foreground">Sandton, Johannesburg</p>
                  <p className="text-sm text-muted-foreground">Gauteng 2196, South Africa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
