'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Member } from '@/lib/types'

const emptyMember = (): Member => ({
  id: '',
  name: '',
  email: '',
  phone: '',
  membershipId: 'm1',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'active',
})

export default function MembersPage() {
  const { state, dispatch } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState<Member>(emptyMember())

  function openAdd() {
    setForm(emptyMember())
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(m: Member) {
    setForm({ ...m })
    setEditing(m)
    setShowForm(true)
  }

  function save() {
    if (editing) {
      dispatch({ type: 'UPDATE_MEMBER', payload: { ...form, id: editing.id } })
    } else {
      dispatch({ type: 'ADD_MEMBER', payload: { ...form, id: crypto.randomUUID().slice(0, 8) } })
    }
    setShowForm(false)
    setEditing(null)
  }

  function remove(id: string) {
    if (confirm('Delete this member?')) dispatch({ type: 'DELETE_MEMBER', payload: id })
  }

  const membershipName = (id: string) => state.memberships.find(m => m.id === id)?.name || id

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Members</h2>
        <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">+ Add Member</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">{editing ? 'Edit Member' : 'Add Member'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Membership</label>
                <select value={form.membershipId} onChange={e => setForm({ ...form, membershipId: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {state.memberships.map(m => <option key={m.id} value={m.id}>{m.name} (${m.price})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Join Date</label>
                <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Member['status'] })} className="w-full mt-1 px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-zinc-200 text-sm font-medium rounded-lg hover:bg-zinc-50">Cancel</button>
              <button onClick={save} className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Membership</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Joined</th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.members.map(m => (
              <tr key={m.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="px-5 py-4 text-sm font-medium text-zinc-900">{m.name}</td>
                <td className="px-5 py-4 text-sm text-zinc-500">{m.email}</td>
                <td className="px-5 py-4 text-sm text-zinc-700">{membershipName(m.membershipId)}</td>
                <td className="px-5 py-4 text-sm text-zinc-500">{m.joinDate}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m.status === 'active' ? 'bg-emerald-100 text-emerald-700' : m.status === 'inactive' ? 'bg-zinc-100 text-zinc-600' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => openEdit(m)} className="text-xs text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                  <button onClick={() => remove(m.id)} className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
