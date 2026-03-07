"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: users, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];
      const res = await api.get(`/api/users/search?q=${query}`);
      return res.data;
    },
    enabled: query.length > 0, // Hanya fetch jika ada input
  });

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
        <Input
          placeholder="Search users..."
          className="bg-zinc-900 border-none pl-10 h-12"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {users?.map((user: any) => (
          <div
            key={user._id}
            onClick={() => router.push(`/profile/${user.username}`)}
            className="flex items-center gap-3 cursor-pointer hover:bg-zinc-900 p-2 rounded-lg transition"
          >
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold">@{user.username}</p>
              <p className="text-xs text-zinc-500">
                {user.name || "Sociality User"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
