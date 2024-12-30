import { useAppSelector } from "@app/store";
import { BrowserRouter, Route, Routes } from "react-router";
import React, { lazy, Suspense, useEffect } from "react";
import MainLayout from "@app/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
import AuthApi from "@app/services/auth";
import SplashPage from "@app/pages/SplashPage";
const LocationsPage  = lazy(() => import("./pages/settings/locations/LocationsPage"));
const LocationScoutPage = lazy(() => import("./pages/location-scout/LocationScoutPage"));
const TablesPage = lazy(() => import("./pages/settings/tables/TablesPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const LoginPage = lazy(() => import("@app/pages/auth/LoginPage"));
const PosPage = lazy(() => import("@app/pages/pos/PosPage"));
const CartDetailsPage = lazy(() => import("@app/pages/pos/CartDetailsPage"));
const CategoriesPage = lazy(
  () => import("@app/pages/settings/categories/CategoriesPage")
);
const SettingsPage = lazy(() => import("@app/pages/settings/SettingsPage"));
const ProductsPage = lazy(
  () => import("@app/pages/settings/products/ProductsPage")
);
const DashboardPage = lazy(() => import("@app/pages/dashboard/DashboardPage"));
const OrdersPage = lazy(() => import("@app/pages/orders/OrdersPage"));

function App() {
  const auth = useAppSelector((state) => state.auth);

  const verify = () => {
    AuthApi.verify();
  };

  useEffect(() => {
    verify();
  }, []);
  return (
    <Suspense fallback={<SplashPage />}>
      <BrowserRouter>
        <Routes>
          {!auth.loggedIn ? (
            <Route index Component={LoginPage} />
          ) : (
            <React.Fragment>
              <Route Component={MainLayout}>
                <Route index Component={DashboardPage} />
                <Route path="kot" Component={PosPage} />
                <Route path="pos" Component={PosPage}>
                  <Route path=":cartId" Component={CartDetailsPage} />
                </Route>
                <Route path="settings" Component={SettingsPage}>
                  <Route path="categories" Component={CategoriesPage} />
                  <Route path="products" Component={ProductsPage} />
                  <Route path="locations" Component={LocationsPage} />
                  <Route path="tables" Component={TablesPage} />
                </Route>
                <Route path="orders" Component={OrdersPage} />
                <Route path="users" Component={UsersPage} />
                <Route path="location-scout" Component={LocationScoutPage} />
              </Route>
            </React.Fragment>
          )}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Suspense>
  );
}

export default App;
