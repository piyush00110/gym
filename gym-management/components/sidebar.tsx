'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LayoutDashboard, Users, Dumbbell, ClipboardCheck, DollarSign } from 'lucide-react'

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/memberships', label: 'Memberships', icon: Dumbbell },
  { href: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { href: '/payments', label: 'Payments', icon: DollarSign },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  const content = (
    <>
      <div className="p-4 sm:p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">FitTrack</h1>
              <p className="text-[11px] text-slate-400 font-medium">Gym Management</p>
            </div>
          </div>
          <button onClick={onClose} className="sm:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-2 sm:px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Menu
        </p>
        {links.map(link => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-indigo-500/10 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-slate-500'}`} />
              {link.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Admin</p>
            <p className="text-[11px] text-slate-500 truncate">admin@fittrack.com</p>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 sm:hidden animate-fade-in backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Desktop sidebar - always visible */}
      <aside className="hidden sm:flex sidebar-gradient w-64 flex-col h-screen fixed left-0 top-0 z-40 border-r border-white/[0.06]">
        {content}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`sm:hidden sidebar-gradient fixed top-0 left-0 h-full w-72 z-50 border-r border-white/[0.06] transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {content}
        </div>
      </aside>
    </>
  )
}
