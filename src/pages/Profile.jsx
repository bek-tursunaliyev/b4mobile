import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  Smartphone,
  User,
  Wrench,
} from "lucide-react";

import { getMyOrders, getMyTradeIns } from "../lib/api";
import { formatMoney } from "../lib/currency";
import "./profile.css";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setUser(res.user);
        setOrders(res.orders);
      })
      .finally(() => setLoading(false));

    getMyTradeIns().then((res) => {
      if (res.ok) setTradeIns(res.requests);
    });
  }, []);

  const totalSpentByCurrency = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((acc, o) => {
      const currency = o.currency || "UZS";
      acc[currency] = (acc[currency] || 0) + o.total;
      return acc;
    }, {});
  const spentCurrencies = Object.keys(totalSpentByCurrency);

  const initials = user?.first_name?.[0]?.toUpperCase() || "?";
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  const quickLinks = [
    { to: "/orders", icon: Package, label: "Buyurtmalarim" },
    { to: "/xizmatlar", icon: Wrench, label: "Xizmatlar" },
    { to: "/my-phone", icon: Smartphone, label: "Mening telefonim" },
    { to: "/cart", icon: ShoppingBag, label: "Savat" },
  ];

  if (loading) {
    return <main className="profile-page profile-loading">Yuklanmoqda...</main>;
  }

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-guest">
          <div className="profile-guest-icon">
            <User size={30} />
          </div>
          <h1>Profil mavjud emas</h1>
          <p>
            Shaxsiy profilingizni ko‘rish uchun ilovani Telegram bot orqali
            oching — profilingiz Telegram hisobingiz asosida avtomatik
            yaratiladi, ro‘yxatdan o‘tish shart emas.
          </p>
          <Link to="/catalog" className="profile-guest-cta">
            Katalogni ko‘rish
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>

          <div className="profile-info">
            <h1>{fullName || "Foydalanuvchi"}</h1>
            {user.username && <span>@{user.username}</span>}
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <strong>{orders.length}</strong>
            <span>Buyurtmalar</span>
          </div>
          <div className="profile-stat">
            <strong>
              {spentCurrencies.length === 0
                ? formatMoney(0, "UZS")
                : spentCurrencies
                    .map((c) => formatMoney(totalSpentByCurrency[c], c))
                    .join(" + ")}
            </strong>
            <span>Umumiy xarid</span>
          </div>
        </div>

        <div className="profile-quicklinks">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link to={link.to} className="profile-quicklink" key={link.to}>
                <div className="profile-quicklink-icon">
                  <Icon size={19} />
                </div>
                <span>{link.label}</span>
                <ArrowRight size={16} />
              </Link>
            );
          })}
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <h2>So‘nggi buyurtmalar</h2>
            {orders.length > 0 && (
              <Link to="/orders">Barchasi <ArrowRight size={14} /></Link>
            )}
          </div>

          {orders.length === 0 ? (
            <p className="profile-empty">
              Hali buyurtma qilmagansiz.{" "}
              <Link to="/catalog">Katalogni ko‘ring</Link>
            </p>
          ) : (
            <div className="profile-orders">
              {orders.slice(0, 3).map((order) => (
                <div className="profile-order-row" key={order.id}>
                  <div>
                    <strong>{order.orderCode}</strong>
                    <span>{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</span>
                  </div>
                  <strong>{formatMoney(order.total, order.currency)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {tradeIns.length > 0 && (
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Telefon almashish so‘rovlari</h2>
            </div>

            <div className="profile-orders">
              {tradeIns.map((req) => (
                <div className="profile-order-row" key={req.id}>
                  <div>
                    <strong>{req.brand} {req.model}</strong>
                    <span>{new Date(req.createdAt).toLocaleDateString("uz-UZ")}</span>
                  </div>

                  {req.status === "priced" && req.offeredPrice ? (
                    <strong>
                      {formatMoney(req.offeredPrice, req.offeredPriceCurrency)} taklif qilindi
                    </strong>
                  ) : req.status === "rejected" ? (
                    <span className="profile-tradein-rejected">Rad etildi</span>
                  ) : (
                    <span>Ko‘rib chiqilmoqda</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;
