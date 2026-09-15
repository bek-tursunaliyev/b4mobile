import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Star, X } from "lucide-react";

import { getProducts } from "../lib/api";
import "./compare.css";

const MAX_SLOTS = 3;

// Pulls the first number out of a spec string ("256 GB" -> 256,
// "3274 mAh" -> 3274) so free-text admin specs can still be compared.
function parseNumeric(value) {
  if (value === null || value === undefined) return null;
  const match = String(value).replace(/\s/g, "").match(/[\d.,]+/);
  if (!match) return null;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return Number.isNaN(num) ? null : num;
}

// For each row, marks the best value green and the worst red.
// `invert` flips the meaning for rows where a smaller number is better (price).
function getRowClasses(cells, invert) {
  const parsed = cells.map((c) => ({ ...c, num: parseNumeric(c.value) }));
  const numeric = parsed.filter((c) => c.num !== null);

  if (numeric.length < 2) return {};

  const max = Math.max(...numeric.map((c) => c.num));
  const min = Math.min(...numeric.map((c) => c.num));
  if (max === min) return {};

  const classes = {};
  parsed.forEach((c) => {
    if (c.num === null) return;
    if (c.num === max) classes[c.id] = invert ? "compare-low" : "compare-high";
    else if (c.num === min) classes[c.id] = invert ? "compare-high" : "compare-low";
  });
  return classes;
}

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

  const selectedProducts = useMemo(
    () => selectedIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [selectedIds, products]
  );

  const specLabels = useMemo(() => {
    const labels = new Set();
    selectedProducts.forEach((p) => (p.specs || []).forEach((s) => labels.add(s.label)));
    return Array.from(labels);
  }, [selectedProducts]);

  const rows = useMemo(() => {
    const base = [
      {
        label: "Narx",
        invert: true,
        value: (p) => p.price,
        display: (p) => `${p.price.toLocaleString("uz-UZ")} so‘m`,
      },
      {
        label: "Reyting",
        invert: false,
        value: (p) => p.rating,
        display: (p) => `${p.rating} ⭐ (${p.reviews})`,
      },
      {
        label: "Omborda",
        invert: false,
        value: (p) => p.stock,
        display: (p) => (p.stock > 0 ? `${p.stock} dona` : "Mavjud emas"),
      },
    ];

    const specs = specLabels.map((label) => ({
      label,
      invert: false,
      value: (p) => {
        const spec = (p.specs || []).find((s) => s.label === label);
        return spec ? spec.value : null;
      },
      display: (p) => {
        const spec = (p.specs || []).find((s) => s.label === label);
        return spec ? spec.value : "—";
      },
    }));

    return [...base, ...specs];
  }, [specLabels]);

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

        <h1 className="compare-title">Telefonlarni taqqoslash</h1>
        <p className="compare-subtitle">
          2 yoki 3 ta mahsulot tanlang — eng yaxshi ko‘rsatkich{" "}
          <span className="compare-legend-good">yashil</span>, eng past ko‘rsatkich{" "}
          <span className="compare-legend-bad">qizil</span> rangda belgilanadi.
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
                {rows.map((row) => {
                  const cells = selectedProducts.map((p) => ({
                    id: p.id,
                    value: row.value(p),
                  }));
                  const classes =
                    selectedProducts.length > 1 ? getRowClasses(cells, row.invert) : {};

                  return (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {selectedProducts.map((p) => (
                        <td
                          key={p.id}
                          className={`compare-cell ${classes[p.id] || ""}`}
                        >
                          {row.label === "Reyting" ? (
                            <span className="compare-rating">
                              <Star size={13} fill="currentColor" />
                              {row.display(p)}
                            </span>
                          ) : (
                            row.display(p)
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

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
