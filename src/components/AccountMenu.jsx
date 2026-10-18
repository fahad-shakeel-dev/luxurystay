"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { LogOut, UserRound } from "lucide-react"

export default function AccountMenu({ user, status, onOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const [failedImage, setFailedImage] = useState(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState("")
  const container = useRef(null)
  const toggle = useRef(null)
  const menuId = useId()
  const name = user?.name?.trim() || user?.email?.split("@")[0] || "My account"
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()
  const image = Array.isArray(user?.image) ? user.image[0] : user?.image

  useEffect(() => {
    if (!isOpen) return
    const outside = event => {
      if (!container.current?.contains(event.target)) setIsOpen(false)
    }
    const escape = event => {
      if (event.key === "Escape") {
        setIsOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [isOpen])

  if (status === "loading") return <span className="luxury-account-loading" role="status" aria-label="Loading account" />
  if (status !== "authenticated" || !user) {
    return (
      <div className="luxury-guest-actions">
        <Link href="/auth/login" className="luxury-login">Login</Link>
        <Link href="/auth/register" className="luxury-register">Register</Link>
      </div>
    )
  }

  async function logout() {
    setIsSigningOut(true)
    setError("")
    try {
      await signOut({ callbackUrl: "/" })
    } catch {
      setError("Unable to sign out. Please try again.")
      setIsSigningOut(false)
    }
  }

  return (
    <div className="luxury-account" ref={container}>
      <button
        type="button"
        ref={toggle}
        className="luxury-account-avatar"
        aria-label={`Open account for ${name}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => { onOpen?.(); setIsOpen(previous => !previous) }}
      >
        {image && image !== failedImage && image !== "/placeholder.svg"
          ? <img src={image} alt="" onError={() => setFailedImage(image)} />
          : <span aria-hidden="true">{initials}</span>}
      </button>
      {isOpen && (
        <div id={menuId} className="luxury-account-dropdown">
          <div className="luxury-account-info">
            <p>{name}</p>
            {user.email && <span>{user.email}</span>}
          </div>
          <Link href="/userDashboard" onClick={() => setIsOpen(false)} className="luxury-account-item"><UserRound size={17} aria-hidden="true" /> My account</Link>
          <button type="button" onClick={logout} disabled={isSigningOut} className="luxury-account-item"><LogOut size={17} aria-hidden="true" /> {isSigningOut ? "Signing out..." : "Sign out"}</button>
          {error && <p role="alert" className="luxury-account-error">{error}</p>}
        </div>
      )}
    </div>
  )
}
