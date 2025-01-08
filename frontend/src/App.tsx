import { Suspense, useEffect } from "react";
import AuthApi from "@app/services/auth";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools, TanStackRouterDevtools } from "./devtools";
import PendingComponent from "./components/PendingComponent";
const client = new QueryClient();
function App() {
  useEffect(() => {
    AuthApi.verify();
  }, []);
  return (
    <QueryClientProvider client={client}>
      <RouterProvider
        router={router}
        defaultPendingComponent={PendingComponent}
      />
      <Toaster />
      <Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
        <TanStackRouterDevtools router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
