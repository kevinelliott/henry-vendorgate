import { Shield, FileText, DollarSign, Bell, BarChart2, Users, CheckCircle, Clock, Lock, Zap } from 'lucide-react'

export default function FeaturesPage() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Built for AP Teams Who Can&apos;t Afford Compliance Gaps
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Every feature in VendorGate is designed to eliminate vendor compliance risk and automate the paperwork chase.
        </p>
      </section>

      {/* Bento grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Large feature card */}
          <div className="lg:col-span-2 bg-indigo-600 text-white rounded-2xl p-8 flex flex-col justify-between min-h-[240px] animate-[fadeIn_0.5s_ease-in]">
            <Shield className="h-10 w-10 mb-4 opacity-80" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Payment Blocking Engine</h3>
              <p className="text-indigo-100 leading-relaxed">
                Vendors stay on payment hold until every single compliance requirement is met and approved.
                AP teams get a real-time dashboard showing exactly who&apos;s blocked and why.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-[fadeIn_0.6s_ease-in]">
            <FileText className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Document Upload Portal</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Vendors get a branded, mobile-responsive portal. Drag-and-drop uploads for W-9s, COIs, NDAs, bank details, and licenses.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-[fadeIn_0.7s_ease-in]">
            <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">One-Click Approval</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Review and approve or reject each document individually. Rejected docs instantly notify vendors with feedback.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 animate-[fadeIn_0.8s_ease-in]">
            <Bell className="h-8 w-8 text-amber-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Automated Reminders</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Deadline-based email reminders keep vendors moving. Escalation emails when deadlines approach or pass.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-[fadeIn_0.9s_ease-in]">
            <BarChart2 className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Compliance Reports</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Audit-ready reports with compliance rates, overdue history, approval timelines, and document archives.
            </p>
          </div>

          {/* Wide card */}
          <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-2xl p-8 animate-[fadeIn_1s_ease-in]">
            <div className="flex items-start gap-6">
              <Users className="h-10 w-10 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Invite your AP team, procurement managers, and legal reviewers. Each person sees exactly what they need.
                  Audit log tracks every approval, rejection, and status change.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 animate-[fadeIn_1.1s_ease-in]">
            <Lock className="h-8 w-8 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Token Links</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each vendor gets a unique, tamper-proof onboarding link. No vendor login required — just a secure URL.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-[fadeIn_1.2s_ease-in]">
            <Clock className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deadline Tracking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Set compliance deadlines per vendor. Automatic status changes to &quot;Overdue&quot; when deadlines pass.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-[fadeIn_1.3s_ease-in]">
            <Zap className="h-8 w-8 text-yellow-600 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">API + MCP Access</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Full REST API for integrations. MCP endpoint for AI agents — check compliance, list vendors, update statuses programmatically.
            </p>
          </div>

        </div>
      </section>

      {/* Requirements breakdown */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Compliance requirements VendorGate tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { type: 'W-9', icon: '📋', desc: 'IRS tax form with TIN' },
              { type: 'COI', icon: '🛡️', desc: 'Certificate of Insurance' },
              { type: 'Terms/NDA', icon: '✍️', desc: 'Signed agreements' },
              { type: 'Bank Details', icon: '🏦', desc: 'ACH routing & account' },
              { type: 'License', icon: '📄', desc: 'Business license' },
            ].map((req) => (
              <div key={req.type} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                <div className="text-3xl mb-2">{req.icon}</div>
                <p className="font-semibold text-gray-900">{req.type}</p>
                <p className="text-sm text-gray-500 mt-1">{req.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
