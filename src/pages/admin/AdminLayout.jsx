import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Package,
  ShoppingBag,
  Smartphone,
  ArrowLeft,
  FileBarChart,
  Menu,
} from "lucide-react";

import { useAdmin } from "../../hooks/useAdmin";
import "./admin.css";

function AdminLayout() {
  const { isAdmin, loading, telegramUser } = useAdmin();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  if (loading) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-card">
          <div className="admin-spinner" />
          <p>Tekshirilmoqda...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-card">
          <h1>Ruxsat yo‘q</h1>
          <p>
            Bu bo‘lim faqat administratorlar uchun. Agar siz admin bo‘lsangiz,
            iltimos ilovani Telegram bot orqali oching.
          </p>
          <Link to="/" className="admin-gate-back">
            <ArrowLeft size={16} />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <Link to="/admin" className="admin-logo">
          B<span>⁴</span> ADMIN
        </Link>

        <div className="admin-topbar-right">
          {telegramUser?.first_name && (
            <span className="admin-user">{telegramUser.first_name}</span>
          )}

          <Link to="/" className="admin-store-link">
            <ArrowLeft size={15} />
            Do‘konga qaytish
          </Link>

          <button
            type="button"
            className={`admin-menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menyu"
          >
            <Menu size={20} />
          </button>
        </div>

        {menuOpen && (
          <nav className="admin-nav">
            <NavLink to="/admin" end onClick={closeMenu}>
              <LayoutDashboard size={17} />
              Umumiy
            </NavLink>

            <NavLink to="/admin/products" onClick={closeMenu}>
              <Package size={17} />
              Mahsulotlar
            </NavLink>

            <NavLink to="/admin/banners" onClick={closeMenu}>
              <ImageIcon size={17} />
              Bannerlar
            </NavLink>

            <NavLink to="/admin/orders" onClick={closeMenu}>
              <ShoppingBag size={17} />
              Buyurtmalar
            </NavLink>

            <NavLink to="/admin/trade-ins" onClick={closeMenu}>
              <Smartphone size={17} />
              Telefon almashish
            </NavLink>

            <NavLink to="/admin/reports" onClick={closeMenu}>
              <FileBarChart size={17} />
              Hisobot
            </NavLink>
          </nav>
        )}
      </header>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
