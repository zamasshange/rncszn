import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const shots = [
  '/hero-editorial.png',
  '/editorial-2.png',
  '/drop-campaign.png',
  '/brand-story.png',
  '/product-jacket.png',
  '/product-top.png',
]

export function InstagramFeed() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              @renaissance
            </h2>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground"
            >
              <Camera className="size-4" />
              Follow
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-1.5 md:grid-cols-6">
        {shots.map((src, i) => (
          <Link
            key={i}
            href="#"
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={`Renaissance Instagram post ${i + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 text-background opacity-0 transition-all duration-300 group-hover:bg-foreground/30 group-hover:opacity-100">
              <Camera className="size-6" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
