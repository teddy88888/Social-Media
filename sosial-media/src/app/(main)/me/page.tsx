"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/authSlice"; // Import action logout
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function MyProfile() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login"); // Gunakan replace agar user tidak bisa "back" ke profil
  };

  return (
    <div className="p-4 bg-black min-h-screen">
      <div className="flex flex-col items-center py-8">
        <Avatar className="w-24 h-24 mb-4 border-2 border-indigo-600 p-1">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-2xl">
            {user?.username?.[0]}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">@{user?.username}</h2>
        <p className="text-zinc-500 text-sm mb-6">{user?.email}</p>

        <div className="flex gap-4 w-full max-w-xs">
          <Button
            variant="outline"
            className="flex-1 border-zinc-800 hover:bg-zinc-900"
            onClick={() => router.push("/me/edit")}
          >
            Edit Profile
          </Button>

          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Grid Postingan (Placeholder) */}
      <div className="grid grid-cols-3 gap-1 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-zinc-900 rounded-sm hover:opacity-80 transition cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
