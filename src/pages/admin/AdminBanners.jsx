import React, { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

import {
  adminCreateBanner,
  adminDeleteBanner,
  adminGetBanners,
  adminUpdateBanner,
  adminUploadImage,
} from "../../lib/api";

const EMPTY_FORM = {
  id: null,
  image: "",
  title: "",
  subtitle: "",
  sortOrder: 0,
};

function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminGetBanners()
      .then(setBanners)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleEdit = (banner) => {
    setForm({
      id: banner.id,
      image: banner.image,
      title: banner.title || "",
      subtitle: banner.text || "",
      sortOrder: banner.sortOrder || 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bannerni o‘chirishni tasdiqlaysizmi?")) return;
    await adminDeleteBanner(id);
    load();
  };

  const toggleActive = async (banner) => {
    await adminUpdateBanner(banner.id, { isActive: !banner.isActive });
    load();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await adminUploadImage(file, "banners");
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      setError("Rasm tanlash majburiy");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      image: form.image,
      title: form.title.trim() || null,
      subtitle: form.subtitle.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (form.id) {
        await adminUpdateBanner(form.id, payload);
      } else {
        await adminCreateBanner(payload);
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
      <h1 className="admin-page-title">Bosh sahifa banneri</h1>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{form.id ? "Bannerni tahrirlash" : "Yangi banner qo‘shish"}</h2>

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
              <span>Sarlavha</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <label>
              <span>Qisqa matn</span>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </label>

            <label>
              <span>Tartib raqami</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </label>
          </div>

          <label>
            <span>Rasm *</span>
            <div className="admin-file-input">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <Upload size={15} />
              {uploading ? "Yuklanmoqda..." : "Rasm tanlang"}
            </div>
          </label>

          {form.image && (
            <img src={form.image} alt="Preview" className="admin-image-preview banner" />
          )}

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-submit" disabled={saving}>
            {saving ? "Saqlanmoqda..." : form.id ? "Saqlash" : "Qo‘shish"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Barcha bannerlar ({banners.length})</h2>

        {loading ? (
          <p className="admin-loading">Yuklanmoqda...</p>
        ) : banners.length === 0 ? (
          <p className="admin-empty">Hozircha banner yo‘q.</p>
        ) : (
          <div className="admin-banner-list">
            {banners.map((banner) => (
              <div className="admin-banner-item" key={banner.id}>
                <img src={banner.image} alt={banner.title} />

                <div className="admin-banner-info">
                  <strong>{banner.title || "(sarlavhasiz)"}</strong>
                  <span>{banner.text}</span>
                </div>

                <div className="admin-row-actions">
                  <button
                    type="button"
                    className={`admin-toggle ${banner.isActive ? "on" : ""}`}
                    onClick={() => toggleActive(banner)}
                  >
                    {banner.isActive ? "Faol" : "Yashirilgan"}
                  </button>
                  <button type="button" onClick={() => handleEdit(banner)}>
                    Tahrirlash
                  </button>
                  <button
                    type="button"
                    className="admin-danger"
                    onClick={() => handleDelete(banner.id)}
                  >
                    O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBanners;
