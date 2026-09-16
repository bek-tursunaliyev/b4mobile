import React, { useEffect, useState } from "react";

import { adminGetOrders, adminGetProducts } from "../../lib/api";
import { formatMoney } from "../../lib/currency";

function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([adminGetOrders(), adminGetProducts()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const validOrders = orders.filter((o) => o.status !== "cancelled");

  // Orders (and the products in them) can be priced in different
  // currencies, so income/profit are tracked per currency instead of
  // being summed together into one misleading number.
  const incomeByCurrency = validOrders.reduce((acc, o) => {
    const currency = o.currency || "UZS";
    acc[currency] = (acc[currency] || 0) + o.total;
    return acc;
  }, {});

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));

  const profitByCurrency = validOrders.reduce((acc, order) => {
    const currency = order.currency || "UZS";
    const orderProfit = (order.items || []).reduce((itemSum, item) => {
      const product = productById[item.id];
      if (!product || product.costPrice == null) return itemSum;
      if ((product.currency || "UZS") !== currency) return itemSum;
      return itemSum + (item.price - product.costPrice) * item.quantity;
    }, 0);
    acc[currency] = (acc[currency] || 0) + orderProfit;
    return acc;
  }, {});

  const incomeCurrencies = Object.keys(incomeByCurrency);
  const profitCurrencies = Object.keys(profitByCurrency);

  if (loading) {
    return <p className="admin-loading">Yuklanmoqda...</p>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Hisobot</h1>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-stats-grid admin-report-stats">
        <div className="admin-stat-card">
          <div>
            <strong>
              {incomeCurrencies.length === 0
                ? formatMoney(0, "UZS")
                : incomeCurrencies.map((c) => formatMoney(incomeByCurrency[c], c)).join(" + ")}
            </strong>
            <span>Jami kirim</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <strong>
              {profitCurrencies.length === 0 ? (
                formatMoney(0, "UZS")
              ) : (
                profitCurrencies.map((c, i) => (
                  <span
                    key={c}
                    className={profitByCurrency[c] >= 0 ? "admin-report-positive" : "admin-report-negative"}
                  >
                    {i > 0 ? " + " : ""}
                    {formatMoney(profitByCurrency[c], c)}
                  </span>
                ))
              )}
            </strong>
            <span>Sof foyda</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>So‘nggi kirimlar</h2>

        {validOrders.length === 0 ? (
          <p className="admin-empty">Hozircha buyurtma yo‘q.</p>
        ) : (
          <div className="admin-report-timeline">
            {validOrders
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <div className="admin-report-row" key={order.id}>
                  <div>
                    <span className="admin-report-label">
                      {order.orderCode} — {order.fullName}
                    </span>
                    <span className="admin-report-date">
                      {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>

                  <strong className="admin-report-positive">
                    +{formatMoney(order.total, order.currency)}
                  </strong>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
