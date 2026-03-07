// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://be-social-media-api-production.up.railway.app/",
});

// Interceptor untuk menyisipkan token otomatis
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
