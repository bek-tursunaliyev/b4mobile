import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

import { getProducts } from "../lib/api";
import { useCart } from "../hooks/useCart";
import "./installment.css";

const MONTH_OPTIONS = [3, 6, 12, 24];

function Installement() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [months, setMonths] = useState(12);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [products, query]);

  const monthlyPayment = selected ? Math.ceil(selected.price / months) : 0;

  const handleBuy = () => {
    if (!selected) return;

    addToCart(selected, 1);
    navigate("/checkout", {
      state: {
        note: `Bo‘lib to‘lash: ${months} oy, oyiga ${monthlyPayment.toLocaleString(
          "uz-UZ"
        )} so‘m`,
      },
    });
  };

  return (
    <main className="installment-page">
      <div className="installment-container">
        <button type="button" className="installment-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="installment-title">Bo‘lib to‘lash</h1>
        <p className="installment-subtitle">
          Mahsulotni tanlang va necha oyga bo‘lib to‘lashni hisoblang.
          To‘lov 0% ustama bilan — faqat mahsulot narxi oylarga bo‘linadi.
        </p>

        <div className="installment-card">
          <label className="installment-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Mahsulot nomini kiriting..."
              value={selected ? selected.name : query}
              onChange={(e) => {
                setSelected(null);
                setQuery(e.target.value);
              }}
            />
          </label>

          {!selected && options.length > 0 && (
            <div className="installment-options">
              {options.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className="installment-option"
                  onClick={() => {
                    setSelected(p);
                    setQuery("");
                  }}
                >
                  <img src={p.image} alt={p.name} />
                  <span>{p.name}</span>
                  <strong>{p.price.toLocaleString("uz-UZ")} so‘m</strong>
                </button>
              ))}
            </div>
          )}

          {selected && (
            <>
              <div className="installment-months">
                <span>Necha oyga?</span>
                <div className="installment-month-options">
                  {MONTH_OPTIONS.map((m) => (
                    <button
                      type="button"
                      key={m}
                      className={`installment-month ${months === m ? "active" : ""}`}
                      onClick={() => setMonths(m)}
                    >
                      {m} oy
                    </button>
                  ))}
                </div>
              </div>

              <div className="installment-summary">
                <div className="installment-summary-row">
                  <span>Mahsulot narxi</span>
                  <strong>{selected.price.toLocaleString("uz-UZ")} so‘m</strong>
                </div>
                <div className="installment-summary-row">
                  <span>Muddat</span>
                  <strong>{months} oy</strong>
                </div>
                <div className="installment-summary-divider" />
                <div className="installment-summary-total">
                  <span>Oylik to‘lov</span>
                  <strong>{monthlyPayment.toLocaleString("uz-UZ")} so‘m / oy</strong>
                </div>
              </div>

              <button type="button" className="installment-buy" onClick={handleBuy}>
                Shu shartlarda sotib olish
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Installement;
