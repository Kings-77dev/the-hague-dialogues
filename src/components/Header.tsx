import Link from 'next/link'
import Image from 'next/image'
import {DesktopNav} from './DesktopNav'
import {MobileMenu} from './MobileMenu'

type HeaderProps = {
  supportHref: string
}

/** Fixed 74px header — faithful to the prototype `.site-header`. */
export function Header({supportHref}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" aria-label="The Hague Dialogues home" className="logo">
          {/* alt="" because the link's aria-label already names the destination */}
          <Image src="/logo-mark.png" alt="" width={108} height={55} priority />
        </Link>
        <DesktopNav />
        <Link href={supportHref} className="donate-top">
          Support
        </Link>
        <MobileMenu />
      </div>
    </header>
  )
}
