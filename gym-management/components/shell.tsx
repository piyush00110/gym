'use client'

import { useState, useCallback } from 'react'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'

export default function Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar open={mobileMenuOpen} onClose={closeMenu} />
      <div className="flex-1 sm:ml-64 flex flex-col min-h-screen w-full max-w-full">
        <Header onMenuToggle={toggleMenu} />
        <main className="flex-1 p-3 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
