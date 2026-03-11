"use client";

import { useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/authSlice";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ChevronLeft } from "lucide-react";

export default function EditProfilePage() {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [preview, setPreview] = useState(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await api.patch("/api/users/me", formData);

      // Update Redux Store dengan data user terbaru
      dispatch(setCredentials({ user: response.data, token: token! }));

      router.push("/me");
    } catch (err) {
      alert("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="p-4 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-black/90 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <h1 className="font-bold">Edit Profile</h1>
        </div>
        <Button
          variant="ghost"
          className="text-indigo-500 font-bold"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Done"}
        </Button>
      </header>

      <div className="p-6 flex flex-col items-center">
        <div
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar className="w-24 h-24 border-2 border-zinc-800">
            <AvatarImage src={preview} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-indigo-500 text-sm mt-4 font-medium">
          Change profile photo
        </p>

        <form className="w-full mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-zinc-500 text-xs px-1">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-b border-zinc-800 border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-1 h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-zinc-500 text-xs px-1">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="bg-transparent border-b border-zinc-800 border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-1 min-h-[80px] resize-none"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
