import React, { useEffect, useState } from "react";

import { adminGetOrders, adminGetProducts } from "../../lib/api";

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
  const income = validOrders.reduce((sum, o) => sum + o.total, 0);

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));

  const netProfit = validOrders.reduce((sum, order) => {
    const orderProfit = (order.items || []).reduce((itemSum, item) => {
      const product = productById[item.id];
      if (!product || product.costPrice == null) return itemSum;
      return itemSum + (item.price - product.costPrice) * item.quantity;
    }, 0);
    return sum + orderProfit;
  }, 0);

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
            <strong>{income.toLocaleString("uz-UZ")} so‘m</strong>
            <span>Jami kirim</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <strong className={netProfit >= 0 ? "admin-report-positive" : "admin-report-negative"}>
              {netProfit.toLocaleString("uz-UZ")} so‘m
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
                    +{order.total.toLocaleString("uz-UZ")} so‘m
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
