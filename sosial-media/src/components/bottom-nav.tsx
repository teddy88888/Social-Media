"use client";

import { Home, Search, PlusSquare, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navs = [
    { icon: Home, path: "/feed" },
    { icon: Search, path: "/search" },
    { icon: PlusSquare, path: "/create" },
    { icon: User, path: "/me" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 h-16 flex items-center justify-around px-4 z-50">
      {navs.map((nav) => (
        <button
          key={nav.path}
          onClick={() => router.push(nav.path)}
          className={`${pathname === nav.path ? "text-white" : "text-zinc-500"} transition-colors`}
        >
          <nav.icon className="w-7 h-7" />
        </button>
      ))}
    </div>
  );
}
