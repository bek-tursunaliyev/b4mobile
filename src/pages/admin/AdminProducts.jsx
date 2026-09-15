import React, { useEffect, useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";

import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProducts,
  adminUpdateProduct,
  adminUploadImage,
} from "../../lib/api";

const EMPTY_FORM = {
  id: null,
  name: "",
  brand: "",
  category: "",
  price: "",
  oldPrice: "",
  stock: "",
  rating: "",
  reviews: "",
  image: "",
  description: "",
  specs: [],
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
      stock: product.stock,
      rating: product.rating || "",
      reviews: product.reviews || "",
      image: product.image || "",
      description: product.description || "",
      specs: product.specs || [],
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
      stock: form.stock ? Number(form.stock) : 0,
      rating: form.rating ? Number(form.rating) : 0,
      reviews: form.reviews ? Number(form.reviews) : 0,
      image: form.image || null,
      description: form.description.trim() || null,
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
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

          <div className="admin-form-row">
            <label>
              <span>Narx (so‘m) *</span>
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
              <span>Reyting (0–5)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </label>

            <label>
              <span>Sharhlar soni</span>
              <input
                type="number"
                value={form.reviews}
                onChange={(e) => setForm({ ...form, reviews: e.target.value })}
              />
            </label>

            <label>
              <span>Rasm</span>
              <div className="admin-file-input">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <Upload size={15} />
                {uploading ? "Yuklanmoqda..." : "Rasm tanlang"}
              </div>
            </label>
          </div>

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

          <div className="admin-specs-editor">
            <div className="admin-card-header">
              <span>Xususiyatlari</span>
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

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? "Saqlanmoqda..." : form.id ? "Saqlash" : "Qo‘shish"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Barcha mahsulotlar ({products.length})</h2>

        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : products.length === 0 ? (
          <p className="admin-empty">Hozircha mahsulot yo‘q.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
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
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image && (
                        <img src={product.image} alt="" className="admin-row-thumb" />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price.toLocaleString("uz-UZ")} so‘m</td>
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
