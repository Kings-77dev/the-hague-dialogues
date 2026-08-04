'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {HEADER_NAV} from '@/lib/nav'

function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function DesktopNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation" className="desktop-nav">
      {HEADER_NAV.map((item) => {
        const active = isActive(pathname, item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? 'active' : undefined}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
