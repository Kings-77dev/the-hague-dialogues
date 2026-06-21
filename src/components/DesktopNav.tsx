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
      {HEADER_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(pathname, item.href) ? 'active' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
