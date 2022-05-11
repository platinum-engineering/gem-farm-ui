import React from 'react'

import s from './Header.module.scss'

type Props = {
  onClick?: any
}

const Header = ({ onClick }: Props) => {
  return (
  <header className={s.header} onClick={onClick}>
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
    </nav>
  </header>
  )
}

export default Header
