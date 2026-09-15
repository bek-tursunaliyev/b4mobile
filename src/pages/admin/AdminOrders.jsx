import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { adminGetOrders, adminUpdateOrderStatus } from "../../lib/api";

const STATUS_OPTIONS = [
  { value: "new", label: "Yangi" },
  { value: "confirmed", label: "Tasdiqlangan" },
  { value: "shipped", label: "Yo‘lda" },
  { value: "done", label: "Bajarilgan" },
  { value: "cancelled", label: "Bekor qilingan" },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    setLoading(true);
    adminGetOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (order, status) => {
    const updated = await adminUpdateOrderStatus(order.id, status);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
  };

  return (
    <div>
      <h1 className="admin-page-title">Buyurtmalar</h1>

      <div className="admin-card">
        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">Hozircha buyurtmalar yo‘q.</p>
        ) : (
          <div className="admin-order-list">
            {orders.map((order) => {
              const expanded = expandedId === order.id;

              return (
                <div className="admin-order-item" key={order.id}>
                  <button
                    type="button"
                    className="admin-order-summary"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    <div>
                      <strong>{order.orderCode}</strong>
                      <span>{order.fullName} · {order.phone}</span>
                    </div>

                    <div className="admin-order-summary-right">
                      <strong>{order.total.toLocaleString("uz-UZ")} so‘m</strong>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {expanded && (
                    <div className="admin-order-details">
                      <p>
                        <strong>Manzil:</strong> {order.region}, {order.address}
                      </p>
                      {order.note && (
                        <p>
                          <strong>Izoh:</strong> {order.note}
                        </p>
                      )}
                      <p>
                        <strong>To‘lov:</strong> {order.paymentMethod}
                      </p>
                      <p>
                        <strong>Sana:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString("uz-UZ")}
                      </p>

                      <div className="admin-order-products">
                        {order.items.map((item, index) => (
                          <div className="admin-order-product-row" key={index}>
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                            <strong>
                              {(item.price * item.quantity).toLocaleString("uz-UZ")} so‘m
                            </strong>
                          </div>
                        ))}
                      </div>

                      <label className="admin-order-status-select">
                        <span>Holat</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
