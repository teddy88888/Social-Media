"use client";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      setUserToken(token);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-blue-500">
        Selamat Datang di Feed! 🚀
      </h1>
      <p className="mt-4 text-zinc-400 text-center">
        Sistem Login kamu sudah 100% bekerja. <br />
        Token kamu terdeteksi di sistem.
      </p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="mt-10 px-6 py-2 bg-red-600 rounded-full font-semibold"
      >
        Log Out
      </button>
    </div>
  );
}
