"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PostCard } from "@/components/post-card";

export default function FeedPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await api.get("/api/feed");
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full aspect-square bg-zinc-900 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Gagal memuat postingan. Silakan coba lagi.
      </div>
    );

  return (
    <div className="max-w-md mx-auto pb-20">
      <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 border-b border-zinc-900">
        <h1 className="text-xl font-bold italic tracking-tighter">Sociality</h1>
      </header>

      <div className="flex flex-col">
        {posts?.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
