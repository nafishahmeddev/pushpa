import { Provider } from "react-redux";
import { store } from "@app/store";
import { BrowserRouter, Route, Routes } from "react-router";
import { lazy } from "react";

import MainLayout from "@app/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
const SplashPage = lazy(() => import("@app/pages/SplashPage"));
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
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index Component={SplashPage} />
          <Route Component={MainLayout}>
            <Route path="dash" Component={DashboardPage} />
            <Route path="kot" Component={PosPage} />
            <Route path="pos" Component={PosPage}>
              <Route path=":cartId" Component={CartDetailsPage} />
            </Route>
            <Route path="settings" Component={SettingsPage}>
              <Route path="categories" Component={CategoriesPage} />
              <Route path="products" Component={ProductsPage} />
            </Route>
            <Route path="orders">
              <Route index Component={OrdersPage} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
}

export default App;
