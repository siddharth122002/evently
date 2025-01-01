"use client"
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function NavItems() {
  const path = usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start font-semibold gap-5 md:flex-row">
      {headerLinks.map((link,i)=>(
        <li key={i} className={`${path===link.route?'text-[#624CF5]':'flex-center p-medium-16  whitespace-nowrap'}`}>
          <Link href={link.route}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavItems