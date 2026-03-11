import React from "react";

/**
 * Layout ini membungkus semua halaman di dalam grup (main).
 * Pastikan TIDAK menggunakan tag <form> sebagai pembungkus utama
 * agar tidak terjadi refresh/reset otomatis pada halaman login atau feed.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}