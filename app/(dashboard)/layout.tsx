import * as React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Pro Dashboard | Promptless AI",
  description:
    "Manage your generated LinkedIn cover letters, tailored resumes, and YouTube video study notes.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
      {children}
    </div>
  );
}
