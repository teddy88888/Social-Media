"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Comment } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export function CommentSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // 1. Fetch Comments
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/api/posts/${postId}/comments`);
      return res.data;
    },
  });

  // 2. Post Comment with Optimistic UI
  const mutation = useMutation({
    mutationFn: (text: string) =>
      api.post(`/api/posts/${postId}/comments`, { text }),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      // State optimistik (data pura-pura sementara)
      const optimisticComment: any = {
        _id: Math.random().toString(),
        text,
        createdAt: new Date().toISOString(),
        user: { username: "You", avatar: "" }, // Bisa ambil dari Redux store
      };

      queryClient.setQueryData(["comments", postId], (old: any) => [
        optimisticComment,
        ...(old || []),
      ]);
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments", postId], context?.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutation.mutate(newComment);
  };

  return (
    <div className="flex flex-col h-[500px] bg-zinc-950 rounded-t-3xl border-t border-zinc-900">
      <div className="p-4 border-b border-zinc-900 text-center">
        <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto mb-4" />
        <h3 className="font-bold">Comments</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-zinc-500">Loading comments...</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold mr-2">
                    {comment.user.username}
                  </span>
                  {comment.text}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {dayjs(comment.createdAt).fromNow()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Composer (Sesuai Desain) */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-900 flex gap-2"
      >
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
        />
        <Button
          type="submit"
          variant="ghost"
          className="text-indigo-500 font-bold"
          disabled={mutation.isPending}
        >
          Post
        </Button>
      </form>
    </div>
  );
}
