import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const shots = [
  '/products/rnc-soldier-chain.png',
  '/hero-editorial.png',
  '/face-taheera.png',
  '/face-prettyhunn.png',
  '/products/make-sa-great-again-tee.png',
  '/products/renaissance-stars-flame-hoodie.png',
]

const INSTAGRAM_URL = 'https://www.instagram.com/renaissance.szn/'

export function InstagramFeed() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-light text-foreground md:text-3xl">
              @renaissance.szn
            </h2>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground hover:text-foreground/70 transition-colors"
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
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-secondary"
          >
            <Image
              src={src || '/placeholder.svg'}
              alt={`Renaissance Instagram post ${i + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-contain p-2 transition-transform duration-700 group-hover:scale-105 md:object-cover md:p-0"
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
