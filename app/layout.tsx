import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promptless AI — AI that understands your intent before you ask",
  description:
    "A premium Chrome Extension and Next.js SaaS application that turns your browser into an intelligent agent. Automatically suggests relevant AI actions on LinkedIn and YouTube without chatbots or prompts.",
  keywords: [
    "Promptless AI",
    "Chrome Extension",
    "LinkedIn AI",
    "YouTube AI",
    "Intent Detection",
    "Zero-click AI",
  ],
  authors: [{ name: "Promptless AI Team" }],
  openGraph: {
    title: "Promptless AI — AI that understands your intent before you ask",
    description:
      "A premium Chrome Extension and Next.js SaaS application that turns your browser into an intelligent agent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark antialiased h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5] relative overflow-x-hidden font-sans">
        {/* Global Ambient Aurora Blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#4f8dff]/15 blur-[140px] animate-aurora-1" />
          <div className="absolute top-[20%] -right-[15%] w-[550px] h-[550px] rounded-full bg-[#8b5cf6]/15 blur-[160px] animate-aurora-2" />
          <div className="absolute -bottom-[20%] left-[25%] w-[500px] h-[500px] rounded-full bg-[#10b981]/10 blur-[150px] animate-aurora-1" />
        </div>

        {/* Global Subtle Noise Overlay */}
        <div className="fixed inset-0 -z-10 noise-bg pointer-events-none" />

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
