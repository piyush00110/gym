'use client'

import React from 'react'
import { useStore, useStats } from '@/lib/store'
import {
  Users,
  UserCheck,
  ClipboardCheck,
  DollarSign,
  UserPlus,
  AlertTriangle,
  TrendingUp,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

function StatCard({ icon: Icon, label, value, sub, trend, gradient }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string; trend?: 'up' | 'down'; gradient: string
}) {
  return (
    <div className="card-hover bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 animate-fade-in backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  )
}

const chartData = [
  { name: 'Mon', checkIns: 18, payments: 1200 },
  { name: 'Tue', checkIns: 22, payments: 1800 },
  { name: 'Wed', checkIns: 25, payments: 2100 },
  { name: 'Thu', checkIns: 20, payments: 1500 },
  { name: 'Fri', checkIns: 28, payments: 2400 },
  { name: 'Sat', checkIns: 35, payments: 2800 },
  { name: 'Sun', checkIns: 15, payments: 900 },
]

export default function Dashboard() {
  const { state } = useStore()
  const stats = useStats()

  const today = new Date().toISOString().split('T')[0]
  const todayActivity = state.attendances.filter(a => a.date === today)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard
          icon={Users} label="Total Members" value={stats.totalMembers}
          sub="+12%" trend="up"
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        <StatCard
          icon={UserCheck} label="Active Members" value={stats.activeMembers}
          sub="+8%" trend="up"
          gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
        />
        <StatCard
          icon={ClipboardCheck} label="Today&apos;s Check-ins" value={stats.todayCheckIns}
          sub={stats.todayCheckIns > 0 ? `${((stats.todayCheckIns / stats.activeMembers) * 100).toFixed(0)}% rate` : 'No data'} trend={stats.todayCheckIns > 3 ? 'up' : 'down'}
          gradient="bg-gradient-to-br from-violet-500 to-fuchsia-500"
        />
        <StatCard
          icon={DollarSign} label="Monthly Revenue" value={`$${stats.monthlyRevenue.toFixed(2)}`}
          sub="+$320" trend="up"
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
        />
        <StatCard
          icon={UserPlus} label="New This Month" value={stats.newMembersThisMonth}
          trend={stats.newMembersThisMonth > 0 ? 'up' : 'down'} sub={stats.newMembersThisMonth > 0 ? '+2' : '0'}
          gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
        />
        <StatCard
          icon={AlertTriangle} label="Expiring Soon" value={stats.expiringSoon}
          trend={stats.expiringSoon > 0 ? 'up' : 'down'} sub={stats.expiringSoon > 0 ? 'Action needed' : 'All good'}
          gradient="bg-gradient-to-br from-rose-400 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 animate-slide-up backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Weekly Overview
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Check-ins & revenue trend</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                Check-ins
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                Revenue ($)
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Legend wrapperStyle={{ display: 'none' }} />
                <Bar yAxisId="left" dataKey="checkIns" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar yAxisId="right" dataKey="payments" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 animate-slide-up backdrop-blur-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-indigo-500" />
            Today&apos;s Activity
          </h3>
          {todayActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ClipboardCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">No check-ins recorded today.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayActivity.map((a, i) => {
                const member = state.members.find(m => m.id === a.memberId)
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {member?.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{member?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 truncate">{member?.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.checkIn}</p>
                      <p className={`text-xs ${a.checkOut ? 'text-slate-400' : 'text-emerald-500 font-medium'}`}>
                        {a.checkOut ? `Out: ${a.checkOut}` : '● Here'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 animate-fade-in backdrop-blur-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-indigo-500" />
          Recent Payments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">Member</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.payments.slice(0, 5).map((p, i) => {
                const member = state.members.find(m => m.id === p.memberId)
                return (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-xs font-bold text-white">
                          {member?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{member?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-sm font-semibold text-slate-900 dark:text-white">${p.amount.toFixed(2)}</td>
                    <td className="px-3 py-3.5 text-sm text-slate-500">{p.date}</td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        p.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : p.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'paid' ? 'bg-emerald-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
