import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { SocketProvider } from "./components/realtime/SocketProvider.jsx";
import "./index.css";

// Inisialisasi QueryClient dengan pengaturan default caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // biar tidak auto refetch tiap ganti tab
      retry: 1, // batasi retry untuk error
    },
  },
});

const container = document.getElementById("root");
if (!container) {
  throw new Error(
    'Root element tidak ditemukan. Pastikan ada <div id="root"></div> di index.html.'
  );
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);
