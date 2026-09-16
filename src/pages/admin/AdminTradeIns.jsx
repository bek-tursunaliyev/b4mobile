import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { adminGetTradeIns, adminUpdateTradeIn } from "../../lib/api";

const STATUS_OPTIONS = [
  { value: "pending", label: "Ko‘rib chiqilmoqda" },
  { value: "priced", label: "Narx taklif qilindi" },
  { value: "rejected", label: "Rad etildi" },
];

function AdminTradeIns() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceDrafts, setPriceDrafts] = useState({});
  const [editingIds, setEditingIds] = useState({});

  const load = () => {
    setLoading(true);
    adminGetTradeIns()
      .then((data) => {
        setRequests(data);
        setPriceDrafts(
          Object.fromEntries(data.map((r) => [r.id, r.offeredPrice ?? ""]))
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (req, status) => {
    const updated = await adminUpdateTradeIn(req.id, { status });
    setRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)));
  };

  const handlePriceSubmit = async (req) => {
    const price = Number(priceDrafts[req.id]);
    if (!price) return;

    const updated = await adminUpdateTradeIn(req.id, {
      offeredPrice: price,
      status: "priced",
    });
    setRequests((prev) => prev.map((r) => (r.id === req.id ? updated : r)));
    setEditingIds((prev) => ({ ...prev, [req.id]: false }));
  };

  const isEditingPrice = (req) => req.status !== "priced" || editingIds[req.id];

  const startEditPrice = (req) => {
    setEditingIds((prev) => ({ ...prev, [req.id]: true }));
  };

  return (
    <div>
      <h1 className="admin-page-title">Telefon almashish so‘rovlari</h1>

      <div className="admin-card">
        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : requests.length === 0 ? (
          <p className="admin-empty">Hozircha so‘rov yo‘q.</p>
        ) : (
          <div className="admin-tradein-list">
            {requests.map((req) => (
              <div className="admin-tradein-item" key={req.id}>
                {req.image ? (
                  <img src={req.image} alt={req.model} />
                ) : (
                  <div className="admin-tradein-noimage">Rasm yo‘q</div>
                )}

                <div className="admin-tradein-info">
                  <strong>{req.brand} {req.model}</strong>
                  <span>
                    Holati: {req.condition || "—"} · RAM: {req.ram || "—"} · Xotira:{" "}
                    {req.storage || "—"} · Batareya: {req.batteryHealth || "—"}
                  </span>
                  <span>
                    {req.isBroken && "Singan/nosoz · "}
                    {req.hasScratches && "Chizilgan joyi bor · "}
                    {req.hasBox ? "Karobkasi bor" : "Karobkasi yo‘q"}
                  </span>
                  {req.note && <span>Izoh: {req.note}</span>}
                  <span className="admin-tradein-user">
                    {req.telegramUsername ? `@${req.telegramUsername}` : `ID: ${req.telegramUserId}`}
                    {" · "}
                    {new Date(req.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <div className="admin-tradein-actions">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {isEditingPrice(req) ? (
                    <div className="admin-tradein-price">
                      <input
                        type="number"
                        placeholder="Narx"
                        value={priceDrafts[req.id] ?? ""}
                        onChange={(e) =>
                          setPriceDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                      />
                      <button type="button" onClick={() => handlePriceSubmit(req)}>
                        Belgilash
                      </button>
                    </div>
                  ) : (
                    <div className="admin-tradein-priced">
                      <span className="admin-tradein-priced-tick">
                        <Check size={14} />
                        {Number(req.offeredPrice).toLocaleString("uz-UZ")} so‘m
                      </span>
                      <button type="button" onClick={() => startEditPrice(req)}>
                        Narxni o‘zgartirish
                      </button>
                    </div>
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

export default AdminTradeIns;
