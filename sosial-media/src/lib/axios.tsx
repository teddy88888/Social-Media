import axios from "axios";

const api = axios.create({
  // Ubah ini agar menembak ke Route Handler internal Anda
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
