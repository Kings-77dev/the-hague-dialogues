import Link from 'next/link'
import Image from 'next/image'
import {DesktopNav} from './DesktopNav'
import {MobileMenu} from './MobileMenu'

type HeaderProps = {
  donateHref: string
}

/** Fixed 74px header — faithful to the prototype `.site-header`. */
export function Header({donateHref}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" aria-label="The Hague Dialogues home" className="logo">
          <Image src="/logo-mark.png" alt="" width={108} height={55} priority />
        </Link>
        <DesktopNav />
        <Link href={donateHref} className="donate-top">
          Donate Now
        </Link>
        <MobileMenu />
      </div>
    </header>
  )
}
