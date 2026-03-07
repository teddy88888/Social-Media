// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login"); // Langsung lempar ke halaman login saat pertama buka
}
