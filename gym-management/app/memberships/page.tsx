'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Membership } from '@/lib/types'
import { Dumbbell, Plus, X, Check, Pencil } from 'lucide-react'

const emptyMembership = (): Membership => ({
  id: '',
  name: '',
  price: 0,
  duration: 30,
  features: [''],
})

export default function MembershipsPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Membership | null>(null)
  const [form, setForm] = useState<Membership>(emptyMembership())

  function openAdd() {
    setForm(emptyMembership())
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(m: Membership) {
    setForm({ ...m, features: [...m.features] })
    setEditing(m)
    setShowForm(true)
  }

  function addFeature() {
    setForm({ ...form, features: [...form.features, ''] })
  }

  function updateFeature(i: number, v: string) {
    const f = [...form.features]; f[i] = v
    setForm({ ...form, features: f })
  }

  function removeFeature(i: number) {
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })
  }

  function save() {
    const payload = { ...form, features: form.features.filter(f => f.trim()) }
    if (editing) {
      dispatch({ type: 'UPDATE_MEMBERSHIP', payload: { ...payload, id: editing.id } })
    } else {
      dispatch({ type: 'ADD_MEMBERSHIP', payload: { ...payload, id: crypto.randomUUID().slice(0, 8) } })
    }
    setShowForm(false)
    setEditing(null)
  }

  const planColors = [
    { from: 'from-slate-500', to: 'to-slate-600', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300' },
    { from: 'from-blue-500', to: 'to-indigo-600', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
    { from: 'from-indigo-500', to: 'to-purple-600', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' },
    { from: 'from-emerald-500', to: 'to-teal-600', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
    { from: 'from-rose-500', to: 'to-pink-600', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-500" />
            Membership Plans
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">{state.memberships.length} active plans</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{editing ? 'Edit Plan' : 'Add Plan'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price ($)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration (days)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Features</label>
                <div className="space-y-2 mt-1.5">
                  {form.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="Enter a feature..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
                      <button onClick={() => removeFeature(i)} className="px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addFeature} className="mt-2 text-sm font-semibold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors">+ Add feature</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600/50 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {state.memberships.map((m, i) => {
          const colors = planColors[i % planColors.length]
          return (
            <div key={m.id} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden animate-fade-in backdrop-blur-sm card-hover" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`bg-gradient-to-r ${colors.from} ${colors.to} px-5 py-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colors.badge}`}>
                    {m.duration} days
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${m.price}</span>
                  <span className="text-sm text-white/70">/ period</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">What&apos;s included</p>
                <ul className="space-y-2.5 mb-5">
                  {m.features.map((f, j) => (
                    <li key={j} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openEdit(m)}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-indigo-500 border border-indigo-200 dark:border-indigo-500/20 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                  <Pencil className="w-4 h-4" />
                  Edit Plan
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
