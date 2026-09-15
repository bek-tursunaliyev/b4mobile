import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layouts/MainLayouts";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Compare from "./pages/Compare";
import Installment from "./pages/Installement";
import MyPhone from "./pages/MyPhone";
import PhoneFinder from "./pages/PhoneFinder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminTradeIns from "./pages/admin/AdminTradeIns";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,

    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "catalog",
        element: <Catalog />,
      },

      {
        path: "phone-finder",
        element: <PhoneFinder />,
      },

      {
        path: "compare",
        element: <Compare />,
      },

      {
        path: "installment",
        element: <Installment />,
      },

      {
        path: "my-phone",
        element: <MyPhone />,
      },

      {
        path: "cart",
        element: <Cart />,
      },

      {
        path: "checkout",
        element: <Checkout />,
      },

      {
        path: "orders",
        element: <Orders />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "xizmatlar",
        element: <Services />,
      },

      // PRODUCT DETAIL
      {
        path: "product/:id",
        element: <Products />,
      },

      // Agar /products/1 yozilsa ham ishlaydi
      {
        path: "products/:id",
        element: <Products />,
      },
    ],
  },

  // ADMIN PANEL
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFound />,

    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "banners",
        element: <AdminBanners />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "trade-ins",
        element: <AdminTradeIns />,
      },
    ],
  },
]);

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
