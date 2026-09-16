import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Image as ImageIcon,
  FileBarChart,
} from "lucide-react";

import { adminGetOrders, adminGetProducts } from "../../lib/api";
import { formatMoney } from "../../lib/currency";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetProducts(), adminGetOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  const newOrders = orders.filter((o) => o.status === "new").length;

  const revenueByCurrency = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => {
      const currency = o.currency || "UZS";
      acc[currency] = (acc[currency] || 0) + o.total;
      return acc;
    }, {});
  const revenueCurrencies = Object.keys(revenueByCurrency);
  const revenue =
    revenueCurrencies.length === 0
      ? formatMoney(0, "UZS")
      : revenueCurrencies.map((c) => formatMoney(revenueByCurrency[c], c)).join(" + ");

  const cards = [
    {
      icon: Package,
      label: "Mahsulotlar",
      value: products.length,
      to: "/admin/products",
    },
    {
      icon: ShoppingBag,
      label: "Yangi buyurtmalar",
      value: newOrders,
      to: "/admin/orders",
    },
    {
      icon: TrendingUp,
      label: "Umumiy tushum",
      value: revenue,
      to: "/admin/orders",
    },
    {
      icon: ImageIcon,
      label: "Bannerlar",
      value: "Boshqarish",
      to: "/admin/banners",
    },
    {
      icon: FileBarChart,
      label: "Hisobot",
      value: "Ko‘rish",
      to: "/admin/reports",
    },
  ];

  if (loading) {
    return <p className="admin-loading">Yuklanmoqda...</p>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Umumiy ko‘rinish</h1>

      <div className="admin-stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link to={card.to} className="admin-stat-card" key={card.label}>
              <div className="admin-stat-icon">
                <Icon size={20} />
              </div>

              <div>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="admin-card">
        <h2>So‘nggi buyurtmalar</h2>

        {orders.length === 0 ? (
          <p className="admin-empty">Hozircha buyurtmalar yo‘q.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kod</th>
                  <th>Mijoz</th>
                  <th>Summa</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderCode}</td>
                    <td>{order.fullName}</td>
                    <td>{formatMoney(order.total, order.currency)}</td>
                    <td>
                      <span className={`admin-status admin-status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
