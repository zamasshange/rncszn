import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/sections/hero'
import { Marquee } from '@/components/sections/marquee'
import { FeaturedGrid } from '@/components/sections/featured-grid'
import { LimitedDrop } from '@/components/sections/limited-drop'
import { BrandStory } from '@/components/sections/brand-story'
import { Newsletter } from '@/components/sections/newsletter'
import { InstagramFeed } from '@/components/sections/instagram-feed'
import { Footer } from '@/components/sections/footer'

export default function Page() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Marquee />
      <FeaturedGrid />
      <LimitedDrop />
      <BrandStory />
      <Newsletter />
      <InstagramFeed />
      <Footer />
    </main>
  )
}
