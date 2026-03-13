"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Vendor = {
  id: string;
  name: string;
  email: string;
  company: string;
  category: string;
  status: "pending" | "compliant" | "expired" | "incomplete";
  portal_slug: string;
  created_at: string;
  documents: Document[];
};

type Document = {
  id: string;
  vendor_id: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  status: "pending" | "approved" | "rejected" | "expired";
  expires_at: string | null;
  uploaded_at: string;
  reviewed_at: string | null;
  review_note: string | null;
};

type RequiredDoc = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  has_expiry: boolean;
};

const DEFAULT_DOC_TYPES: RequiredDoc[] = [
  { id: "w9", name: "W-9 Form", description: "IRS tax identification", required: true, has_expiry: false },
  { id: "coi", name: "Certificate of Insurance (COI)", description: "General liability & workers comp", required: true, has_expiry: true },
  { id: "business_license", name: "Business License", description: "State or local business license", required: true, has_expiry: true },
  { id: "safety_cert", name: "Safety Certification", description: "OSHA or industry-specific safety cert", required: false, has_expiry: true },
  { id: "nda", name: "Signed NDA", description: "Non-disclosure agreement", required: false, has_expiry: false },
];

export default function Dashboard() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [newVendor, setNewVendor] = useState({ name: "", email: "", company: "", category: "contractor" });

  const loadVendors = useCallback(async () => {
    const { data: vendorData } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });

    if (vendorData) {
      const vendorsWithDocs = await Promise.all(
        (vendorData as Vendor[]).map(async (v) => {
          const { data: docs } = await supabase
            .from("documents")
            .select("*")
            .eq("vendor_id", v.id);
          return { ...v, documents: (docs || []) as Document[] };
        })
      );
      setVendors(vendorsWithDocs);
    }
  }, []);

  useEffect(() => { loadVendors(); }, [loadVendors]);

  const addVendor = async () => {
    const slug = `${newVendor.company.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
    const { error } = await supabase.from("vendors").insert({
      name: newVendor.name,
      email: newVendor.email,
      company: newVendor.company,
      category: newVendor.category,
      status: "pending",
      portal_slug: slug,
    });
    if (!error) {
      setShowAddVendor(false);
      setNewVendor({ name: "", email: "", company: "", category: "contractor" });
      loadVendors();
    }
  };

  const reviewDocument = async (docId: string, status: "approved" | "rejected", note: string) => {
    await supabase.from("documents").update({
      status,
      reviewed_at: new Date().toISOString(),
      review_note: note,
    }).eq("id", docId);
    loadVendors();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "expired": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const filteredVendors = filter === "all" ? vendors : vendors.filter((v) => v.status === filter);

  const stats = {
    total: vendors.length,
    compliant: vendors.filter((v) => v.status === "compliant").length,
    pending: vendors.filter((v) => v.status === "pending").length,
    expired: vendors.filter((v) => v.status === "expired").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-sm">VG</div>
              <span className="text-xl font-bold text-white">VendorGate</span>
            </Link>
            <span className="text-slate-600 text-sm">/ Dashboard</span>
          </div>
          <button
            onClick={() => setShowAddVendor(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition"
          >
            + Add Vendor
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Vendors", value: stats.total, color: "text-white" },
            { label: "Compliant", value: stats.compliant, color: "text-green-400" },
            { label: "Pending Review", value: stats.pending, color: "text-yellow-400" },
            { label: "Expired Docs", value: stats.expired, color: "text-red-400" },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "compliant", "pending", "expired", "incomplete"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                filter === f ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Vendor List */}
        <div className="space-y-3">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-lg">No vendors yet. Add your first vendor to get started.</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => {
              const requiredDocs = DEFAULT_DOC_TYPES.filter((d) => d.required);
              const submittedCount = vendor.documents?.length || 0;
              const approvedCount = vendor.documents?.filter((d) => d.status === "approved").length || 0;

              return (
                <div
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300">
                        {vendor.company.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{vendor.company}</h3>
                        <p className="text-sm text-slate-400">{vendor.name} · {vendor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Documents</p>
                        <p className="text-sm font-mono text-white">{approvedCount}/{requiredDocs.length} approved</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${window.location.origin}/portal/${vendor.portal_slug}`;
                          navigator.clipboard.writeText(url);
                        }}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition"
                        title="Copy portal link"
                      >
                        🔗 Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Required Documents Config */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Required Documents</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {DEFAULT_DOC_TYPES.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{doc.name}</h4>
                  <p className="text-sm text-slate-400">{doc.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {doc.has_expiry && <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Has Expiry</span>}
                  <span className={`text-xs px-2 py-1 rounded ${doc.required ? "bg-blue-500/10 text-blue-400" : "bg-slate-600/50 text-slate-400"}`}>
                    {doc.required ? "Required" : "Optional"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Add New Vendor</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Contact Name</label>
                <input
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Email</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@vendor.com"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Company Name</label>
                <input
                  value={newVendor.company}
                  onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Services LLC"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <select
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="contractor">Contractor</option>
                  <option value="supplier">Supplier</option>
                  <option value="consultant">Consultant</option>
                  <option value="subcontractor">Subcontractor</option>
                  <option value="service_provider">Service Provider</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddVendor(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={addVendor}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedVendor.company}</h2>
                <p className="text-sm text-slate-400">{selectedVendor.name} · {selectedVendor.email}</p>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
              <p className="text-sm text-slate-400">
                Vendor Portal: <code className="text-blue-400">{typeof window !== "undefined" ? `${window.location.origin}/portal/${selectedVendor.portal_slug}` : ""}</code>
              </p>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">Document Status</h3>
            <div className="space-y-3">
              {DEFAULT_DOC_TYPES.map((docType) => {
                const submitted = selectedVendor.documents?.find((d) => d.doc_type === docType.id);
                return (
                  <div key={docType.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{docType.name}</h4>
                      <p className="text-xs text-slate-500">{docType.description}</p>
                      {submitted && submitted.expires_at && (
                        <p className="text-xs text-yellow-400 mt-1">Expires: {new Date(submitted.expires_at).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {submitted ? (
                        <>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(submitted.status)}`}>
                            {submitted.status}
                          </span>
                          {submitted.status === "pending" && (
                            <>
                              <button
                                onClick={() => reviewDocument(submitted.id, "approved", "Verified and approved")}
                                className="px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-xs transition"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => reviewDocument(submitted.id, "rejected", "Document does not meet requirements")}
                                className="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition"
                              >
                                ✗ Reject
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">Not submitted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
