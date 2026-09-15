import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, SearchX } from "lucide-react";

import "../components/comingsoon.css";

function NotFound() {
  return (
    <main className="coming-soon">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <SearchX size={30} />
        </div>

        <span className="coming-soon-tag">404</span>

        <h1>Sahifa topilmadi</h1>

        <p>Siz izlagan sahifa mavjud emas yoki o‘chirilgan.</p>

        <Link to="/" className="coming-soon-cta">
          Bosh sahifaga qaytish
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
