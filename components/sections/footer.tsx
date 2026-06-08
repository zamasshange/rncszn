import Image from 'next/image'
import Link from 'next/link'

const groups = [
  {
    title: 'Shop',
    links: ['New Arrivals', 'Outerwear', 'Tops', 'Accessories', 'Sale'],
  },
  {
    title: 'House',
    links: ['About', 'Sustainability', 'Careers', 'Stockists', 'Press'],
  },
  {
    title: 'Support',
    links: ['Contact', 'Shipping', 'Returns', 'Size Guide', 'FAQ'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50 text-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/renaissance-logo-dark.png"
              alt="RENAISSANCE"
              width={200}
              height={78}
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              A premium Y2K luxury fashion house. Chrome, holographic, and
              editorial pieces built for the future of fashion.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/shop"
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Renaissance. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
