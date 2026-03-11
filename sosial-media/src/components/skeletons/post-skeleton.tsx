export function PostSkeleton() {
  return (
    <div className="bg-black border-b border-zinc-900 pb-4 mb-2 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 bg-zinc-800 rounded-full" />
        <div className="h-3 w-24 bg-zinc-800 rounded" />
      </div>

      {/* Image Skeleton */}
      <div className="aspect-square bg-zinc-900" />

      {/* Content Skeleton */}
      <div className="p-3 space-y-3">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-zinc-800 rounded-full" />
          <div className="w-6 h-6 bg-zinc-800 rounded-full" />
        </div>
        <div className="h-3 w-20 bg-zinc-800 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-zinc-800 rounded" />
          <div className="h-3 w-2/3 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}
