import React, { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";

import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProducts,
  adminUpdateProduct,
  adminUploadImage,
} from "../../lib/api";
import { CURRENCIES, formatMoney } from "../../lib/currency";

const RAM_OPTIONS = [4, 6, 8, 12, 16];
const STORAGE_OPTIONS = [64, 128, 256, 512, 1024];

const PRIMARY_USE_OPTIONS = [
  { id: "kundalik", label: "Kundalik" },
  { id: "gaming", label: "Gaming" },
  { id: "kamera", label: "Kamera" },
  { id: "ish", label: "Ish" },
  { id: "oqish", label: "O‘qish" },
  { id: "ijtimoiy", label: "Ijtimoiy tarmoqlar" },
];

const SCORE_FIELDS = [
  { key: "cameraScore", label: "Kamera" },
  { key: "performanceScore", label: "Performance" },
  { key: "batteryScore", label: "Batareya" },
  { key: "displayScore", label: "Ekran" },
  { key: "gamingScore", label: "Gaming" },
  { key: "chargingScore", label: "Tez zaryad" },
  { key: "softwareScore", label: "Software support" },
];

const EMPTY_FORM = {
  id: null,
  name: "",
  brand: "",
  category: "",
  price: "",
  oldPrice: "",
  costPrice: "",
  currency: "UZS",
  stock: "",
  image: "",
  description: "",
  specs: [],
  deliveryAvailable: true,
  deliveryPrice: "",
  warranty: "",
  ramGb: "",
  storageGb: "",
  screen: "",
  camera: "",
  battery: "",
  ipRating: "",
  phoneFinderEnabled: false,
  os: "",
  primaryUses: [],
  cameraScore: "",
  performanceScore: "",
  batteryScore: "",
  displayScore: "",
  gamingScore: "",
  chargingScore: "",
  softwareScore: "",
  refreshRateHz: "",
  batteryCapacityMah: "",
  chipset: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [idSearch, setIdSearch] = useState("");

  const visibleProducts = idSearch.trim()
    ? products.filter((p) => String(p.id) === idSearch.trim())
    : products;

  const load = () => {
    setLoading(true);
    adminGetProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || "",
      costPrice: product.costPrice ?? "",
      currency: product.currency || "UZS",
      stock: product.stock,
      image: product.image || "",
      description: product.description || "",
      specs: product.specs || [],
      deliveryAvailable: product.deliveryAvailable ?? true,
      deliveryPrice: product.deliveryPrice ?? "",
      warranty: product.warranty || "",
      ramGb: product.ramGb || "",
      storageGb: product.storageGb || "",
      screen: product.screen || "",
      camera: product.camera || "",
      battery: product.battery || "",
      ipRating: product.ipRating || "",
      phoneFinderEnabled: product.phoneFinderEnabled || false,
      os: product.os || "",
      primaryUses: product.primaryUses || [],
      cameraScore: product.cameraScore || "",
      performanceScore: product.performanceScore || "",
      batteryScore: product.batteryScore || "",
      displayScore: product.displayScore || "",
      gamingScore: product.gamingScore || "",
      chargingScore: product.chargingScore || "",
      softwareScore: product.softwareScore || "",
      refreshRateHz: product.refreshRateHz || "",
      batteryCapacityMah: product.batteryCapacityMah || "",
      chipset: product.chipset || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mahsulotni butunlay o‘chirishni tasdiqlaysizmi?")) return;
    await adminDeleteProduct(id);
    load();
  };

  const toggleActive = async (product) => {
    await adminUpdateProduct(product.id, { isActive: !product.isActive });
    load();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await adminUploadImage(file, "products");
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const updateSpec = (index, field, value) => {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specs };
    });
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const togglePrimaryUse = (useId) => {
    setForm((prev) => ({
      ...prev,
      primaryUses: prev.primaryUses.includes(useId)
        ? prev.primaryUses.filter((u) => u !== useId)
        : [...prev.primaryUses, useId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim() || form.price === "") {
      setError("Nomi, kategoriya va narx majburiy");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || null,
      category: form.category.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      costPrice: form.costPrice !== "" ? Number(form.costPrice) : null,
      currency: form.currency,
      stock: form.stock ? Number(form.stock) : 0,
      image: form.image || null,
      description: form.description.trim() || null,
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
      deliveryAvailable: form.deliveryAvailable,
      deliveryPrice: form.deliveryAvailable
        ? form.deliveryPrice === ""
          ? 0
          : Number(form.deliveryPrice)
        : null,
      warranty: form.warranty.trim() || null,
      ramGb: form.ramGb ? Number(form.ramGb) : null,
      storageGb: form.storageGb ? Number(form.storageGb) : null,
      screen: form.screen.trim() || null,
      camera: form.camera.trim() || null,
      battery: form.battery.trim() || null,
      ipRating: form.ipRating.trim() || null,
      phoneFinderEnabled: form.phoneFinderEnabled,
      os: form.os || null,
      primaryUses: form.primaryUses,
      cameraScore: form.cameraScore ? Number(form.cameraScore) : null,
      performanceScore: form.performanceScore ? Number(form.performanceScore) : null,
      batteryScore: form.batteryScore ? Number(form.batteryScore) : null,
      displayScore: form.displayScore ? Number(form.displayScore) : null,
      gamingScore: form.gamingScore ? Number(form.gamingScore) : null,
      chargingScore: form.chargingScore ? Number(form.chargingScore) : null,
      softwareScore: form.softwareScore ? Number(form.softwareScore) : null,
      refreshRateHz: form.refreshRateHz ? Number(form.refreshRateHz) : null,
      batteryCapacityMah: form.batteryCapacityMah ? Number(form.batteryCapacityMah) : null,
      chipset: form.chipset.trim() || null,
    };

    try {
      if (form.id) {
        await adminUpdateProduct(form.id, payload);
      } else {
        await adminCreateProduct(payload);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Mahsulotlar</h1>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{form.id ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}</h2>

          {form.id && (
            <button type="button" className="admin-link-btn" onClick={resetForm}>
              <X size={15} />
              Bekor qilish
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <label>
              <span>Nomi *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label>
              <span>Brend</span>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </label>

            <label>
              <span>Kategoriya *</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-currency-row">
            <span>Narx valyutasi</span>
            <div className="admin-currency-options">
              {CURRENCIES.map((c) => (
                <label key={c.code} className="admin-currency-option">
                  <input
                    type="radio"
                    name="product-currency"
                    checked={form.currency === c.code}
                    onChange={() => setForm({ ...form, currency: c.code })}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="admin-form-row">
            <label>
              <span>Narx *</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>

            <label>
              <span>Eski narx</span>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              />
            </label>

            <label>
              <span>Omborda</span>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              <span>Tannarx (xarid narxi)</span>
              <input
                type="number"
                placeholder="Faqat siz ko‘rasiz, mijozga chiqmaydi"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              />
            </label>
          </div>

          {form.price !== "" && form.costPrice !== "" && (
            <p className="admin-profit-hint">
              Bitta mahsulotdan sof foyda:{" "}
              <strong>
                {formatMoney(Number(form.price) - Number(form.costPrice), form.currency)}
              </strong>
            </p>
          )}

          <label>
            <span>Rasm</span>
            <div className="admin-file-input">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <Upload size={15} />
              {uploading ? "Yuklanmoqda..." : "Rasm tanlang"}
            </div>
          </label>

          {form.image && (
            <img src={form.image} alt="Preview" className="admin-image-preview" />
          )}

          <label className="admin-form-full">
            <span>Tavsif</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="admin-corespecs-editor">
            <div className="admin-card-header">
              <span>Asosiy xususiyatlar</span>
            </div>

            <div className="admin-form-row">
              <label>
                <span>RAM (GB)</span>
                <select
                  value={form.ramGb}
                  onChange={(e) => setForm({ ...form, ramGb: e.target.value })}
                >
                  <option value="">Tanlanmagan</option>
                  {RAM_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r} GB
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Doimiy xotira (Storage)</span>
                <select
                  value={form.storageGb}
                  onChange={(e) => setForm({ ...form, storageGb: e.target.value })}
                >
                  <option value="">Tanlanmagan</option>
                  {STORAGE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s >= 1024 ? "1 TB" : `${s} GB`}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                <span>Ekran</span>
                <input
                  type="text"
                  placeholder="Masalan: 6.7” AMOLED, 120Hz (bo‘sh qoldirsangiz “-” ko‘rsatiladi)"
                  value={form.screen}
                  onChange={(e) => setForm({ ...form, screen: e.target.value })}
                />
              </label>

              <label>
                <span>Kamera</span>
                <input
                  type="text"
                  placeholder="Masalan: 50 MP + 12 MP + 5 MP"
                  value={form.camera}
                  onChange={(e) => setForm({ ...form, camera: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                <span>Batareya</span>
                <input
                  type="text"
                  placeholder="Masalan: 5000 mAh"
                  value={form.battery}
                  onChange={(e) => setForm({ ...form, battery: e.target.value })}
                />
              </label>

              <label>
                <span>Himoya darajasi (IP rating)</span>
                <input
                  type="text"
                  placeholder="Masalan: IP68"
                  value={form.ipRating}
                  onChange={(e) => setForm({ ...form, ipRating: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="admin-specs-editor">
            <div className="admin-card-header">
              <span>Qo‘shimcha xususiyatlar</span>
              <button type="button" className="admin-link-btn" onClick={addSpec}>
                <Plus size={15} />
                Qo‘shish
              </button>
            </div>

            {form.specs.map((spec, index) => (
              <div className="admin-spec-row" key={index}>
                <input
                  type="text"
                  placeholder="Nomi (masalan: RAM)"
                  value={spec.label}
                  onChange={(e) => updateSpec(index, "label", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Qiymati (masalan: 8 GB)"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                />
                <button type="button" onClick={() => removeSpec(index)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="admin-delivery-editor">
            <div className="admin-card-header">
              <span>Yetkazib berish va kafolat</span>
              <button
                type="button"
                className={`admin-toggle ${form.deliveryAvailable ? "on" : ""}`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    deliveryAvailable: !prev.deliveryAvailable,
                  }))
                }
              >
                {form.deliveryAvailable ? "Yetkazib berish bor" : "Yetkazib berish yo‘q"}
              </button>
            </div>

            {form.deliveryAvailable && (
              <div className="admin-delivery-row">
                <input
                  type="number"
                  placeholder="Yetkazib berish narxi"
                  value={form.deliveryPrice}
                  disabled={form.deliveryPrice === 0}
                  onChange={(e) => setForm({ ...form, deliveryPrice: e.target.value })}
                />
                <label className="admin-delivery-free">
                  <input
                    type="checkbox"
                    checked={form.deliveryPrice === 0}
                    onChange={(e) =>
                      setForm({ ...form, deliveryPrice: e.target.checked ? 0 : "" })
                    }
                  />
                  <span>Bepul</span>
                </label>
              </div>
            )}

            <label className="admin-form-full" style={{ marginTop: 14 }}>
              <span>Kafolat</span>
              <input
                type="text"
                placeholder="Masalan: 12 oy (bo‘sh qoldirsangiz ko‘rsatilmaydi)"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-phonefinder-editor">
            <div className="admin-card-header">
              <span>Telefon tanlash uchun parametrlar</span>
              <button
                type="button"
                className={`admin-toggle ${form.phoneFinderEnabled ? "on" : ""}`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    phoneFinderEnabled: !prev.phoneFinderEnabled,
                  }))
                }
              >
                {form.phoneFinderEnabled ? "Enabled for Phone Finder" : "Enable for Phone Finder"}
              </button>
            </div>

            {form.phoneFinderEnabled && (
              <>
                <div className="admin-form-row">
                  <label>
                    <span>Operatsion tizim</span>
                    <select
                      value={form.os}
                      onChange={(e) => setForm({ ...form, os: e.target.value })}
                    >
                      <option value="">Tanlanmagan</option>
                      <option value="android">Android</option>
                      <option value="ios">iOS</option>
                    </select>
                  </label>

                  <label>
                    <span>Ekran yangilanish tezligi (Hz)</span>
                    <input
                      type="number"
                      value={form.refreshRateHz}
                      onChange={(e) => setForm({ ...form, refreshRateHz: e.target.value })}
                    />
                  </label>

                  <label>
                    <span>Batareya sig‘imi (mAh)</span>
                    <input
                      type="number"
                      value={form.batteryCapacityMah}
                      onChange={(e) => setForm({ ...form, batteryCapacityMah: e.target.value })}
                    />
                  </label>
                </div>

                <label className="admin-form-full">
                  <span>Chipset</span>
                  <input
                    type="text"
                    placeholder="Masalan: Snapdragon 8 Gen 3"
                    value={form.chipset}
                    onChange={(e) => setForm({ ...form, chipset: e.target.value })}
                  />
                </label>

                <div className="admin-form-full">
                  <span>Asosiy foydalanish</span>
                  <div className="admin-checkbox-group">
                    {PRIMARY_USE_OPTIONS.map((use) => (
                      <label key={use.id} className="admin-checkbox-pill">
                        <input
                          type="checkbox"
                          checked={form.primaryUses.includes(use.id)}
                          onChange={() => togglePrimaryUse(use.id)}
                        />
                        <span>{use.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="admin-score-grid">
                  {SCORE_FIELDS.map((field) => (
                    <label key={field.key}>
                      <span>{field.label} (1-5)</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? "Saqlanmoqda..." : form.id ? "Saqlash" : "Qo‘shish"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Barcha mahsulotlar ({products.length})</h2>

        <div className="admin-search-row">
          <input
            type="text"
            placeholder="ID orqali qidirish..."
            value={idSearch}
            onChange={(e) => setIdSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : visibleProducts.length === 0 ? (
          <p className="admin-empty">
            {idSearch.trim() ? "Bu ID bo‘yicha mahsulot topilmadi." : "Hozircha mahsulot yo‘q."}
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th></th>
                  <th>Nomi</th>
                  <th>Kategoriya</th>
                  <th>Narx</th>
                  <th>Omborda</th>
                  <th>Holat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.image && (
                        <img src={product.image} alt="" className="admin-row-thumb" loading="lazy" />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatMoney(product.price, product.currency)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        type="button"
                        className={`admin-toggle ${product.isActive ? "on" : ""}`}
                        onClick={() => toggleActive(product)}
                      >
                        {product.isActive ? "Faol" : "Yashirilgan"}
                      </button>
                    </td>
                    <td className="admin-row-actions">
                      <button type="button" onClick={() => handleEdit(product)}>
                        Tahrirlash
                      </button>
                      <button
                        type="button"
                        className="admin-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        O‘chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
