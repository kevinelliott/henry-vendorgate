"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type VendorInfo = {
  id: string;
  name: string;
  company: string;
  status: string;
};

type DocSubmission = {
  id: string;
  doc_type: string;
  file_name: string;
  status: string;
  uploaded_at: string;
  expires_at: string | null;
  review_note: string | null;
};

const DOC_TYPES = [
  { id: "w9", name: "W-9 Form", description: "IRS tax identification form", has_expiry: false, required: true },
  { id: "coi", name: "Certificate of Insurance", description: "General liability & workers compensation certificate", has_expiry: true, required: true },
  { id: "business_license", name: "Business License", description: "State or local business license", has_expiry: true, required: true },
  { id: "safety_cert", name: "Safety Certification", description: "OSHA or industry-specific safety certification", has_expiry: true, required: false },
  { id: "nda", name: "Signed NDA", description: "Non-disclosure agreement", has_expiry: false, required: false },
];

export default function VendorPortal() {
  const params = useParams();
  const slug = params.slug as string;
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [submissions, setSubmissions] = useState<DocSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);

  const loadVendor = useCallback(async () => {
    const { data: vendorData } = await supabase
      .from("vendors")
      .select("id, name, company, status")
      .eq("portal_slug", slug)
      .single();

    if (vendorData) {
      setVendor(vendorData as VendorInfo);
      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .eq("vendor_id", (vendorData as VendorInfo).id);
      setSubmissions((docs || []) as DocSubmission[]);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => { loadVendor(); }, [loadVendor]);

  const handleUpload = async (docTypeId: string) => {
    if (!vendor || !fileInputRef.current?.files?.[0]) return;
    const file = fileInputRef.current.files[0];
    setUploading(docTypeId);

    const fileName = `${vendor.id}/${docTypeId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("vendor-documents")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed. Please try again.");
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("vendor-documents").getPublicUrl(fileName);

    const docType = DOC_TYPES.find((d) => d.id === docTypeId);
    await supabase.from("documents").insert({
      vendor_id: vendor.id,
      doc_type: docTypeId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      status: "pending",
      expires_at: docType?.has_expiry && expiryDate ? expiryDate : null,
      uploaded_at: new Date().toISOString(),
    });

    setUploading(null);
    setExpiryDate("");
    setActiveDocType(null);
    loadVendor();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold text-white mb-2">Portal Not Found</h1>
          <p className="text-slate-400">This vendor portal link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const requiredDocs = DOC_TYPES.filter((d) => d.required);
  const requiredSubmitted = requiredDocs.filter((d) => submissions.some((s) => s.doc_type === d.id && s.status !== "rejected"));
  const allRequiredApproved = requiredDocs.every((d) => submissions.some((s) => s.doc_type === d.id && s.status === "approved"));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-2xl font-bold text-white mb-4">VG</div>
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Compliance Portal</h1>
          <p className="text-slate-400">{vendor.company} — {vendor.name}</p>
        </div>

        {/* Status Banner */}
        <div className={`p-4 rounded-xl mb-8 text-center ${
          allRequiredApproved
            ? "bg-green-500/10 border border-green-500/20"
            : "bg-yellow-500/10 border border-yellow-500/20"
        }`}>
          {allRequiredApproved ? (
            <p className="text-green-400 font-medium">✅ All required documents approved — you&apos;re compliant!</p>
          ) : (
            <p className="text-yellow-400 font-medium">
              📋 {requiredSubmitted.length}/{requiredDocs.length} required documents submitted.
              Please upload all required documents below.
            </p>
          )}
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {DOC_TYPES.map((docType) => {
            const submission = submissions.find((s) => s.doc_type === docType.id);
            const isActive = activeDocType === docType.id;

            return (
              <div key={docType.id} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{docType.name}</h3>
                      {docType.required && (
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{docType.description}</p>
                  </div>
                  {submission ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      submission.status === "approved" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      submission.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {submission.status === "approved" ? "✓ Approved" :
                       submission.status === "rejected" ? "✗ Rejected" :
                       "⏳ Pending Review"}
                    </span>
                  ) : null}
                </div>

                {submission && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-900/50 text-sm">
                    <p className="text-slate-300">📎 {submission.file_name}</p>
                    <p className="text-slate-500 text-xs mt-1">Uploaded {new Date(submission.uploaded_at).toLocaleDateString()}</p>
                    {submission.expires_at && (
                      <p className="text-yellow-400 text-xs mt-1">Expires: {new Date(submission.expires_at).toLocaleDateString()}</p>
                    )}
                    {submission.review_note && (
                      <p className={`text-xs mt-2 ${submission.status === "rejected" ? "text-red-400" : "text-green-400"}`}>
                        Note: {submission.review_note}
                      </p>
                    )}
                  </div>
                )}

                {(!submission || submission.status === "rejected") && (
                  <div className="mt-3">
                    {isActive ? (
                      <div className="space-y-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm file:cursor-pointer hover:file:bg-blue-700"
                        />
                        {docType.has_expiry && (
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">Expiration Date</label>
                            <input
                              type="date"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpload(docType.id)}
                            disabled={uploading === docType.id}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition disabled:opacity-50"
                          >
                            {uploading === docType.id ? "Uploading..." : "Upload Document"}
                          </button>
                          <button
                            onClick={() => setActiveDocType(null)}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveDocType(docType.id)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition"
                      >
                        {submission?.status === "rejected" ? "Re-upload Document" : "Upload Document"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">Powered by <span className="text-slate-400">VendorGate</span></p>
          <p className="text-xs text-slate-600 mt-1">Your documents are stored securely and only shared with the requesting organization.</p>
        </div>
      </div>
    </div>
  );
}
