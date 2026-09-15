import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "./comingsoon.css";

function ComingSoon({ icon, title, description }) {
  const navigate = useNavigate();
  const Icon = icon;

  return (
    <main className="coming-soon">
      <div className="coming-soon-card">
        <button
          type="button"
          className="coming-soon-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <div className="coming-soon-icon">
          <Icon size={30} />
        </div>

        <span className="coming-soon-tag">Tez orada</span>

        <h1>{title}</h1>

        <p>{description}</p>

        <Link to="/catalog" className="coming-soon-cta">
          Katalogni ko‘rish
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}

export default ComingSoon;
