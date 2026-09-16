import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Battery,
  Camera,
  Cpu,
  HardDrive,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";

import { getPhoneFinderQuestions, getPhoneFinderRecommendations } from "../lib/api";
import "./phonefinder.css";

const STEP_KEYS = ["budgetId", "purpose", "os", "ram", "storage", "priority", "brand"];

const STEP_TITLES = [
  "Telefon uchun qancha budjet ajratgansiz?",
  "Telefondan asosan nima uchun foydalanasiz?",
  "Qaysi operatsion tizimni xohlaysiz?",
  "RAM qancha bo‘lishini xohlaysiz?",
  "Xotira qancha bo‘lishi kerak?",
  "Telefonning qaysi xususiyati siz uchun eng muhim?",
  "Qaysi brendlarni xohlaysiz?",
];

function PhoneFinder() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const [results, setResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultError, setResultError] = useState("");

  useEffect(() => {
    setLoadingQuestions(true);
    getPhoneFinderQuestions()
      .then(setQuestions)
      .catch((err) => setLoadError(err.message || "Savollarni yuklab bo‘lmadi"))
      .finally(() => setLoadingQuestions(false));
  }, []);

  const optionsForStep = () => {
    if (!questions) return [];
    switch (step) {
      case 1:
        return questions.budgets;
      case 2:
        return questions.purposes;
      case 3:
        return questions.os;
      case 4:
        return questions.ram;
      case 5:
        return questions.storage;
      case 6:
        return questions.priorities;
      case 7:
        return questions.brands;
      default:
        return [];
    }
  };

  const selectOption = async (optionId) => {
    const key = STEP_KEYS[step - 1];
    const nextAnswers = { ...answers, [key]: optionId };
    setAnswers(nextAnswers);

    if (step < 7) {
      setStep(step + 1);
      return;
    }

    setLoadingResults(true);
    setResultError("");

    try {
      const data = await getPhoneFinderRecommendations(nextAnswers);
      setResults(data);
      setStep(8);
    } catch (err) {
      setResultError(err.message || "Tavsiyalarni olib bo‘lmadi");
    } finally {
      setLoadingResults(false);
    }
  };

  const restart = () => {
    setStep(1);
    setAnswers({});
    setResults(null);
    setResultError("");
  };

  const goBack = () => {
    if (step > 1 && step <= 7) setStep(step - 1);
  };

  if (loadingQuestions) {
    return <main className="finder-page finder-loading">Yuklanmoqda...</main>;
  }

  if (loadError) {
    return (
      <main className="finder-page">
        <div className="finder-container">
          <div className="finder-no-results">
            <Search size={26} />
            <p>{loadError}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Qayta urinib ko‘rish
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="finder-page">
      <div className="finder-container">
        <button type="button" className="finder-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <h1 className="finder-title">Telefon tanlash yordamchisi</h1>
        <p className="finder-subtitle">
          Bir necha savolga javob bering — tizim javoblaringizga eng mos telefonlarni
          moslik foizi bilan tanlab beradi.
        </p>

        {step <= 7 && (
          <>
            <div className="finder-steps">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`finder-step-dot ${step >= i + 1 ? "active" : ""}`} />
              ))}
            </div>

            <div className="finder-card">
              <span className="finder-step-label">{step}-savol / 7</span>
              <h2>{STEP_TITLES[step - 1]}</h2>

              <div className="finder-options">
                {optionsForStep().map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    className={`finder-option ${answers[STEP_KEYS[step - 1]] === opt.id ? "active" : ""}`}
                    onClick={() => selectOption(opt.id)}
                    disabled={loadingResults}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {step > 1 && (
                <button type="button" className="finder-step-back" onClick={goBack}>
                  ← Oldingi savolga qaytish
                </button>
              )}

              {loadingResults && (
                <p className="finder-computing">Sizga mos telefonlar hisoblanmoqda...</p>
              )}

              {resultError && <p className="admin-error">{resultError}</p>}
            </div>
          </>
        )}

        {step === 8 && (
          <div className="finder-results">
            <div className="finder-results-header">
              <span>Siz uchun topilgan telefonlar ({results?.length || 0})</span>
              <button type="button" className="finder-restart" onClick={restart}>
                <RotateCcw size={14} />
                Qaytadan boshlash
              </button>
            </div>

            {!results || results.length === 0 ? (
              <div className="finder-no-results">
                <Search size={26} />
                <p>Bu shartlarga mos telefon topilmadi.</p>
                <button type="button" onClick={restart}>
                  Boshqa shartlar bilan qayta urinish
                </button>
              </div>
            ) : (
              <div className="finder-result-list">
                {results.map((product) => (
                  <article className="finder-result-card" key={product.id}>
                    <div className="finder-result-top">
                      <img src={product.image} alt={product.name} />

                      <div className="finder-result-info">
                        <span className="finder-result-brand">{product.brand}</span>
                        <strong>{product.name}</strong>
                        <span className="finder-result-price">
                          {product.price.toLocaleString("uz-UZ")} so‘m
                        </span>
                      </div>

                      <div className="finder-match-badge">
                        <strong>{product.matchPercent}%</strong>
                        <span>mos</span>
                      </div>
                    </div>

                    {product.overBudget && (
                      <span className="finder-overbudget-badge">
                        Budjetdan biroz yuqori
                      </span>
                    )}

                    {product.reasons?.length > 0 && (
                      <div className="finder-reasons">
                        <strong>Nega sizga mos?</strong>
                        <ul>
                          {product.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="finder-spec-chips">
                      {product.ramGb && (
                        <span>
                          <Cpu size={12} /> {product.ramGb} GB RAM
                        </span>
                      )}
                      {product.storageGb && (
                        <span>
                          <HardDrive size={12} />{" "}
                          {product.storageGb >= 1024 ? "1 TB" : `${product.storageGb} GB`}
                        </span>
                      )}
                      {product.cameraScore && (
                        <span>
                          <Camera size={12} /> Kamera {product.cameraScore}/5
                        </span>
                      )}
                      {product.batteryScore && (
                        <span>
                          <Battery size={12} /> Batareya {product.batteryScore}/5
                        </span>
                      )}
                      {product.chipset && (
                        <span>
                          <ShieldCheck size={12} /> {product.chipset}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="finder-view-product"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Mahsulotni ko‘rish
                    </button>
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
