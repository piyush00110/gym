'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Payment } from '@/lib/types'

const emptyPayment = (): Payment => ({
  id: '',
  memberId: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  method: 'card',
  status: 'pending',
})

export default function PaymentsPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Payment>(emptyPayment())

  function openAdd() {
    setForm(emptyPayment())
    setShowForm(true)
  }

  function save() {
    dispatch({ type: 'ADD_PAYMENT', payload: { ...form, id: crypto.randomUUID().slice(0, 8) } })
    setShowForm(false)
  }

  const memberName = (id: string) => state.members.find(m => m.id === id)?.name || 'Unknown'
  const totalPaid = state.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = state.payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Payments</h2>
        <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">+ Record Payment</button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex-1">
          <p className="text-xs text-zinc-500">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-600">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex-1">
          <p className="text-xs text-zinc-500">Outstanding</p>
          <p className="text-2xl font-bold text-amber-600">${totalPending.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex-1">
          <p className="text-xs text-zinc-500">Transactions</p>
          <p className="text-2xl font-bold text-zinc-900">{state.payments.length}</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Record Payment</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500">Member</label>
                <select value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm">
                  <option value="">Select...</option>
                  {state.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Amount ($)</label>
                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Method</label>
                <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value as Payment['method'] })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Payment['status'] })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-zinc-200 text-sm font-medium rounded-lg">Cancel</button>
              <button onClick={save} className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Member</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Method</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.payments.map(p => (
              <tr key={p.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-5 py-4 text-sm font-medium text-zinc-900">{memberName(p.memberId)}</td>
                <td className="px-5 py-4 text-sm font-semibold text-zinc-900">${p.amount.toFixed(2)}</td>
                <td className="px-5 py-4 text-sm text-zinc-500">{p.date}</td>
                <td className="px-5 py-4 text-sm text-zinc-700 capitalize">{p.method}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
