import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Faces', href: '/renaissance-faces' },
  { label: 'Join', href: '/join' },
  { label: 'Contact', href: '/contact' },
  { label: 'Instagram', href: 'https://www.instagram.com/renaissance.szn/' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 text-foreground">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Image
            src="/renaissance-logo-dark.png"
            alt="RENAISSANCE"
            width={160}
            height={62}
            className="h-7 w-auto"
          />
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            Underground Y2K street brand. Limited drops.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="text-xs uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-4 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Renaissance. Developed by BDL Corp.</p>
          <div className="flex gap-5">
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
