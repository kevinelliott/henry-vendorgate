'use client'

import { useState } from 'react'
import Link from 'next/link'
import StatusBadge from './status-badge'
import { ExternalLink, Copy, Trash2 } from 'lucide-react'

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

interface VendorTableProps {
  vendors: Vendor[]
  onDelete?: (id: string) => void
}

export default function VendorTable({ vendors, onDelete }: VendorTableProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyOnboardLink = (token: string) => {
    const url = `${window.location.origin}/onboard/${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const getProgressText = (requirements?: Requirement[]) => {
    if (!requirements) return '—'
    const completed = requirements.filter(r => r.status === 'approved').length
    return `${completed}/${requirements.length}`
  }

  const isPaymentHeld = (status: string) => ['blocked', 'partial', 'overdue'].includes(status)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Progress</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Deadline</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                  <p className="text-gray-500 text-xs">{vendor.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={vendor.status} size="sm" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{
                        width: vendor.requirements
                          ? `${(vendor.requirements.filter(r => r.status === 'approved').length / vendor.requirements.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="text-gray-600 text-xs">{getProgressText(vendor.requirements)}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 text-xs">
                {vendor.deadline
                  ? new Date(vendor.deadline).toLocaleDateString()
                  : '—'}
              </td>
              <td className="py-3 px-4">
                {isPaymentHeld(vendor.status) ? (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    🚫 Payment Hold
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    ✓ Cleared
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => copyOnboardLink(vendor.token)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Copy onboarding link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copiedToken === vendor.token && (
                    <span className="text-xs text-green-600 absolute">Copied!</span>
                  )}
                  <Link
                    href={`/dashboard/vendors/${vendor.id}`}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(vendor.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete vendor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-500">
                No vendors found. Add your first vendor to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
