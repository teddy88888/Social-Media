"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Membuat instance QueryClient sekali saja
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Menghindari fetch ulang saat ganti tab browser
            retry: 1, // Mencoba ulang 1 kali jika API error
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
