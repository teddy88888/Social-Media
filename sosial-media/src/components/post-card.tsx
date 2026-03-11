"use client";

import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export function PostCard({ post }: any) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Logika Optimistic Update untuk Like
  const likeMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/api/posts/${post._id}/like`);
    },
    // Langkah 1: Saat diklik, langsung ubah cache secara lokal
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      const previousPosts = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(["feed"], (old: any) =>
        old?.map((p: any) =>
          p._id === post._id
            ? {
                ...p,
                likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                isLiked: !p.isLiked,
              }
            : p,
        ),
      );

      return { previousPosts };
    },
    // Langkah 2: Jika server error, balikkan ke data lama
    onError: (err, newUser, context: any) => {
      queryClient.setQueryData(["feed"], context.previousPosts);
    },
    // Langkah 3: Selalu sinkronkan data akhir dengan server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return (
    <div className="bg-black border-b border-zinc-900 pb-4 mb-2">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{post.author.username}</span>
          <span className="text-zinc-500 text-xs">
            • {dayjs(post.createdAt).fromNow()}
          </span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-zinc-400" />
      </div>

      <div
        className="aspect-square bg-zinc-900 cursor-pointer"
        onClick={() => router.push(`/posts/${post._id}`)}
      >
        <img
          src={post.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 space-y-1">
        <div className="flex items-center gap-4">
          <Heart
            onClick={() => likeMutation.mutate()}
            className={`w-6 h-6 cursor-pointer transition-all ${
              post.isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white hover:text-zinc-400"
            }`}
          />
          <MessageCircle
            onClick={() => router.push(`/posts/${post._id}`)}
            className="w-6 h-6 hover:text-zinc-400 cursor-pointer"
          />
        </div>

        <p className="text-sm font-bold mt-2">{post.likesCount} likes</p>
        <p className="text-sm">
          <span className="font-bold mr-2">{post.author.username}</span>
          {post.caption}
        </p>
      </div>
    </div>
  );
}
