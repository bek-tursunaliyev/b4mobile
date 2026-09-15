import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Smartphone } from "lucide-react";

import { getMyOrders } from "../lib/api";
import "./myphone.css";

const WARRANTY_DAYS = 365;

function MyPhone() {
  const [loading, setLoading] = useState(true);
  const [hasTelegram, setHasTelegram] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setHasTelegram(res.ok);
        setOrders(res.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const devices = useMemo(() => {
    const rows = [];

    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        order.items.forEach((item) => {
          const warrantyEnd = new Date(order.createdAt);
          warrantyEnd.setDate(warrantyEnd.getDate() + WARRANTY_DAYS);

          const daysLeft = Math.ceil(
            (warrantyEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          rows.push({
            key: `${order.id}-${item.id}`,
            name: item.name,
            image: item.image,
            purchasedAt: order.createdAt,
            orderCode: order.orderCode,
            daysLeft,
          });
        });
      });

    return rows;
  }, [orders]);

  if (loading) {
    return <main className="myphone-page myphone-loading">Yuklanmoqda...</main>;
  }

  if (!hasTelegram) {
    return (
      <main className="myphone-page">
        <div className="myphone-empty">
          <div className="myphone-empty-icon">
            <Smartphone size={30} />
          </div>
          <h1>Ma’lumot mavjud emas</h1>
          <p>
            Xaridlaringizni ko‘rish uchun ilovani Telegram bot orqali oching.
          </p>
          <Link to="/catalog" className="myphone-cta">
            Katalogni ko‘rish
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="myphone-page">
      <div className="myphone-container">
        <h1 className="myphone-title">Mening telefonim</h1>
        <p className="myphone-subtitle">
          Sotib olingan qurilmalaringiz va kafolat muddati
        </p>

        {devices.length === 0 ? (
          <div className="myphone-empty">
            <div className="myphone-empty-icon">
              <Smartphone size={30} />
            </div>
            <h1>Hozircha qurilma yo‘q</h1>
            <p>Xarid qilgan mahsulotlaringiz shu yerda ko‘rinadi.</p>
            <Link to="/catalog" className="myphone-cta">
              Katalogni ko‘rish
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="myphone-list">
            {devices.map((device) => (
              <div className="myphone-card" key={device.key}>
                <img src={device.image} alt={device.name} />

                <div className="myphone-info">
                  <strong>{device.name}</strong>
                  <span>
                    Xarid: {new Date(device.purchasedAt).toLocaleDateString("uz-UZ")}
                    {" · "}
                    {device.orderCode}
                  </span>
                </div>

                <div
                  className={`myphone-warranty ${
                    device.daysLeft > 0 ? "active" : "expired"
                  }`}
                >
                  <ShieldCheck size={15} />
                  {device.daysLeft > 0
                    ? `${device.daysLeft} kun qoldi`
                    : "Kafolat tugagan"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyPhone;
