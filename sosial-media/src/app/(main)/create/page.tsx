"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";

export default function CreatePost() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await api.post("/api/posts", formData);
      router.push("/feed");
    } catch (err) {
      alert("Gagal mengunggah postingan");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">New Post</h1>
      <div className="aspect-square bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden border border-zinc-800">
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" />
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <ImagePlus className="w-12 h-12 text-zinc-600" />
            <span className="text-zinc-500 text-sm mt-2">Pilih Foto</span>
            <input type="file" hidden onChange={handleFile} accept="image/*" />
          </label>
        )}
      </div>
      <Textarea
        placeholder="Tulis caption..."
        className="bg-zinc-900 border-none"
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button className="w-full bg-indigo-600" onClick={handleUpload}>
        Post Sekarang
      </Button>
    </div>
  );
}
