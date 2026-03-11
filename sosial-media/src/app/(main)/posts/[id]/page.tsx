'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { PostCard } from '@/components/post-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send } from 'lucide-react';
import { useState } from 'react';

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // 1. Fetch Detail Post
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await api.get(`/api/posts/${id}`);
      return res.data;
    },
  });

  // 2. Mutasi untuk Tambah Komentar
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      return api.post(`/api/posts/${id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      setNewComment('');
    },
  });

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  if (isLoading) return <div className="p-4 text-center">Loading post...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header Sticky */}
      <header className="sticky top-0 bg-black/90 backdrop-blur-md z-10 p-4 border-b border-zinc-900 flex items-center gap-4">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Comments</h1>
      </header>

      {/* Post Utama */}
      <PostCard post={post} />

      {/* Daftar Komentar */}
      <div className="px-4 space-y-4 mt-2">
        {post?.comments?.map((comment: any) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-sm">
              <p>
                <span className="font-bold mr-2">{comment.author.username}</span>
                {comment.content}
              </p>
              <p className="text-zinc-500 text-[10px] mt-1">2h ago</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Komentar Melayang (Sticky Bottom) */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-black border-t border-zinc-900 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={post?.author?.avatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <form onSubmit={handleSendComment} className="flex-1 relative">
          <Input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..." 
            className="bg-zinc-900 border-none pr-10 rounded-full h-10"
          />
          <button 
            type="submit"
            disabled={commentMutation.isPending}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm"
          >
            {commentMutation.isPending ? '...' : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}