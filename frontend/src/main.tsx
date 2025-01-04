import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.tsx";
const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <App/>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
