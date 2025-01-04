import * as React from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import MainLayout from "@app/components/layout/MainLayout";
import NotFoundComponent from "@app/components/NotFoundComponent";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});

function RootComponent() {
  const {pathname} = useLocation();
  return (
    <React.Fragment>
      
      {pathname.startsWith("/auth") ? <Outlet/> : <MainLayout/> }
    </React.Fragment>
  );
}
