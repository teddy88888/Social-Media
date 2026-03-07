"use client";

import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PostProps {
  post: {
    _id: string;
    caption: string;
    image: string;
    author: { username: string; avatar?: string };
    likesCount: number;
    createdAt: string;
  };
}

export function PostCard({ post }: PostProps) {
  return (
    <div className="bg-black border-b border-zinc-900 pb-4 mb-4">
      {/* Header */}
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

      {/* Image */}
      <div className="aspect-square bg-zinc-900">
        <img
          src={post.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition" />
            <MessageCircle className="w-6 h-6 hover:text-zinc-400 cursor-pointer transition" />
          </div>
          <Bookmark className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold">
          {post.likesCount.toLocaleString()} likes
        </p>
        <p className="text-sm">
          <span className="font-bold mr-2">{post.author.username}</span>
          {post.caption}
        </p>
      </div>
    </div>
  );
}
