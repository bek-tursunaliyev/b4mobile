import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";

import "./notfound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <SearchX size={30} />
        </div>

        <span className="not-found-tag">404</span>

        <h1>Sahifa topilmadi</h1>

        <p>Siz izlagan sahifa mavjud emas yoki o‘chirilgan.</p>

        <Link to="/" className="not-found-cta">
          Bosh sahifaga qaytish
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
