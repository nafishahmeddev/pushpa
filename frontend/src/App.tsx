import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AuthApi from "@app/services/auth";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
// Create a new router instance
const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  useEffect(() => {
    AuthApi.verify();
  }, []);
  return (
    <React.Fragment>
      <RouterProvider router={router} />
      <Toaster />
    </React.Fragment>
  );
}

export default App;
