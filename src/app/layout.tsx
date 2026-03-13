import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VendorGate — Vendor Compliance & Onboarding Portal",
  description: "Automate vendor onboarding. Require W-9s, COIs, and compliance docs before vendors get approved. Track expirations. Stay audit-ready.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
