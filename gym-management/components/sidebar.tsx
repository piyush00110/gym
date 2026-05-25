'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/members', label: 'Members', icon: '👥' },
  { href: '/memberships', label: 'Memberships', icon: '🏋️' },
  { href: '/attendance', label: 'Attendance', icon: '✅' },
  { href: '/payments', label: 'Payments', icon: '💰' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen">
      <div className="p-6 border-b border-zinc-100">
        <h1 className="text-xl font-bold text-zinc-900">FitTrack</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Gym Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'bg-blue-50 text-blue-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-400">FitTrack v1.0</p>
      </div>
    </aside>
  )
}
