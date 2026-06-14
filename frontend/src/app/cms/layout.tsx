import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VEO CMS",
  robots: { index: false, follow: false },
};

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
