import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VEO CRM – Quản lý nội bộ",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface">{children}</div>;
}
