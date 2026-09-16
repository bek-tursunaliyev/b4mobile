import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layouts/MainLayouts";

// Home loads eagerly (it's the first screen). Everything else is
// code-split so a customer's first load doesn't pull in the whole
// catalog/checkout/admin bundle, and the admin panel never ships to
// customers who never open it.
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";

const Catalog = lazy(() => import("./pages/Catalog"));
const Compare = lazy(() => import("./pages/Compare"));
const MyPhone = lazy(() => import("./pages/MyPhone"));
const PhoneFinder = lazy(() => import("./pages/PhoneFinder"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));
const Services = lazy(() => import("./pages/Services"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminTradeIns = lazy(() => import("./pages/admin/AdminTradeIns"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));

function PageFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: 13,
      }}
    >
      Yuklanmoqda...
    </div>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

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
        element: withSuspense(<Catalog />),
      },

      {
        path: "phone-finder",
        element: withSuspense(<PhoneFinder />),
      },

      {
        path: "compare",
        element: withSuspense(<Compare />),
      },

      {
        path: "my-phone",
        element: withSuspense(<MyPhone />),
      },

      {
        path: "cart",
        element: withSuspense(<Cart />),
      },

      {
        path: "checkout",
        element: withSuspense(<Checkout />),
      },

      {
        path: "orders",
        element: withSuspense(<Orders />),
      },

      {
        path: "profile",
        element: withSuspense(<Profile />),
      },

      {
        path: "xizmatlar",
        element: withSuspense(<Services />),
      },

      // PRODUCT DETAIL
      {
        path: "product/:id",
        element: withSuspense(<Products />),
      },

      // Agar /products/1 yozilsa ham ishlaydi
      {
        path: "products/:id",
        element: withSuspense(<Products />),
      },
    ],
  },

  // ADMIN PANEL
  {
    path: "/admin",
    element: withSuspense(<AdminLayout />),
    errorElement: <NotFound />,

    children: [
      {
        index: true,
        element: withSuspense(<AdminDashboard />),
      },
      {
        path: "products",
        element: withSuspense(<AdminProducts />),
      },
      {
        path: "banners",
        element: withSuspense(<AdminBanners />),
      },
      {
        path: "orders",
        element: withSuspense(<AdminOrders />),
      },
      {
        path: "trade-ins",
        element: withSuspense(<AdminTradeIns />),
      },
      {
        path: "reports",
        element: withSuspense(<AdminReports />),
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
