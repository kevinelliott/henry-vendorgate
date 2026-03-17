import Link from 'next/link'
import { CheckCircle, Shield } from 'lucide-react'

export default function OnboardSuccessPage() {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Onboarding Complete!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You&apos;ve successfully submitted all required compliance documents.
            Our team will review and approve each document. You&apos;ll receive an email
            once everything is verified and your payment is cleared.
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 mb-8 text-left">
            <h3 className="font-semibold text-indigo-900 mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-indigo-800">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Our AP team reviews each submitted document (typically within 1-2 business days)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>You&apos;ll receive email confirmation once documents are approved</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Once all requirements are approved, your payment hold is removed</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Payments will be processed according to the agreed terms</span>
              </li>
            </ol>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield className="h-4 w-4" />
            <span>Powered by VendorGate</span>
          </div>
        </div>
      </div>
    </main>
  )
}
