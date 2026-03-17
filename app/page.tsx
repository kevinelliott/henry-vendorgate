import Link from 'next/link'
import { Shield, CheckCircle, FileText, DollarSign, Bell, BarChart2, Users } from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <Shield className="h-4 w-4" />
          Compliance-first vendor management
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Stop chasing vendors<br />for paperwork.
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Every unpaid vendor is a compliance risk. Every missing W-9 is a tax penalty waiting to happen.
          VendorGate blocks payment until vendors are fully compliant — W-9, insurance, signed terms, bank details.
          All verified. All tracked. All automatic.
        </p>

        {/* Stat callout */}
        <div className="inline-block bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-10">
          <p className="text-amber-900 font-semibold text-base">
            💡 IRS penalties for missing W-9s: $310 per form.
            <span className="text-amber-700 font-bold"> With 50 vendors, that&apos;s $15,500 in potential fines.</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            href="/features"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-gray-50 py-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <span>✅ No credit card required</span>
          <span>✅ Setup in minutes</span>
          <span>✅ GDPR compliant</span>
          <span>✅ SOC 2 ready</span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to stay compliant
          </h2>
          <p className="text-lg text-gray-600">
            VendorGate automates the entire vendor compliance workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Payment Blocking',
              desc: 'Automatically block payments for non-compliant vendors. AP team sees real-time compliance status.',
            },
            {
              icon: FileText,
              title: 'Document Portal',
              desc: 'Vendors get a branded, mobile-friendly portal to upload W-9s, COIs, signed NDAs, and bank details.',
            },
            {
              icon: CheckCircle,
              title: 'One-click Approval',
              desc: 'AP team reviews and approves each document. Rejected docs trigger instant vendor notification.',
            },
            {
              icon: Bell,
              title: 'Automated Reminders',
              desc: 'Deadline-based reminders keep vendors on track. Escalation emails when deadlines approach.',
            },
            {
              icon: BarChart2,
              title: 'Compliance Reports',
              desc: 'Audit-ready reports showing vendor compliance rates, overdue requirements, and approval history.',
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              desc: 'Multiple team members can manage vendors. Role-based access for AP, procurement, and legal.',
            },
          ].map((feature) => (
            <div key={feature.title} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How VendorGate works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Add Vendor', desc: 'Enter vendor name, email, and set compliance requirements' },
              { step: '2', title: 'Send Link', desc: 'Vendor receives a secure onboarding link — no login needed' },
              { step: '3', title: 'Vendor Submits', desc: 'Vendor uploads documents through the branded portal' },
              { step: '4', title: 'Payment Released', desc: 'Once all requirements are approved, payment hold is lifted' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to close the compliance gap?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join hundreds of AP teams using VendorGate to eliminate vendor compliance risk.
        </p>
        <Link
          href="/auth/login"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors inline-block"
        >
          Start Free Trial — No Credit Card Required
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-gray-900">VendorGate</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/features" className="hover:text-gray-700">Features</Link>
            <Link href="/pricing" className="hover:text-gray-700">Pricing</Link>
            <Link href="/docs" className="hover:text-gray-700">Docs</Link>
          </div>
          <p className="text-sm text-gray-400">© 2024 VendorGate. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
