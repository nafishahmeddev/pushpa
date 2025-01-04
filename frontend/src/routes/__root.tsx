import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import MainLayout from "@app/components/layout/MainLayout";
import NotFoundComponent from "@app/components/NotFoundComponent";
import PendingComponent from "@app/components/PendingComponent";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  pendingComponent: PendingComponent,
});

function RootComponent() {
  const {pathname} = useLocation();
  return (
    <React.Fragment>
      {pathname.startsWith("/auth") ? <Outlet/> : <MainLayout/> }
    </React.Fragment>
  );
}
