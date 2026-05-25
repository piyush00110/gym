'use client'

import { useStore, useStats } from '@/lib/store'

export default function Dashboard() {
  const { state } = useStore()
  const stats = useStats()

  const today = new Date().toISOString().split('T')[0]
  const todayActivity = state.attendances.filter(a => a.date === today)

  const cards = [
    { label: 'Total Members', value: stats.totalMembers, color: 'bg-blue-500' },
    { label: 'Active Members', value: stats.activeMembers, color: 'bg-emerald-500' },
    { label: "Today's Check-ins", value: stats.todayCheckIns, color: 'bg-violet-500' },
    { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue}`, color: 'bg-amber-500' },
    { label: 'New This Month', value: stats.newMembersThisMonth, color: 'bg-cyan-500' },
    { label: 'Expiring Soon', value: stats.expiringSoon, color: 'bg-rose-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-zinc-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${card.color}`} />
              <span className="text-sm text-zinc-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-zinc-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-900 mb-4">Today's Activity</h3>
          {todayActivity.length === 0 ? (
            <p className="text-sm text-zinc-400">No check-ins recorded today.</p>
          ) : (
            <div className="space-y-3">
              {todayActivity.map(a => {
                const member = state.members.find(m => m.id === a.memberId)
                return (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{member?.name || 'Unknown'}</p>
                      <p className="text-xs text-zinc-400">{member?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-zinc-900">{a.checkIn}</p>
                      <p className="text-xs text-zinc-400">{a.checkOut ? `Out: ${a.checkOut}` : 'Still here'}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h3 className="font-semibold text-zinc-900 mb-4">Recent Payments</h3>
          {state.payments.slice(0, 5).map(p => {
            const member = state.members.find(m => m.id === p.memberId)
            return (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{member?.name || 'Unknown'}</p>
                  <p className="text-xs text-zinc-400">{p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900">${p.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
