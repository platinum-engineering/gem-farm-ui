import React, { useState, useRef } from 'react'

import s from './Dropdown.module.scss'
import useOnClickOutside from '../../hooks/useOnClickOutside'

type Props = {
  value: string | number
  items?: { key: string | number, name: string | JSX.Element }[]
  onChange?: (value: string | number) => void
  children?: JSX.Element | JSX.Element[]
}

const Dropdown = ({ items, onChange, value, children }: Props) => {
  const [open, setOpen] = useState(false)

  const refList = useRef(null);
  useOnClickOutside([refList], () => setOpen(false))

  const handleClick = (key: string | number) => {
    onChange(key);
    setOpen(false)
  }

  return (
  <div className={s.dropdown}>
    <div onClick={() => setOpen(!open)}>{children}</div>
    {!!open &&
    <div ref={refList} className={s.list}>
      {items?.map((item) => {
        const isSelected = item.key === value;
        return (
        <div
        className={`${s.listItem} ${isSelected && s.selected}`}
        key={item.key}
        onClick={() => handleClick(item.key)}
        >
          {item.name}
        </div>
        )
      })}
    </div>
    }
  </div>
  )
}

export default Dropdown
