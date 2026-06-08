'use client'

import { usePathname } from 'next/navigation'
import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Disable smooth scroll on admin and dashboard pages
  // Lenis hijacks wheel/touch events and breaks overflow scrolling in nested containers
  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
