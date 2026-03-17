'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import StatusBadge from '@/components/status-badge'
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, Copy } from 'lucide-react'

interface Requirement {
  id: string
  type: string
  status: 'pending' | 'submitted' | 'approved' | 'rejected'
  file_url?: string
  metadata?: Record<string, unknown>
  submitted_at?: string
  reviewed_at?: string
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

const requirementLabels: Record<string, string> = {
  w9: 'W-9 Tax Form',
  coi: 'Certificate of Insurance',
  terms: 'Terms / NDA',
  bank: 'Bank Details',
  license: 'Business License',
}

export default function VendorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params.id as string

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    checkAuthAndLoad()
  }, [vendorId])

  const checkAuthAndLoad = async () => {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    await loadVendor()
  }

  const loadVendor = async () => {
    try {
      const response = await fetch(`/api/v1/vendors/${vendorId}`)
      const data = await response.json()
      if (data.vendor) setVendor(data.vendor)
    } catch (err) {
      console.error('Failed to load vendor:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRequirementAction = async (requirementId: string, action: 'approved' | 'rejected') => {
    setUpdating(requirementId)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(`/api/v1/vendors/${vendorId}/requirements`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ requirementId, status: action }),
      })
      if (response.ok) {
        await loadVendor()
      }
    } catch (err) {
      console.error('Failed to update requirement:', err)
    } finally {
      setUpdating(null)
    }
  }

  const copyOnboardLink = () => {
    if (!vendor) return
    navigator.clipboard.writeText(`${window.location.origin}/onboard/${vendor.token}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vendor not found</p>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const completedRequirements = vendor.requirements?.filter(r => r.status === 'approved').length ?? 0
  const totalRequirements = vendor.requirements?.length ?? 0

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Vendor info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{vendor.name}</h1>
              <p className="text-gray-600">{vendor.email}</p>
              {vendor.phone && <p className="text-gray-600 text-sm">{vendor.phone}</p>}
            </div>
            <StatusBadge status={vendor.status} />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-gray-500">Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: totalRequirements > 0 ? `${(completedRequirements / totalRequirements) * 100}%` : '0%' }}
                  />
                </div>
                <span className="font-medium text-gray-900">{completedRequirements}/{totalRequirements}</span>
              </div>
            </div>
            {vendor.deadline && (
              <div>
                <span className="text-gray-500">Deadline</span>
                <p className="font-medium text-gray-900 mt-1">{new Date(vendor.deadline).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Added</span>
              <p className="font-medium text-gray-900 mt-1">{new Date(vendor.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={copyOnboardLink}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg"
            >
              <Copy className="h-4 w-4" />
              Copy onboarding link
            </button>
            <Link
              href={`/onboard/${vendor.token}`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              <ExternalLink className="h-4 w-4" />
              Preview portal
            </Link>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Requirements</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {vendor.requirements?.map((req) => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{requirementLabels[req.type] || req.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={req.status} size="sm" />
                    {req.submitted_at && (
                      <span className="text-xs text-gray-400">
                        Submitted {new Date(req.submitted_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {req.file_url && (
                    <a
                      href={req.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 block"
                    >
                      View document →
                    </a>
                  )}
                </div>

                {req.status === 'submitted' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequirementAction(req.id, 'approved')}
                      disabled={updating === req.id}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRequirementAction(req.id, 'rejected')}
                      disabled={updating === req.id}
                      className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
