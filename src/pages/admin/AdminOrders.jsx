import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, QrCode, X } from "lucide-react";

import {
  adminGetOrderByCode,
  adminGetOrders,
  adminSetInstallmentTerms,
  adminUpdateOrderStatus,
} from "../../lib/api";
import { scanQrCode } from "../../lib/telegram";
import { CURRENCIES, formatMoney } from "../../lib/currency";

const STATUS_OPTIONS = [
  { value: "new", label: "Yangi" },
  { value: "confirmed", label: "Tasdiqlangan" },
  { value: "shipped", label: "Yo‘lda" },
  { value: "picked_up", label: "Berib yuborildi" },
  { value: "done", label: "Bajarilgan" },
  { value: "cancelled", label: "Bekor qilingan" },
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [installmentDrafts, setInstallmentDrafts] = useState({});
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scannedOrder, setScannedOrder] = useState(null);

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
    if (scannedOrder?.id === order.id) setScannedOrder(updated);
  };

  const draftFor = (order) =>
    installmentDrafts[order.id] || {
      months: order.installmentMonths || "",
      amount: order.installmentMonthlyAmount || "",
      currency: order.installmentCurrency || "UZS",
    };

  const updateDraft = (order, field, value) => {
    setInstallmentDrafts((prev) => ({
      ...prev,
      [order.id]: { ...draftFor(order), [field]: value },
    }));
  };

  const saveInstallment = async (order) => {
    const draft = draftFor(order);
    if (!draft.months || !draft.amount) return;

    const updated = await adminSetInstallmentTerms(
      order.id,
      Number(draft.months),
      Number(draft.amount),
      draft.currency || "UZS"
    );
    setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
  };

  const handleScan = async () => {
    setScanError("");
    setScanning(true);

    try {
      const code = await scanQrCode("Buyurtma QR kodini skaner qiling");

      if (!code) {
        setScanError(
          "QR skaner mavjud emas — bu funksiya faqat Telegram ilovasi ichida ishlaydi."
        );
        return;
      }

      const order = await adminGetOrderByCode(code.trim());
      setScannedOrder(order);
    } catch (err) {
      setScanError(err.message || "Buyurtma topilmadi");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <div className="admin-orders-toolbar">
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>
          Buyurtmalar
        </h1>

        <button type="button" className="admin-submit" onClick={handleScan} disabled={scanning}>
          <QrCode size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
          {scanning ? "Skanerlanmoqda..." : "QR skanerlash"}
        </button>
      </div>

      {scanError && <p className="admin-error">{scanError}</p>}

      {scannedOrder && (
        <div className="admin-card admin-scan-result">
          <div className="admin-card-header">
            <h2>Skanerlangan buyurtma: {scannedOrder.orderCode}</h2>
            <button type="button" className="admin-link-btn" onClick={() => setScannedOrder(null)}>
              <X size={15} />
              Yopish
            </button>
          </div>

          <p>
            <strong>Mijoz:</strong> {scannedOrder.fullName} · {scannedOrder.phone}
          </p>
          <p>
            <strong>Manzil:</strong> {scannedOrder.region}, {scannedOrder.address}
          </p>
          <p>
            <strong>Jami:</strong> {formatMoney(scannedOrder.total, scannedOrder.currency)}
          </p>
          <p>
            <strong>Holat:</strong>{" "}
            {STATUS_OPTIONS.find((s) => s.value === scannedOrder.status)?.label ||
              scannedOrder.status}
          </p>

          <div className="admin-order-products">
            {scannedOrder.items.map((item, index) => (
              <div className="admin-order-product-row" key={index}>
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <strong>
                  {formatMoney(item.price * item.quantity, scannedOrder.currency)}
                </strong>
              </div>
            ))}
          </div>

          {scannedOrder.status !== "picked_up" && (
            <button
              type="button"
              className="admin-submit"
              onClick={() => handleStatusChange(scannedOrder, "picked_up")}
            >
              Mijozga berildi
            </button>
          )}
        </div>
      )}

      <div className="admin-card">
        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">Hozircha buyurtmalar yo‘q.</p>
        ) : (
          <div className="admin-order-list">
            {orders.map((order) => {
              const expanded = expandedId === order.id;
              const draft = draftFor(order);

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
                      <strong>{formatMoney(order.total, order.currency)}</strong>
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
                              {formatMoney(item.price * item.quantity, order.currency)}
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

                      {order.isInstallment && (
                        <div className="admin-installment-editor">
                          <span>Bo‘lib to‘lash shartlari</span>

                          <div className="admin-currency-options">
                            {CURRENCIES.map((c) => (
                              <label key={c.code} className="admin-currency-option">
                                <input
                                  type="radio"
                                  name={`installment-currency-${order.id}`}
                                  checked={(draft.currency || "UZS") === c.code}
                                  onChange={() => updateDraft(order, "currency", c.code)}
                                />
                                <span>{c.label}</span>
                              </label>
                            ))}
                          </div>

                          <div className="admin-installment-inputs">
                            <input
                              type="number"
                              placeholder="Necha oy"
                              value={draft.months}
                              onChange={(e) => updateDraft(order, "months", e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="Oylik summa"
                              value={draft.amount}
                              onChange={(e) => updateDraft(order, "amount", e.target.value)}
                            />
                            <button type="button" onClick={() => saveInstallment(order)}>
                              Saqlash
                            </button>
                          </div>
                        </div>
                      )}
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
