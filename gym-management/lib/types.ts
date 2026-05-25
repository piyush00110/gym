export type MemberStatus = 'active' | 'inactive' | 'suspended'
export type PaymentStatus = 'paid' | 'pending' | 'overdue'
export type PaymentMethod = 'cash' | 'card' | 'transfer'

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipId: string
  joinDate: string
  status: MemberStatus
  avatar?: string
}

export interface Membership {
  id: string
  name: string
  price: number
  duration: number
  features: string[]
}

export interface Attendance {
  id: string
  memberId: string
  date: string
  checkIn: string
  checkOut: string | null
}

export interface Payment {
  id: string
  memberId: string
  amount: number
  date: string
  method: PaymentMethod
  status: PaymentStatus
}

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  todayCheckIns: number
  monthlyRevenue: number
  newMembersThisMonth: number
  expiringSoon: number
}
