import Link from 'next/link'
import { CheckCircle, X } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 5 vendors',
      '3 requirement types',
      'Vendor onboarding portal',
      'Email notifications',
      'Basic dashboard',
    ],
    missing: ['Document storage', 'Compliance reports', 'API access', 'Team members', 'Priority support'],
    cta: 'Get started free',
    href: '/auth/login',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    description: 'For growing AP teams managing dozens of vendors',
    features: [
      'Up to 50 vendors',
      'All 5 requirement types',
      'Document storage (10GB)',
      'Compliance reports & exports',
      'Automated reminders',
      'CSV exports',
      'Email support',
    ],
    missing: ['Unlimited vendors', 'API access', 'Team members', 'Priority support'],
    cta: 'Start Pro trial',
    href: '/auth/login',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$69',
    period: '/mo',
    description: 'For large teams with complex compliance needs',
    features: [
      'Unlimited vendors',
      'All requirement types',
      'Unlimited document storage',
      'Full compliance reports',
      'REST API + MCP access',
      'Team members (unlimited)',
      'Priority support',
      'Custom requirements',
      'Audit logs',
    ],
    missing: [],
    cta: 'Contact sales',
    href: '/auth/login',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-600">Start free. Scale as your vendor roster grows.</p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-indigo-600 text-white shadow-xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <div className="mb-6">
                {plan.highlight && (
                  <span className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                    MOST POPULAR
                  </span>
                )}
                <h2 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h2>
                <div className="flex items-end gap-1 mt-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-green-600'}`} />
                    <span className={plan.highlight ? 'text-indigo-100' : 'text-gray-700'}>{feature}</span>
                  </li>
                ))}
                {plan.missing.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm opacity-40">
                    <X className="h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center font-semibold py-3 px-6 rounded-xl transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          How VendorGate compares
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-700 border-b border-gray-200">Feature</th>
                <th className="text-center p-4 font-semibold text-indigo-600 border-b border-gray-200 bg-indigo-50">VendorGate</th>
                <th className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">Coupa</th>
                <th className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">SAP Ariba</th>
                <th className="text-center p-4 font-semibold text-gray-700 border-b border-gray-200">Precoro</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Price', values: ['$29/mo', '$$$$', '$$$$', '$249/mo'] },
                { feature: 'Vendor Portal', values: ['✅', '✅', '✅', '✅'] },
                { feature: 'Setup Time', values: ['Minutes', 'Months', 'Months', 'Weeks'] },
                { feature: 'Small Business', values: ['✅', '❌', '❌', '⚠️'] },
                { feature: 'Payment Blocking', values: ['✅', '⚠️', '⚠️', '❌'] },
                { feature: 'No Contract', values: ['✅', '❌', '❌', '❌'] },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-gray-100 last:border-0">
                  <td className="p-4 font-medium text-gray-700">{row.feature}</td>
                  {row.values.map((val, i) => (
                    <td key={i} className={`p-4 text-center ${i === 0 ? 'bg-indigo-50 font-semibold text-indigo-900' : 'text-gray-600'}`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can vendors complete onboarding without creating an account?',
                a: 'Yes — vendors get a unique secure link and never need to create an account. This removes friction and speeds up compliance.',
              },
              {
                q: 'What happens when a vendor fails to meet the deadline?',
                a: 'The vendor status automatically changes to "Overdue" and the payment hold remains. You can extend deadlines or re-send the onboarding link.',
              },
              {
                q: 'Can I customize which requirements are needed per vendor?',
                a: 'Yes — on the Pro and Enterprise plans you can enable or disable specific requirements per vendor.',
              },
              {
                q: 'Is there an API for integrating with our ERP?',
                a: 'Yes — Enterprise plan includes a full REST API and MCP endpoint for AI agent integrations.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
