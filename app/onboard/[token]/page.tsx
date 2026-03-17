'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import RequirementUpload from '@/components/requirement-upload'
import { Shield, CheckCircle, Lock } from 'lucide-react'

interface Requirement {
  id: string
  type: string
  status: 'pending' | 'submitted' | 'approved' | 'rejected'
  file_url?: string
  metadata?: Record<string, unknown>
}

interface Vendor {
  id: string
  name: string
  email: string
  deadline?: string
  requirements?: Requirement[]
}

const requirementConfig = {
  w9: { label: 'W-9 Tax Form', desc: 'IRS W-9 form with your Tax Identification Number', icon: '📋' },
  coi: { label: 'Certificate of Insurance', desc: 'Proof of business insurance coverage', icon: '🛡️' },
  terms: { label: 'Terms & NDA Agreement', desc: 'Review and sign our vendor agreement', icon: '✍️' },
  bank: { label: 'Bank Details', desc: 'ACH routing and account number for payment', icon: '🏦' },
  license: { label: 'Business License', desc: 'Valid business license or registration', icon: '📄' },
}

export default function OnboardPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [bankDetails, setBankDetails] = useState({ routing: '', account: '', saved: false })
  const [signature, setSignature] = useState({ name: '', timestamp: '', signed: false })
  const [coiExpiry, setCoiExpiry] = useState({ date: '', saved: false })
  const [licenseDetails, setLicenseDetails] = useState({ number: '', expiry: '', saved: false })

  useEffect(() => {
    loadVendor()
  }, [token])

  const loadVendor = async () => {
    try {
      const supabase = getSupabase()
      const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*, requirements(*)')
        .eq('token', token)
        .single()

      if (error || !vendor) {
        setNotFound(true)
        return
      }
      setVendor(vendor)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const getRequirement = (type: string) =>
    vendor?.requirements?.find(r => r.type === type)

  const isCompleted = (type: string) => {
    const req = getRequirement(type)
    return req?.status === 'submitted' || req?.status === 'approved'
  }

  const handleFileUpload = async (type: string, file: File) => {
    if (!vendor) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('vendor_id', vendor.id)
    formData.append('requirement_type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Upload failed')
    }

    await loadVendor()
  }

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return
    const req = getRequirement('bank')
    if (!req) return

    const supabase = getSupabase()
    await supabase.from('requirements').update({
      status: 'submitted',
      metadata: {
        routing: bankDetails.routing,
        account_last4: bankDetails.account.slice(-4),
      },
      submitted_at: new Date().toISOString(),
    }).eq('id', req.id)

    setBankDetails({ ...bankDetails, saved: true })
    await loadVendor()
  }

  const handleSignature = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return
    const req = getRequirement('terms')
    if (!req) return

    const ts = new Date().toISOString()
    const supabase = getSupabase()
    await supabase.from('requirements').update({
      status: 'submitted',
      metadata: { signed_by: signature.name, signed_at: ts },
      submitted_at: ts,
    }).eq('id', req.id)

    setSignature({ ...signature, timestamp: ts, signed: true })
    await loadVendor()
  }

  const completedCount = vendor?.requirements?.filter(r =>
    r.status === 'submitted' || r.status === 'approved'
  ).length ?? 0
  const totalCount = vendor?.requirements?.length ?? 0
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const allComplete = completedCount === totalCount && totalCount > 0

  useEffect(() => {
    if (allComplete && vendor) {
      router.push(`/onboard/${token}/success`)
    }
  }, [allComplete, vendor, token, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid onboarding link</h1>
          <p className="text-gray-600">This onboarding link is invalid or has expired. Please contact the company that sent you this link.</p>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-gray-900">VendorGate</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className="text-gray-600 text-sm">Vendor Onboarding Portal</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Welcome */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            Welcome, {vendor?.name}
          </h1>
          <p className="text-gray-600 text-sm">
            Please complete all compliance requirements below to get approved for payment.
            {vendor?.deadline && (
              <span className="text-orange-600 font-medium"> Deadline: {new Date(vendor.deadline).toLocaleDateString()}</span>
            )}
          </p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600 font-medium">{completedCount} of {totalCount} requirements completed</span>
              <span className="text-indigo-600 font-semibold">{Math.round(progressPct)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-4">

          {/* W-9 */}
          <RequirementSection
            type="w9"
            isCompleted={isCompleted('w9')}
            status={getRequirement('w9')?.status}
          >
            <RequirementUpload
              label="W-9 Form"
              onUpload={(file) => handleFileUpload('w9', file)}
              isCompleted={isCompleted('w9')}
            />
          </RequirementSection>

          {/* COI */}
          <RequirementSection
            type="coi"
            isCompleted={isCompleted('coi')}
            status={getRequirement('coi')?.status}
          >
            <div className="space-y-3">
              <RequirementUpload
                label="Certificate of Insurance"
                onUpload={(file) => handleFileUpload('coi', file)}
                isCompleted={isCompleted('coi')}
              />
              {!isCompleted('coi') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Policy Expiration Date</label>
                  <input
                    type="date"
                    value={coiExpiry.date}
                    onChange={(e) => setCoiExpiry({ ...coiExpiry, date: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </RequirementSection>

          {/* Terms/NDA */}
          <RequirementSection
            type="terms"
            isCompleted={isCompleted('terms')}
            status={getRequirement('terms')?.status}
          >
            {!isCompleted('terms') ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 h-40 overflow-y-auto leading-relaxed">
                  <h4 className="font-semibold mb-2">Vendor Agreement & Non-Disclosure Agreement</h4>
                  <p className="mb-2">This Vendor Agreement (&quot;Agreement&quot;) is entered into between the company (&quot;Company&quot;) and the vendor completing this form (&quot;Vendor&quot;).</p>
                  <p className="mb-2">1. <strong>Services.</strong> Vendor agrees to provide services as directed by Company in accordance with all applicable laws and regulations.</p>
                  <p className="mb-2">2. <strong>Confidentiality.</strong> Vendor shall keep all Company information strictly confidential and shall not disclose any proprietary information to third parties.</p>
                  <p className="mb-2">3. <strong>Compliance.</strong> Vendor agrees to maintain all required licenses, insurance, and tax compliance documents as requested by Company.</p>
                  <p>4. <strong>Governing Law.</strong> This Agreement shall be governed by the laws of the applicable jurisdiction.</p>
                </div>
                <form onSubmit={handleSignature} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type your full legal name to sign
                    </label>
                    <input
                      type="text"
                      required
                      value={signature.name}
                      onChange={(e) => setSignature({ ...signature, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your Full Legal Name"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                  >
                    I agree — Sign Agreement
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium text-sm">Agreement signed successfully</span>
              </div>
            )}
          </RequirementSection>

          {/* Bank Details */}
          <RequirementSection
            type="bank"
            isCompleted={isCompleted('bank')}
            status={getRequirement('bank')?.status}
          >
            {!isCompleted('bank') ? (
              <form onSubmit={handleBankSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{9}"
                    maxLength={9}
                    value={bankDetails.routing}
                    onChange={(e) => setBankDetails({ ...bankDetails, routing: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="9-digit routing number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={bankDetails.account}
                    onChange={(e) => setBankDetails({ ...bankDetails, account: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Account number"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" />
                  Bank details are encrypted and only your account number&apos;s last 4 digits are stored visibly.
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Save Bank Details
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium text-sm">Bank details saved securely</span>
              </div>
            )}
          </RequirementSection>

          {/* Business License */}
          <RequirementSection
            type="license"
            isCompleted={isCompleted('license')}
            status={getRequirement('license')?.status}
          >
            <div className="space-y-3">
              <RequirementUpload
                label="Business License"
                onUpload={(file) => handleFileUpload('license', file)}
                isCompleted={isCompleted('license')}
              />
              {!isCompleted('license') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      value={licenseDetails.number}
                      onChange={(e) => setLicenseDetails({ ...licenseDetails, number: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="LIC-12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={licenseDetails.expiry}
                      onChange={(e) => setLicenseDetails({ ...licenseDetails, expiry: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </RequirementSection>

        </div>
      </div>
    </main>
  )
}

function RequirementSection({
  type,
  isCompleted,
  status,
  children,
}: {
  type: string
  isCompleted: boolean
  status?: string
  children: React.ReactNode
}) {
  const config = requirementConfig[type as keyof typeof requirementConfig]

  return (
    <div className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
      isCompleted ? 'border-green-200' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{config.label}</h3>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <CheckCircle className="h-4 w-4" />
                {status === 'approved' ? 'Approved' : 'Submitted'}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{config.desc}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
