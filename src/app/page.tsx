"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-sm">VG</div>
          <span className="text-xl font-bold text-white">VendorGate</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-slate-400 hover:text-white transition text-sm">Features</Link>
          <Link href="#pricing" className="text-slate-400 hover:text-white transition text-sm">Pricing</Link>
          <Link href="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition">Dashboard</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          Vendor compliance on autopilot
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Stop chasing vendors<br />for compliance docs
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Create a branded onboarding portal. Set your document requirements. Vendors self-serve.
          Track expirations automatically. Stay audit-ready — always.
        </p>
        <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
          {!submitted ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition">
                Get Early Access
              </button>
            </>
          ) : (
            <div className="w-full text-center py-3 px-6 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
              ✓ You&apos;re on the list! We&apos;ll be in touch.
            </div>
          )}
        </form>
      </section>

      {/* Problem/Solution */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10">
            <h3 className="text-lg font-semibold text-red-400 mb-4">😩 Without VendorGate</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex gap-3"><span className="text-red-400">✗</span> Chasing vendors via email for W-9s and COIs</li>
              <li className="flex gap-3"><span className="text-red-400">✗</span> Expired insurance certificates you didn&apos;t catch</li>
              <li className="flex gap-3"><span className="text-red-400">✗</span> Spreadsheets tracking compliance status</li>
              <li className="flex gap-3"><span className="text-red-400">✗</span> Audit panic — scrambling to locate documents</li>
              <li className="flex gap-3"><span className="text-red-400">✗</span> Vendors paid before compliance is verified</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl bg-green-500/5 border border-green-500/10">
            <h3 className="text-lg font-semibold text-green-400 mb-4">✅ With VendorGate</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex gap-3"><span className="text-green-400">✓</span> Branded portal — vendors upload docs themselves</li>
              <li className="flex gap-3"><span className="text-green-400">✓</span> Automatic expiration tracking & renewal alerts</li>
              <li className="flex gap-3"><span className="text-green-400">✓</span> One dashboard with every vendor&apos;s compliance status</li>
              <li className="flex gap-3"><span className="text-green-400">✓</span> Audit-ready document vault with full history</li>
              <li className="flex gap-3"><span className="text-green-400">✓</span> Approval gates — vendors can&apos;t be cleared without all docs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything you need to manage vendor compliance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "📋", title: "Custom Requirements", desc: "Define exactly which documents each vendor type must submit. W-9, COI, business license, safety certs — whatever your business needs." },
            { icon: "🔗", title: "Branded Vendor Portal", desc: "Each vendor gets a unique link to submit their documents. No accounts needed. Professional and on-brand." },
            { icon: "🔒", title: "Approval Gates", desc: "Vendors can't be marked 'approved' until every required document is submitted and verified. Enforcement built in." },
            { icon: "⏰", title: "Expiration Tracking", desc: "Insurance certificates, licenses, and certs all expire. VendorGate tracks dates and alerts you before they lapse." },
            { icon: "📁", title: "Document Vault", desc: "Every uploaded document is stored securely with version history. Download any time. Always audit-ready." },
            { icon: "📊", title: "Compliance Dashboard", desc: "See every vendor's status at a glance. Filter by compliant, pending, expired. Export for auditors." },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="space-y-8">
          {[
            { step: "1", title: "Set your requirements", desc: "Choose which document types each vendor category must submit. Set expiration rules." },
            { step: "2", title: "Invite vendors", desc: "Send each vendor a unique portal link. They upload their documents directly — no app install needed." },
            { step: "3", title: "Review & approve", desc: "Documents appear in your dashboard. Review, request corrections, or approve. Vendors are blocked until compliant." },
            { step: "4", title: "Stay compliant", desc: "VendorGate tracks expirations and sends renewal reminders. You never miss a lapsed certificate again." },
          ].map((s, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">{s.step}</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free. Scale as your vendor network grows.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter",
              price: "$0",
              period: "forever",
              desc: "For small teams getting started",
              features: ["Up to 10 vendors", "3 document types", "Basic compliance dashboard", "Email notifications", "90-day document retention"],
              cta: "Start Free",
              highlight: false,
            },
            {
              name: "Professional",
              price: "$29",
              period: "/month",
              desc: "For growing businesses",
              features: ["Up to 100 vendors", "Unlimited document types", "Custom branded portal", "Expiration tracking & alerts", "Audit export (CSV/PDF)", "Priority support"],
              cta: "Start 14-Day Trial",
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "$99",
              period: "/month",
              desc: "For large organizations",
              features: ["Unlimited vendors", "Multi-team management", "SSO & advanced security", "API access & webhooks", "Custom compliance workflows", "Dedicated account manager"],
              cta: "Contact Sales",
              highlight: false,
            },
          ].map((p, i) => (
            <div key={i} className={`p-8 rounded-2xl border ${p.highlight ? "bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20" : "bg-slate-800/50 border-slate-700/50"}`}>
              <h3 className="text-lg font-semibold text-white mb-1">{p.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{p.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-slate-400 text-sm">{p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex gap-2 text-sm text-slate-300">
                    <span className="text-blue-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2.5 rounded-lg font-medium transition ${p.highlight ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700 hover:bg-slate-600 text-slate-300"}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center font-bold text-white text-xs">VG</div>
            <span className="text-sm text-slate-400">VendorGate</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 VendorGate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
