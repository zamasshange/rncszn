'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'

export default function DashboardPage() {
  return (
    <main className="bg-background">
      <Navbar />
      
      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground">Dashboard</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          Welcome to Your Dashboard
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          This is your personal dashboard. Here you can manage your profile, view order history, and access account settings.
        </p>
        
        {/* Placeholder for dashboard content */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border-border rounded-lg p-6">
            <h3 className="mb-4 text-foreground font-serif text-2xl">Orders</h3>
            <p className="text-muted-foreground">View your recent orders and track shipments.</p>
          </div>
          <div className="border-border rounded-lg p-6">
            <h3 className="mb-4 text-foreground font-serif text-2xl">Profile</h3>
            <p className="text-muted-foreground">Update your personal information and preferences.</p>
          </div>
          <div className="border-border rounded-lg p-6">
            <h3 className="mb-4 text-foreground font-serif text-2xl">Wishlist</h3>
            <p className="text-muted-foreground">Save your favorite items for later.</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}