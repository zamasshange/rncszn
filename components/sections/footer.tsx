import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Faces', href: '/renaissance-faces' },
  { label: 'Join', href: '/join' },
  { label: 'Contact', href: '/contact' },
  { label: 'IG', href: 'https://www.instagram.com/renaissance.szn/' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/renaissance-logo-dark.png"
            alt="RENAISSANCE"
            width={120}
            height={46}
            className="h-5 w-auto"
          />
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            © {new Date().getFullYear()}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="text-[11px] uppercase tracking-[0.12em] text-foreground/65 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
