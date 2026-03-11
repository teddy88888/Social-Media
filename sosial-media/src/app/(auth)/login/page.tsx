"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.success) {        
        localStorage.setItem("token", res.data.data.token);
        window.location.href = "/feed";
      }
    } catch (err: any) {
      // Alert ini akan muncul jika ada masalah jaringan atau salah password
      const pesanError =
        err.response?.data?.message || "Koneksi ke server gagal/lambat";
      alert("Error: " + pesanError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-zinc-900 border border-zinc-800 text-white outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded bg-zinc-900 border border-zinc-800 text-white outline-none"
        />

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <div
          role="button"
          onClick={() => {
            console.log("Mencoba Login..."); // Cek apakah ini muncul di console
            if (!isLoading) handleLogin();
          }}
          style={{
            display: "block",
            textAlign: "center",
            padding: "12px",
            backgroundColor: "#4f46e5",
            color: "white",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: isLoading ? "not-allowed" : "pointer",
            marginTop: "10px",
            userSelect: "none",
          }}
        >
          {isLoading ? "Memproses..." : "Login Sekarang"}
        </div>
      </div>
    </div>
  );
}
