"use client"

import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export default function Layout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith("/auth/")
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className={`flex ${isAuthPage ? "min-h-dvh w-full" : "min-h-[calc(100svh-5rem)] w-full flex-col"}`}>
        <div className={`${isAuthPage ? "min-h-dvh w-full" : "w-full flex-1"} ${isAdminPage ? "admin-dashboard" : pathname.startsWith("/userDashboard") ? "user-dashboard" : ""}`}>
          {children}
        </div>
        {!isAuthPage && !isAdminPage && <Footer />}
      </div>
    </>
  )
}
