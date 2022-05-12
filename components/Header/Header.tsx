import React, { useState, useRef } from 'react'

import s from './Header.module.scss'
import useWindowSize from '../../hooks/useWindowSize'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import Dropdown from "@/components/Dropdown/Dropdown";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

type Props = {
  onClick?: any
}

const Header = ({ onClick }: Props) => {
  const [open, setOpen] = useState(false)
  const windowSize = useWindowSize()
  const { width } = windowSize
  const isMobile = width < 767

  const refMenuButton = useRef(null);
  const refMobileMenu = useRef(null);
  useOnClickOutside([refMobileMenu, refMenuButton], () => setOpen(false))

  if (isMobile) return (
  <header className={s.header} onClick={onClick}>
    <div>
      <div className={s.left}>
        <img className={s.logo} src="/images/logo.png" alt="Astrobabies" />
        <div className={s.logoText}>
          Astro Babies
        </div>
      </div>
      <div className={s.right}>
        {open ?
        <div ref={refMenuButton} className={s.menuButton} onClick={() => setOpen(false)}>
          <img className={s.menuButtonClose} src="/icons/close.svg" alt="Close"/>
        </div>
        :
        <div className={s.menuButton} onClick={() => setOpen(true)}>
          <img className={s.menuButtonOpen} src="/icons/menu.svg" alt="Menu"/>
        </div>
        }
      </div>
      {open &&
      <div ref={refMobileMenu} className={s.mobileMenu}>
        <div>
          <div className={s.mobileMenuItem}>
            <WalletMultiButton className={s.button} />
          </div>
          <div className={s.mobileMenuItem}>Tesla Giveaway</div>
          <div className={s.mobileMenuItem}>Minting</div>
          <div className={s.mobileMenuItem}>Litepaper</div>
          <div className={s.mobileMenuItem}>Press</div>
          <div className={s.mobileMenuItem}>FAQ</div>
        </div>
      </div>
      }
    </div>
  </header>
  )

  return (
  <header className={s.header} onClick={onClick}>
    <div>
      <div className={s.left}>
        <img className={s.logo} src="/images/logo.png" alt="Astrobabies" />
        <div className={s.logoText}>
          Astro Babies
        </div>
      </div>
      <nav className={s.right}>
        <div className={s.rightItem}>Tesla Giveaway</div>
        <div className={s.rightItem}>Minting</div>
        <div className={s.rightItem}>Litepaper</div>
        <div className={s.rightItem}>Press</div>
        <div className={s.rightItem}>FAQ</div>
        <div className={s.rightItem}>
          <WalletMultiButton className={s.button} />
        </div>
      </nav>
    </div>
  </header>
  )
}

export default Header
