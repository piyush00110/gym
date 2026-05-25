'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Attendance } from '@/lib/types'

export default function AttendancePage() {
  const { state, dispatch } = useStore()
  const [selectedMember, setSelectedMember] = useState('')
  const [message, setMessage] = useState('')

  function checkIn() {
    if (!selectedMember) return
    const now = new Date()
    const time = now.toTimeString().slice(0, 5)
    const date = now.toISOString().split('T')[0]
    const existing = state.attendances.find(a => a.memberId === selectedMember && a.date === date)
    if (existing) {
      if (existing.checkOut) {
        setMessage('Member already checked in and out today.')
        return
      }
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: { ...existing, checkOut: time } })
      setMessage(`Checked out successfully at ${time}`)
    } else {
      const att: Attendance = { id: crypto.randomUUID().slice(0, 8), memberId: selectedMember, date, checkIn: time, checkOut: null }
      dispatch({ type: 'ADD_ATTENDANCE', payload: att })
      setMessage(`Checked in successfully at ${time}`)
    }
    setSelectedMember('')
    setTimeout(() => setMessage(''), 3000)
  }

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = state.attendances.filter(a => a.date === today)

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-6">Attendance</h2>

      <div className="bg-white rounded-xl border border-zinc-200 p-5 mb-6">
        <h3 className="font-semibold text-zinc-900 mb-3">Quick Check-in / Check-out</h3>


        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-zinc-500">Select Member</label>
            <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm">
              <option value="">Choose a member...</option>
              {state.members.filter(m => m.status === 'active').map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <button onClick={checkIn} disabled={!selectedMember} className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">Check In / Out</button>
        </div>
        {message && <p className="mt-3 text-sm text-emerald-600 font-medium">{message}</p>}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50">
          <h3 className="text-sm font-semibold text-zinc-700">Today&apos;s Records</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Member</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Check In</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Check Out</th>
            </tr>
          </thead>
          <tbody>
            {todayRecords.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-zinc-400">No records for today.</td></tr>
            ) : (
              todayRecords.map(a => {
                const member = state.members.find(m => m.id === a.memberId)
                return (
                  <tr key={a.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-5 py-4 text-sm font-medium text-zinc-900">{member?.name || 'Unknown'}</td>
                    <td className="px-5 py-4 text-sm text-zinc-500">{a.date}</td>
                    <td className="px-5 py-4 text-sm text-zinc-700">{a.checkIn}</td>
                    <td className="px-5 py-4 text-sm text-zinc-700">{a.checkOut || '-'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
        {state.attendances.length > todayRecords.length && (
          <details className="border-t border-zinc-100">
            <summary className="px-5 py-3 text-sm text-blue-600 cursor-pointer hover:bg-zinc-50 font-medium">View all records</summary>
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Check In</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {state.attendances.map(a => {
                  const member = state.members.find(m => m.id === a.memberId)
                  return (
                    <tr key={a.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-5 py-4 text-sm font-medium text-zinc-900">{member?.name || 'Unknown'}</td>
                      <td className="px-5 py-4 text-sm text-zinc-500">{a.date}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{a.checkIn}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{a.checkOut || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </details>
        )}
      </div>
    </div>
  )
}
