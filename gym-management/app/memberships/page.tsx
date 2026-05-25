'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Membership } from '@/lib/types'

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Membership Plans</h2>
        <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">+ Add Plan</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">{editing ? 'Edit Plan' : 'Add Plan'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500">Plan Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Price ($)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Duration (days)</label>
                <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Features</label>
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2 mt-1">
                    <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="Enter feature" className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm" />
                    <button onClick={() => removeFeature(i)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg">X</button>
                  </div>
                ))}
                <button onClick={addFeature} className="mt-2 text-xs text-blue-600 font-medium">+ Add feature</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-zinc-200 text-sm font-medium rounded-lg">Cancel</button>
              <button onClick={save} className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.memberships.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{m.name}</h3>
                <p className="text-xs text-zinc-400">{m.duration} days</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">${m.price}</p>
            </div>
            <ul className="space-y-1.5 mb-4 flex-1">
              {m.features.map((f, i) => (
                <li key={i} className="text-sm text-zinc-600 flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => openEdit(m)} className="w-full py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Edit Plan</button>
          </div>
        ))}
      </div>
    </div>
  )
}
