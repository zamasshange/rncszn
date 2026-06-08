'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    // Only enable on fine pointer (mouse) devices
    const mql = window.matchMedia('(pointer: fine)')
    if (!mql.matches) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-none-fine')

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]',
      )
      setHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('cursor-none-fine')
    }
  }, [cursorX, cursorY])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground md:block"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/40 md:block"
        style={{ x: springX, y: springY }}
        animate={{
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          opacity: hovering ? 1 : 0.6,
          backgroundColor: hovering
            ? 'oklch(0.2 0.006 260 / 0.06)'
            : 'oklch(0.2 0.006 260 / 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  )
}
