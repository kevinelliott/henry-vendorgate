import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VendorGate — Vendor Compliance Gatekeeper",
  description: "Block payments until vendors are fully compliant. W-9, insurance, signed terms, bank details — all verified, all tracked, all automatic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
