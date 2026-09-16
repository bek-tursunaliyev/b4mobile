import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Package } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { getMyOrders } from "../lib/api";
import { formatMoney } from "../lib/currency";
import "./orders.css";

const STATUS_LABELS = {
  new: "Yangi",
  confirmed: "Tasdiqlangan",
  shipped: "Yo‘lda",
  picked_up: "Berib yuborildi",
  done: "Bajarilgan",
  cancelled: "Bekor qilingan",
};

function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasTelegram, setHasTelegram] = useState(true);
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setHasTelegram(res.ok);
        setOrders(res.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="orders-page orders-loading">Yuklanmoqda...</main>;
  }

  if (!hasTelegram) {
    return (
      <main className="orders-page">
        <div className="orders-empty-state">
          <div className="orders-empty-icon">
            <Package size={32} />
          </div>
          <h1>Buyurtmalar tarixi mavjud emas</h1>
          <p>
            Buyurtmalaringizni ko‘rish uchun ilovani Telegram bot orqali
            oching — buyurtmalar tarixi Telegram hisobingizga bog‘lanadi.
          </p>
          <Link to="/catalog" className="orders-empty-cta">
            Katalogni ko‘rish
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <button type="button" className="orders-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="orders-title">Buyurtmalarim</h1>

        {orders.length === 0 ? (
          <div className="orders-empty-state">
            <div className="orders-empty-icon">
              <Package size={32} />
            </div>
            <h1>Hali buyurtma yo‘q</h1>
            <p>Birinchi buyurtmangizni bering — u shu yerda ko‘rinadi.</p>
            <Link to="/catalog" className="orders-empty-cta">
              Xarid qilishni boshlash
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const expanded = expandedId === order.id;

              return (
                <div className="order-card" key={order.id}>
                  <button
                    type="button"
                    className="order-card-summary"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    <div>
                      <strong>{order.orderCode}</strong>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                      </span>
                    </div>

                    <div className="order-card-right">
                      <span className={`order-status order-status-${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <strong>{formatMoney(order.total, order.currency)}</strong>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {expanded && (
                    <div className="order-card-details">
                      {order.items.map((item, index) => (
                        <div className="order-item-row" key={index}>
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <strong>
                            {formatMoney(item.price * item.quantity, order.currency)}
                          </strong>
                        </div>
                      ))}

                      <div className="order-card-meta">
                        <span>{order.region}, {order.address}</span>
                        <span>{order.paymentMethod}</span>
                      </div>

                      {order.isInstallment && (
                        <div className="order-installment-block">
                          <strong>Bo‘lib to‘lash shartlari</strong>
                          {order.installmentMonths && order.installmentMonthlyAmount ? (
                            <>
                              <span>
                                Muddat: {order.installmentMonths} oy
                              </span>
                              <span>
                                Oylik to‘lov:{" "}
                                {formatMoney(order.installmentMonthlyAmount, order.installmentCurrency)}
                              </span>
                            </>
                          ) : (
                            <span>
                              Admin hali shartlarni belgilamagan. Iltimos,
                              kuting yoki administratorga murojaat qiling.
                            </span>
                          )}
                          <small>
                            Shartlarni o‘zgartirish uchun administratorga
                            murojaat qiling.
                          </small>
                        </div>
                      )}

                      <div className="order-card-qr">
                        <QRCodeSVG value={order.orderCode} size={120} />
                        <span>Do‘konda ushbu QR kodni ko‘rsating</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
