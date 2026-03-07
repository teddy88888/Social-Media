"use client";

import { BottomNav } from "@/components/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Area Konten Utama */}
      <main className="flex-1 pb-20">
        {/* pb-20 agar konten tidak tertutup oleh BottomNav */}
        {children}
      </main>

      {/* Navigasi Bawah yang Menempel */}
      <BottomNav />
    </div>
  );
}
