"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"
import AccountMenu from "./AccountMenu"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Rooms", href: "/rooms" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const { data: session, status } = useSession()
  const [openPath, setOpenPath] = useState(null)
  const pathname = usePathname()
  const isOpen = openPath === pathname
  const isActive = (href) => href === "/" ? pathname === href : pathname.startsWith(href)
  const closeMenu = () => setOpenPath(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenPath(null)
        document.getElementById("navigation-toggle")?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <header className="h-20 shrink-0">
      <nav aria-label="Main navigation" className="luxury-nav">
        <div className="luxury-nav-inner">
          <Link href="/" onClick={closeMenu} className="luxury-brand" aria-label="LuxuryStay home">
            <img src="/images/luxurystay-logo-trimmed.png" alt="" className="luxury-brand-logo" />
          </Link>

          <div className="luxury-desktop-nav">
            <div className="luxury-nav-links">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="luxury-nav-link">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="luxury-header-controls">
            <div className="luxury-nav-actions">
              <AccountMenu key={pathname} user={session?.user} status={status} onOpen={closeMenu} />
            </div>
          <button
            id="navigation-toggle"
            type="button"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setOpenPath(isOpen ? null : pathname)}
            className="luxury-menu-toggle"
          >
            {isOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="luxury-mobile-nav"
            >
              <div className="luxury-mobile-inner">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={isActive(item.href) ? "page" : undefined} className="luxury-mobile-link">
                    {item.name}
                  </Link>
                ))}
                {status === "unauthenticated" && <div className="luxury-mobile-actions">
                  <Link href="/auth/login" onClick={closeMenu} className="luxury-login">Login</Link>
                  <Link href="/auth/register" onClick={closeMenu} className="luxury-register">Register</Link>
                </div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
