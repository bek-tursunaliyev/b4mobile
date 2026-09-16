import React, { useEffect, useState } from "react";

import {
  adminCreateExpense,
  adminDeleteExpense,
  adminGetExpenses,
  adminGetOrders,
} from "../../lib/api";

function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ description: "", amount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([adminGetOrders(), adminGetExpenses()])
      .then(([o, e]) => {
        setOrders(o);
        setExpenses(e);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const income = validOrders.reduce((sum, o) => sum + o.total, 0);
  const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const net = income - expenseTotal;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;

    setSaving(true);
    setError("");

    try {
      const created = await adminCreateExpense({
        description: form.description.trim(),
        amount: Number(form.amount),
      });
      setExpenses((prev) => [created, ...prev]);
      setForm({ description: "", amount: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Xarajatni o‘chirishni tasdiqlaysizmi?")) return;
    await adminDeleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const timeline = [
    ...validOrders.map((o) => ({
      id: `order-${o.id}`,
      type: "kirim",
      label: `Buyurtma ${o.orderCode} — ${o.fullName}`,
      amount: o.total,
      date: o.createdAt,
    })),
    ...expenses.map((e) => ({
      id: `expense-${e.id}`,
      type: "chiqim",
      label: e.description,
      amount: e.amount,
      date: e.createdAt,
      raw: e,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return <p className="admin-loading">Yuklanmoqda...</p>;
  }

  return (
    <div>
      <h1 className="admin-page-title">Hisobot</h1>

      <div className="admin-stats-grid admin-report-stats">
        <div className="admin-stat-card">
          <div>
            <strong>{income.toLocaleString("uz-UZ")} so‘m</strong>
            <span>Jami kirim</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <strong>{expenseTotal.toLocaleString("uz-UZ")} so‘m</strong>
            <span>Jami chiqim</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div>
            <strong className={net >= 0 ? "admin-report-positive" : "admin-report-negative"}>
              {net.toLocaleString("uz-UZ")} so‘m
            </strong>
            <span>Sof foyda</span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Yangi xarajat qo‘shish</h2>

        <form className="admin-expense-form" onSubmit={handleAddExpense}>
          <input
            type="text"
            placeholder="Xarajat nima uchun (masalan: Ijara)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Summasi"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? "Saqlanmoqda..." : "Qo‘shish"}
          </button>
        </form>

        {error && <p className="admin-error">{error}</p>}
      </div>

      <div className="admin-card">
        <h2>Kirim va chiqimlar tarixi</h2>

        {timeline.length === 0 ? (
          <p className="admin-empty">Hozircha yozuv yo‘q.</p>
        ) : (
          <div className="admin-report-timeline">
            {timeline.map((item) => (
              <div className="admin-report-row" key={item.id}>
                <div>
                  <span className={`admin-report-tag admin-report-tag-${item.type}`}>
                    {item.type === "kirim" ? "Kirim" : "Chiqim"}
                  </span>
                  <span className="admin-report-label">{item.label}</span>
                  <span className="admin-report-date">
                    {new Date(item.date).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <div className="admin-report-row-right">
                  <strong
                    className={
                      item.type === "kirim" ? "admin-report-positive" : "admin-report-negative"
                    }
                  >
                    {item.type === "kirim" ? "+" : "-"}
                    {item.amount.toLocaleString("uz-UZ")} so‘m
                  </strong>

                  {item.raw && (
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => handleDeleteExpense(item.raw.id)}
                    >
                      O‘chirish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
