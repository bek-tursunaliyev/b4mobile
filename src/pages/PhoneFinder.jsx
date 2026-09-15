import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Search, ShoppingCart, Star } from "lucide-react";

import { getProducts } from "../lib/api";
import { useCart } from "../hooks/useCart";
import "./phonefinder.css";

const BUDGETS = [
  { id: "any", label: "Farqi yo‘q", min: 0, max: Infinity },
  { id: "low", label: "3 mln gacha", min: 0, max: 3000000 },
  { id: "mid", label: "3–10 mln", min: 3000000, max: 10000000 },
  { id: "high", label: "10 mln+", min: 10000000, max: Infinity },
];

function PhoneFinder() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [step, setStep] = useState(1);
  const [budgetId, setBudgetId] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const categories = useMemo(
    () => ["Barchasi", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const budget = BUDGETS.find((b) => b.id === budgetId) || BUDGETS[0];

  const results = useMemo(() => {
    return products
      .filter((p) => p.price >= budget.min && p.price <= budget.max)
      .filter((p) => !category || category === "Barchasi" || p.category === category)
      .sort((a, b) => b.rating - a.rating);
  }, [products, budget, category]);

  const restart = () => {
    setStep(1);
    setBudgetId(null);
    setCategory(null);
  };

  return (
    <main className="finder-page">
      <div className="finder-container">
        <button type="button" className="finder-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="finder-title">Telefon tanlash yordamchisi</h1>
        <p className="finder-subtitle">
          Bir necha savolga javob bering — sizga mos mahsulotlarni topamiz.
        </p>

        <div className="finder-steps">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`finder-step-dot ${step >= n ? "active" : ""}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="finder-card">
            <h2>Byudjetingiz qancha?</h2>
            <div className="finder-options">
              {BUDGETS.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  className={`finder-option ${budgetId === b.id ? "active" : ""}`}
                  onClick={() => {
                    setBudgetId(b.id);
                    setStep(2);
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="finder-card">
            <h2>Qaysi turkumdan izlaymiz?</h2>
            <div className="finder-options">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`finder-option ${category === c ? "active" : ""}`}
                  onClick={() => {
                    setCategory(c);
                    setStep(3);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <button type="button" className="finder-step-back" onClick={() => setStep(1)}>
              ← Byudjetni o‘zgartirish
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="finder-results">
            <div className="finder-results-header">
              <span>{results.length} ta mahsulot topildi</span>
              <button type="button" className="finder-restart" onClick={restart}>
                <RotateCcw size={14} />
                Qaytadan boshlash
              </button>
            </div>

            {results.length === 0 ? (
              <div className="finder-no-results">
                <Search size={26} />
                <p>Bu shartlarga mos mahsulot topilmadi.</p>
                <button type="button" onClick={restart}>
                  Boshqa shartlar bilan qayta urinish
                </button>
              </div>
            ) : (
              <div className="finder-grid">
                {results.map((product) => (
                  <article
                    className="finder-product-card"
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="finder-product-info">
                      <span>{product.category}</span>
                      <strong>{product.name}</strong>
                      <div className="finder-product-rating">
                        <Star size={13} fill="currentColor" />
                        {product.rating}
                      </div>
                      <div className="finder-product-bottom">
                        <strong>{product.price.toLocaleString("uz-UZ")} so‘m</strong>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default PhoneFinder;
