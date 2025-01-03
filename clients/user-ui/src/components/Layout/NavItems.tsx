import Link from 'next/link'
import React from 'react'

const navItems = [
  { title: "Home", url: "/" },
  { title: "About us", url: "/about" },
  { title: "Restaurants", url: "/restaurants" },
  { title: "Popular Foods", url: "/foods" },
  { title: "Contact us", url: "/contact" },
]

const NavItems = ({ activeItem = 0 }: { activeItem?: number }) => {
  return (
    <div className="flex space-x-6">
      {navItems.map((item, index) => (
        <Link
          key={item.url}
          href={item.url}
          className={`px-5 text-[18px] font-Poppins  ${
            activeItem === index ? 'text-[#37b668]' : 'text-white'
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  )
}

export default NavItems
