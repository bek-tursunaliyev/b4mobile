import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Star, X } from "lucide-react";

import { getProducts } from "../lib/api";
import "./compare.css";

const MAX_SLOTS = 3;

function Compare() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => !selectedIds.includes(p.id))
      .filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [products, selectedIds, query]);

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const specLabels = useMemo(() => {
    const labels = new Set();
    selectedProducts.forEach((p) => (p.specs || []).forEach((s) => labels.add(s.label)));
    return Array.from(labels);
  }, [selectedProducts]);

  const addProduct = (id) => {
    if (selectedIds.length >= MAX_SLOTS) return;
    setSelectedIds((prev) => [...prev, id]);
    setQuery("");
  };

  const removeProduct = (id) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <main className="compare-page">
      <div className="compare-container">
        <button type="button" className="compare-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="compare-title">Mahsulotlarni taqqoslash</h1>
        <p className="compare-subtitle">
          Kamida 2 ta mahsulot tanlang, xususiyatlarini yonma-yon ko‘ring.
        </p>

        {selectedIds.length < MAX_SLOTS && (
          <div className="compare-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Mahsulot qo‘shish uchun qidiring..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query && (
              <div className="compare-search-results">
                {filteredOptions.length === 0 ? (
                  <div className="compare-search-empty">Mahsulot topilmadi</div>
                ) : (
                  filteredOptions.slice(0, 6).map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className="compare-search-option"
                      onClick={() => addProduct(p.id)}
                    >
                      <img src={p.image} alt={p.name} />
                      <span>{p.name}</span>
                      <strong>{p.price.toLocaleString("uz-UZ")} so‘m</strong>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {selectedProducts.length === 0 ? (
          <div className="compare-empty">Hali mahsulot tanlanmagan.</div>
        ) : (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th></th>
                  {selectedProducts.map((p) => (
                    <th key={p.id}>
                      <button
                        type="button"
                        className="compare-remove"
                        onClick={() => removeProduct(p.id)}
                      >
                        <X size={14} />
                      </button>
                      <img src={p.image} alt={p.name} />
                      <strong>{p.name}</strong>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Narx</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id}>
                      <strong>{p.price.toLocaleString("uz-UZ")} so‘m</strong>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Reyting</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id}>
                      <span className="compare-rating">
                        <Star size={13} fill="currentColor" />
                        {p.rating} ({p.reviews})
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Omborda</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id}>{p.stock > 0 ? `${p.stock} dona` : "Mavjud emas"}</td>
                  ))}
                </tr>

                {specLabels.map((label) => (
                  <tr key={label}>
                    <td>{label}</td>
                    {selectedProducts.map((p) => {
                      const spec = (p.specs || []).find((s) => s.label === label);
                      return <td key={p.id}>{spec ? spec.value : "—"}</td>;
                    })}
                  </tr>
                ))}

                <tr>
                  <td></td>
                  {selectedProducts.map((p) => (
                    <td key={p.id}>
                      <button
                        type="button"
                        className="compare-view"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        Ko‘rish
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default Compare;
