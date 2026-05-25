'use client'

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react'
import { Member, Membership, Attendance, Payment } from './types'
import { members as initialMembers, memberships as initialMemberships, attendances as initialAttendances, payments as initialPayments } from './data'

interface State {
  members: Member[]
  memberships: Membership[]
  attendances: Attendance[]
  payments: Payment[]
}

type Action =
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: Attendance }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'ADD_MEMBERSHIP'; payload: Membership }
  | { type: 'UPDATE_MEMBERSHIP'; payload: Membership }

const initialState: State = {
  members: initialMembers,
  memberships: initialMemberships,
  attendances: initialAttendances,
  payments: initialPayments,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] }
    case 'UPDATE_MEMBER':
      return { ...state, members: state.members.map(m => m.id === action.payload.id ? action.payload : m) }
    case 'DELETE_MEMBER':
      return { ...state, members: state.members.filter(m => m.id !== action.payload) }
    case 'ADD_ATTENDANCE':
      return { ...state, attendances: [...state.attendances, action.payload] }
    case 'UPDATE_ATTENDANCE':
      return { ...state, attendances: state.attendances.map(a => a.id === action.payload.id ? action.payload : a) }
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] }
    case 'UPDATE_PAYMENT':
      return { ...state, payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p) }
    case 'ADD_MEMBERSHIP':
      return { ...state, memberships: [...state.memberships, action.payload] }
    case 'UPDATE_MEMBERSHIP':
      return { ...state, memberships: state.memberships.map(m => m.id === action.payload.id ? action.payload : m) }
    default:
      return state
  }
}

const StoreContext = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function useStats() {
  const { state } = useStore()
  const activeMembers = state.members.filter(m => m.status === 'active')
  const today = new Date().toISOString().split('T')[0]
  const todayCheckIns = state.attendances.filter(a => a.date === today).length
  const monthlyRevenue = state.payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  const newThisMonth = state.members.filter(m => m.joinDate.startsWith(today.substring(0, 7))).length
  const expiringSoon = state.members.filter(m => {
    const join = new Date(m.joinDate)
    const mem = state.memberships.find(mem => mem.id === m.membershipId)
    if (!mem) return false
    const expiry = new Date(join.getTime() + mem.duration * 86400000)
    const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000)
    return daysLeft > 0 && daysLeft <= 7
  }).length

  return {
    totalMembers: state.members.length,
    activeMembers: activeMembers.length,
    todayCheckIns,
    monthlyRevenue,
    newMembersThisMonth: newThisMonth,
    expiringSoon,
  }
}
