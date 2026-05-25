import { Member, Membership, Attendance, Payment } from './types'

export const memberships: Membership[] = [
  {
    id: 'm1',
    name: 'Basic',
    price: 29.99,
    duration: 30,
    features: ['Gym access 6am-10pm', 'Locker room', 'Basic equipment'],
  },
  {
    id: 'm2',
    name: 'Standard',
    price: 49.99,
    duration: 30,
    features: ['24/7 gym access', 'Locker room', 'All equipment', 'Group classes'],
  },
  {
    id: 'm3',
    name: 'Premium',
    price: 79.99,
    duration: 30,
    features: ['24/7 gym access', 'Personal trainer (2x/month)', 'All equipment', 'Group classes', 'Sauna & pool', 'Nutrition plan'],
  },
  {
    id: 'm4',
    name: 'Annual Basic',
    price: 299.99,
    duration: 365,
    features: ['24/7 gym access', 'Locker room', 'All equipment', '2 months free'],
  },
  {
    id: 'm5',
    name: 'Annual Premium',
    price: 799.99,
    duration: 365,
    features: ['All Premium features', 'Personal trainer (4x/month)', 'Free merch pack', 'Priority booking'],
  },
]

export const members: Member[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', membershipId: 'm3', joinDate: '2025-01-15', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', membershipId: 'm1', joinDate: '2025-03-10', status: 'active' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', phone: '555-0103', membershipId: 'm2', joinDate: '2025-02-20', status: 'active' },
  { id: '4', name: 'David Wilson', email: 'david@example.com', phone: '555-0104', membershipId: 'm5', joinDate: '2024-11-01', status: 'active' },
  { id: '5', name: 'Eve Martinez', email: 'eve@example.com', phone: '555-0105', membershipId: 'm4', joinDate: '2025-04-05', status: 'active' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', phone: '555-0106', membershipId: 'm2', joinDate: '2025-05-12', status: 'inactive' },
  { id: '7', name: 'Grace Kim', email: 'grace@example.com', phone: '555-0107', membershipId: 'm3', joinDate: '2025-06-01', status: 'active' },
  { id: '8', name: 'Henry Brown', email: 'henry@example.com', phone: '555-0108', membershipId: 'm1', joinDate: '2025-07-18', status: 'suspended' },
]

export const attendances: Attendance[] = [
  { id: 'a1', memberId: '1', date: '2026-05-25', checkIn: '07:30', checkOut: '09:00' },
  { id: 'a2', memberId: '2', date: '2026-05-25', checkIn: '08:00', checkOut: '09:30' },
  { id: 'a3', memberId: '3', date: '2026-05-25', checkIn: '06:45', checkOut: null },
  { id: 'a4', memberId: '4', date: '2026-05-25', checkIn: '10:00', checkOut: '11:30' },
  { id: 'a5', memberId: '5', date: '2026-05-25', checkIn: '09:15', checkOut: null },
  { id: 'a6', memberId: '1', date: '2026-05-24', checkIn: '07:00', checkOut: '08:45' },
  { id: 'a7', memberId: '3', date: '2026-05-24', checkIn: '06:30', checkOut: '08:00' },
  { id: 'a8', memberId: '7', date: '2026-05-25', checkIn: '11:00', checkOut: null },
]

export const payments: Payment[] = [
  { id: 'p1', memberId: '1', amount: 79.99, date: '2026-05-01', method: 'card', status: 'paid' },
  { id: 'p2', memberId: '2', amount: 29.99, date: '2026-05-01', method: 'cash', status: 'paid' },
  { id: 'p3', memberId: '3', amount: 49.99, date: '2026-05-01', method: 'transfer', status: 'paid' },
  { id: 'p4', memberId: '4', amount: 799.99, date: '2025-11-01', method: 'card', status: 'paid' },
  { id: 'p5', memberId: '5', amount: 299.99, date: '2026-04-05', method: 'card', status: 'paid' },
  { id: 'p6', memberId: '6', amount: 49.99, date: '2026-04-01', method: 'cash', status: 'overdue' },
  { id: 'p7', memberId: '7', amount: 79.99, date: '2026-06-01', method: 'transfer', status: 'pending' },
  { id: 'p8', memberId: '8', amount: 29.99, date: '2026-05-01', method: 'card', status: 'overdue' },
]
