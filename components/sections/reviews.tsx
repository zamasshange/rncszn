import { reviews } from '@/lib/products'
import { Reveal } from '@/components/reveal'

export function Reviews() {
  return (
    <section className="border-y border-border bg-secondary/60">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            04 — From the community
          </p>
          <h2 className="max-w-2xl text-balance font-serif text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
            Worn by the people building tomorrow
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-7">
          {reviews.map((r, i) => (
            <Reveal key={r.handle} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7">
                <blockquote className="text-pretty text-lg leading-relaxed text-foreground">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full chrome-surface text-xs font-medium text-foreground">
                    {r.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <span>
                    <span className="block text-sm text-foreground">
                      {r.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {r.handle}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
