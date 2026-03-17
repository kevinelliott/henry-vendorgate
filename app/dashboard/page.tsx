'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import VendorTable from '@/components/vendor-table'
import StatusBadge from '@/components/status-badge'
import { Plus, Download, Search, Users, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

interface Requirement {
  id: string
  type: string
  status: string
}

interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  token: string
  status: 'approved' | 'partial' | 'blocked' | 'overdue'
  deadline?: string
  created_at: string
  requirements?: Requirement[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newVendor, setNewVendor] = useState({ name: '', email: '', phone: '', deadline: '' })
  const [addingVendor, setAddingVendor] = useState(false)

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  const checkAuthAndLoad = async () => {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    await loadVendors()
  }

  const loadVendors = async () => {
    try {
      const response = await fetch('/api/v1/vendors')
      const data = await response.json()
      if (data.vendors) setVendors(data.vendors)
    } catch (err) {
      console.error('Failed to load vendors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingVendor(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(newVendor),
      })
      if (response.ok) {
        setShowAddModal(false)
        setNewVendor({ name: '', email: '', phone: '', deadline: '' })
        await loadVendors()
      }
    } catch (err) {
      console.error('Failed to add vendor:', err)
    } finally {
      setAddingVendor(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor?')) return
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/v1/vendors/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${session?.access_token}` },
    })
    setVendors(vendors.filter(v => v.id !== id))
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Deadline', 'Progress']
    const rows = vendors.map(v => [
      v.name,
      v.email,
      v.status,
      v.deadline ? new Date(v.deadline).toLocaleDateString() : '',
      v.requirements ? `${v.requirements.filter(r => r.status === 'approved').length}/${v.requirements.length}` : '',
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vendors.csv'
    a.click()
  }

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: vendors.length,
    approved: vendors.filter(v => v.status === 'approved').length,
    overdue: vendors.filter(v => v.status === 'overdue').length,
    complianceRate: vendors.length > 0
      ? Math.round((vendors.filter(v => v.status === 'approved').length / vendors.length) * 100)
      : 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Track and manage vendor compliance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Vendor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Vendors', value: stats.total, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Compliance Rate', value: `${stats.complianceRate}%`, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Fully Compliant', value: stats.approved, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} rounded-lg p-2.5`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="partial">Partial</option>
              <option value="blocked">Blocked</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <VendorTable vendors={filteredVendors} onDelete={handleDelete} />
        </div>
      </div>

      {/* Add vendor modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Vendor</h2>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Acme Supplies LLC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ap@vendor.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="555-0100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Deadline</label>
                <input
                  type="date"
                  value={newVendor.deadline}
                  onChange={(e) => setNewVendor({ ...newVendor, deadline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingVendor}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {addingVendor ? 'Adding...' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
