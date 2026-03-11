"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setServerError(null);
    setIsLoading(true);

    try {
      // API ini biasanya mewajibkan field 'name'
      const payload = {
        name: data.username, // Gunakan username sebagai nama sementara
        username: data.username,
        email: data.email,
        password: data.password,
      };

      console.log("Mengirim data:", payload);

      // Pastikan path-nya benar sesuai proxy: /auth/register
      const response = await api.post("/auth/register", payload);

      // Sesuaikan pengecekan sukses
      if (response.data.success || response.status === 201) {
        alert("Registrasi Berhasil!");
        router.push("/login");
      }
    } catch (err: any) {
      // CARA LIHAT ERROR: Klik tanda > di sebelah 'Detail Error dari Server' di Konsol
      const msg = err.response?.data?.message || "Validation failed";
      setServerError(msg);
      console.log("Detail Error dari Server:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Join the Sociality community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Input
              {...register("username")}
              placeholder="Username"
              className="bg-zinc-900 border-zinc-800 text-white h-12"
            />
            {errors.username && (
              <p className="text-red-500 text-[10px]">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="bg-zinc-900 border-zinc-800 text-white h-12"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px]">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="bg-zinc-900 border-zinc-800 text-white h-12"
            />
            {errors.password && (
              <p className="text-red-500 text-[10px]">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="bg-zinc-900 border-zinc-800 text-white h-12"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-center text-sm py-2 bg-red-500/10 rounded border border-red-500/20">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-indigo-400 font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
