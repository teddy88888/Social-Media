"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import api from "@/lib/axios";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/authSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setServerError(null);
      const response = await api.post("/api/auth/login", data);

      // Simpan user & token ke Redux (Store & LocalStorage)
      dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.token,
        }),
      );

      // Arahkan ke Feed
      router.push("/feed");
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Please enter your details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-12"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-12"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-center text-sm bg-red-500/10 py-2 rounded-md border border-red-500/20">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-indigo-400 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
