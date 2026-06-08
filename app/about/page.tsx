'use client'

import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/sections/footer'

export default function AboutPage() {
  return (
    <main className="bg-background">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-8 md:pt-40">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span>/</span>
          <span className="text-foreground">About</span>
        </div>
        <h1 className="mt-6 text-balance font-serif text-5xl font-light leading-[0.95] text-foreground md:text-7xl">
          The House of<br />Renaissance
        </h1>
        <p className="mt-6 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
          Born from the collision of Y2K nostalgia and futuristic design, Renaissance is a premium fashion house redefining what luxury means for the next generation.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/brand-story.png"
              alt="Renaissance atelier"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Our Story</p>
            <h2 className="mt-4 font-serif text-3xl font-light text-foreground md:text-4xl">
              Where chrome meets couture
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Founded in Johannesburg, Renaissance emerged from a desire to merge the tactile luxury of high fashion with the fearless energy of Y2K culture. Every piece is designed in-house, hand-finished, and produced in limited quantities.
              </p>
              <p>
                Our collections are built around chrome-treated textiles, holographic fabrics, and sculpted silhouettes that feel both nostalgic and radically forward. We do not follow trends — we engineer them.
              </p>
              <p>
                Each drop is a statement. Each garment is a piece of wearable art. We believe fashion should feel like the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: 'Limited Production', desc: 'Every piece is produced in limited quantities. Once a drop sells out, it is gone for good.' },
            { title: 'Hand-Finished', desc: 'Each garment passes through our atelier where artisans hand-finish every detail with precision.' },
            { title: 'Future Materials', desc: 'We work with chrome-treated textiles, holographic fabrics, and innovative materials that push boundaries.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border p-8">
              <h3 className="font-serif text-2xl font-light text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
