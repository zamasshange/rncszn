import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const stats = [
  { value: '026', label: 'Drops released' },
  { value: '48h', label: 'Average sellout' },
  { value: '∞', label: 'Future-built' },
]

export function BrandStory() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
            <Image
              src="/face-prettyhunn.png"
              alt="Renaissance face — street archive"
              fill
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              03 — Brand Story
            </p>
            <h2 className="text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
              Underground Y2K. Built for the youth.
            </h2>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Renaissance is street archive culture — thrift energy, loud
              graphics, and the crew that wears it IRL. Not mall luxury. Not
              chrome couture. Just the drop.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground"
            >
              Read our story
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-3xl text-foreground md:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
