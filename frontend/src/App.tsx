import { useAppSelector } from "@app/store";
import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import MainLayout from "@app/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
import AuthApi from "@app/services/auth";
import SplashPage from "@app/pages/SplashPage";
import { NotFoundPage } from "./pages/NotFoundPage";
const LocationsPage = lazy(() => import("./pages/settings/locations/LocationsPage"));
const LocationScoutPage = lazy(() => import("./pages/location-scout/LocationScoutPage"));
const TablesPage = lazy(() => import("./pages/settings/tables/TablesPage"));
const UsersPage = lazy(() => import("./pages/users/UsersPage"));
const LoginPage = lazy(() => import("@app/pages/auth/LoginPage"));
const PosPage = lazy(() => import("@app/pages/pos/PosPage"));
const OrderDetailsPage = lazy(() => import("@app/pages/pos/OrderDetailsPage"));
const CategoriesPage = lazy(() => import("@app/pages/settings/categories/CategoriesPage"));
const SettingsPage = lazy(() => import("@app/pages/settings/SettingsPage"));
const ProductsPage = lazy(() => import("@app/pages/settings/products/ProductsPage"));
const DashboardPage = lazy(() => import("@app/pages/dashboard/DashboardPage"));
const InvoicesPage = lazy(() => import("@app/pages/invoices/InvoicesPage"));

function App() {
  const auth = useAppSelector((state) => state.auth);
  useEffect(() => {
    AuthApi.verify();
  }, []);
  return (
    <Suspense fallback={<SplashPage />}>
      <BrowserRouter>
        <Routes>
          {!auth.loggedIn && !auth.loading && <Route index Component={LoginPage} />}
          <Route Component={MainLayout}>
            <Route index Component={DashboardPage} />
            <Route path="kot" Component={PosPage} />
            <Route path="pos" Component={PosPage}>
              <Route path=":orderId" Component={OrderDetailsPage} />
            </Route>
            <Route path="settings" Component={SettingsPage}>
              <Route path="categories" Component={CategoriesPage} />
              <Route path="products" Component={ProductsPage} />
              <Route path="locations" Component={LocationsPage} />
              <Route path="tables" Component={TablesPage} />
            </Route>
            <Route path="invoices" Component={InvoicesPage} />
            <Route path="users" Component={UsersPage} />
            <Route path="location-scout" Component={LocationScoutPage} />
          </Route>
          <Route path="*" Component={NotFoundPage} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Suspense>
  );
}

export default App;
