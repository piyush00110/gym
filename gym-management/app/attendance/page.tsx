'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Attendance } from '@/lib/types'
import { ClipboardCheck, UserCheck, LogIn, Clock, History, ChevronDown } from 'lucide-react'

export default function AttendancePage() {
  const { state, dispatch } = useStore()
  const [selectedMember, setSelectedMember] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  function checkInOut() {
    if (!selectedMember) return
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    const date = now.toISOString().split('T')[0]
    const existing = state.attendances.find(a => a.memberId === selectedMember && a.date === date)
    if (existing) {
      if (existing.checkOut) {
        setMessage('Member already checked in and out today.')
        setMessageType('error')
        setTimeout(() => setMessage(''), 3000)
        return
      }
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: { ...existing, checkOut: time } })
      setMessage(`Checked out successfully at ${time}`)
      setMessageType('success')
    } else {
      const att: Attendance = { id: crypto.randomUUID().slice(0, 8), memberId: selectedMember, date, checkIn: time, checkOut: null }
      dispatch({ type: 'ADD_ATTENDANCE', payload: att })
      setMessage(`Checked in successfully at ${time}`)
      setMessageType('success')
    }
    setSelectedMember('')
    setTimeout(() => setMessage(''), 3000)
  }

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = state.attendances.filter(a => a.date === today)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-indigo-500" />
          Attendance
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">Track member check-ins and check-outs</p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 backdrop-blur-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick Check-in / Check-out</h3>
            <p className="text-xs text-slate-400">Select a member to record attendance</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            >
              <option value="">Choose a member...</option>
              {state.members.filter(m => m.status === 'active').map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={checkInOut}
            disabled={!selectedMember}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
          >
            <LogIn className="w-4 h-4" />
            Check In / Out
          </button>
        </div>
        {message && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl ${
            messageType === 'success'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${messageType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {message}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden backdrop-blur-sm animate-slide-up">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Today&apos;s Records</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-lg">
            {todayRecords.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Member</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Date</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Check In</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {todayRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-400">
                    <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    No records for today.
                  </td>
                </tr>
              ) : (
                todayRecords.map((a, i) => {
                  const member = state.members.find(m => m.id === a.memberId)
                  return (
                    <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            {member?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{member?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{a.date}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {a.checkIn}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {a.checkOut ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-white">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            {a.checkOut}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Still here
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {state.attendances.length > todayRecords.length && (
        <details className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden backdrop-blur-sm group animate-fade-in">
          <summary className="px-5 py-3.5 flex items-center gap-2 text-sm font-semibold text-indigo-500 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors list-none">
            <History className="w-4 h-4" />
            View all records
            <ChevronDown className="w-4 h-4 ml-auto group-open:rotate-180 transition-transform" />
          </summary>
          <div className="border-t border-slate-100 dark:border-slate-700/50 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Member</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Check In</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {state.attendances.map(a => {
                  const member = state.members.find(m => m.id === a.memberId)
                  return (
                    <tr key={a.id} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-xs font-bold text-white">
                            {member?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{member?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{a.date}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-white">{a.checkIn}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{a.checkOut || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  )
}
