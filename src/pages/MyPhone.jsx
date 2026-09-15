import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Check, Smartphone } from "lucide-react";

import { getMyTradeIns, submitTradeIn } from "../lib/api";
import "./myphone.css";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Realme", "Huawei", "Boshqa"];
const CONDITIONS = ["Yangidek", "Yaxshi", "O‘rtacha", "Yomon"];

const STATUS_LABELS = {
  pending: "Ko‘rib chiqilmoqda",
  priced: "Narx taklif qilindi",
  rejected: "Rad etildi",
};

const EMPTY_FORM = {
  brand: "Apple",
  customBrand: "",
  model: "",
  condition: "Yaxshi",
  ram: "",
  storage: "",
  batteryHealth: "",
  isBroken: false,
  hasScratches: false,
  hasBox: false,
  note: "",
};

function MyPhone() {
  const navigate = useNavigate();

  const [hasTelegram, setHasTelegram] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    getMyTradeIns().then((res) => {
      setHasTelegram(res.ok);
      setRequests(res.requests);
      setCheckingAuth(false);
    });
  };

  useEffect(loadRequests, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.model.trim()) {
      setError("Model nomini kiriting (masalan: S24, A53)");
      return;
    }

    setSubmitting(true);
    setError("");

    const brand = form.brand === "Boshqa" ? form.customBrand.trim() : form.brand;

    try {
      await submitTradeIn(
        {
          brand,
          model: form.model.trim(),
          condition: form.condition,
          ram: form.ram.trim(),
          storage: form.storage.trim(),
          batteryHealth: form.batteryHealth.trim(),
          isBroken: form.isBroken,
          hasScratches: form.hasScratches,
          hasBox: form.hasBox,
          note: form.note.trim(),
        },
        file
      );

      setSuccess(true);
      setForm(EMPTY_FORM);
      setFile(null);
      setPreview("");
      loadRequests();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return <main className="myphone-page myphone-loading">Yuklanmoqda...</main>;
  }

  if (!hasTelegram) {
    return (
      <main className="myphone-page">
        <div className="myphone-empty">
          <div className="myphone-empty-icon">
            <Smartphone size={30} />
          </div>
          <h1>Bu bo‘lim mavjud emas</h1>
          <p>
            Eski telefoningizni topshirish uchun ilovani Telegram bot orqali
            oching.
          </p>
          <Link to="/catalog" className="myphone-cta">
            Katalogni ko‘rish
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="myphone-page">
      <div className="myphone-container">
        <button type="button" className="myphone-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="myphone-title">Mening telefonim</h1>
        <p className="myphone-subtitle">
          Eski telefoningiz ma’lumotlarini to‘ldiring — administrator ko‘rib
          chiqib, sizga narx taklif qiladi.
        </p>

        <form className="myphone-card" onSubmit={handleSubmit}>
          <label className="myphone-photo">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <div className="myphone-photo-placeholder">
                <Camera size={22} />
                <span>Telefon rasmini yuklang</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          <div className="myphone-form-row">
            <label>
              <span>Brend</span>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            {form.brand === "Boshqa" && (
              <label>
                <span>Brend nomi</span>
                <input
                  type="text"
                  value={form.customBrand}
                  onChange={(e) => setForm({ ...form, customBrand: e.target.value })}
                />
              </label>
            )}

            <label>
              <span>Model *</span>
              <input
                type="text"
                placeholder="Masalan: S24, A53"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </label>
          </div>

          <div className="myphone-form-row">
            <label>
              <span>Umumiy holati</span>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>RAM</span>
              <input
                type="text"
                placeholder="Masalan: 8 GB"
                value={form.ram}
                onChange={(e) => setForm({ ...form, ram: e.target.value })}
              />
            </label>

            <label>
              <span>Xotira</span>
              <input
                type="text"
                placeholder="Masalan: 256 GB"
                value={form.storage}
                onChange={(e) => setForm({ ...form, storage: e.target.value })}
              />
            </label>
          </div>

          <div className="myphone-form-row">
            <label>
              <span>Batareya holati</span>
              <input
                type="text"
                placeholder="Masalan: 85%"
                value={form.batteryHealth}
                onChange={(e) => setForm({ ...form, batteryHealth: e.target.value })}
              />
            </label>
          </div>

          <div className="myphone-checkboxes">
            <label className="myphone-checkbox">
              <input
                type="checkbox"
                checked={form.isBroken}
                onChange={(e) => setForm({ ...form, isBroken: e.target.checked })}
              />
              <span>Singan / nosoz joyi bor</span>
            </label>

            <label className="myphone-checkbox">
              <input
                type="checkbox"
                checked={form.hasScratches}
                onChange={(e) => setForm({ ...form, hasScratches: e.target.checked })}
              />
              <span>Chizilgan / qirilgan joyi bor</span>
            </label>

            <label className="myphone-checkbox">
              <input
                type="checkbox"
                checked={form.hasBox}
                onChange={(e) => setForm({ ...form, hasBox: e.target.checked })}
              />
              <span>Original karobkasi bor</span>
            </label>
          </div>

          <label>
            <span>Qo‘shimcha izoh</span>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>

          {error && <p className="myphone-error">{error}</p>}

          <button type="submit" className="myphone-submit" disabled={submitting}>
            {submitting ? "Yuborilmoqda..." : success ? (
              <>
                <Check size={17} /> Yuborildi
              </>
            ) : (
              "So‘rovni yuborish"
            )}
          </button>
        </form>

        {requests.length > 0 && (
          <div className="myphone-history">
            <h2>Mening so‘rovlarim</h2>

            {requests.map((req) => (
              <div className="myphone-history-item" key={req.id}>
                {req.image && <img src={req.image} alt={req.model} />}

                <div className="myphone-history-info">
                  <strong>{req.brand} {req.model}</strong>
                  <span>{new Date(req.createdAt).toLocaleDateString("uz-UZ")}</span>
                </div>

                <div className="myphone-history-status">
                  <span className={`myphone-status myphone-status-${req.status}`}>
                    {STATUS_LABELS[req.status] || req.status}
                  </span>
                  {req.offeredPrice && (
                    <strong>{req.offeredPrice.toLocaleString("uz-UZ")} so‘m</strong>
                  )}
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
