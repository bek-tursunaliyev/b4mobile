import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Scale, Search, Smartphone } from "lucide-react";

import "./services.css";

const SERVICES = [
  {
    to: "/phone-finder",
    icon: Search,
    title: "Telefon tanlash",
    description: "Byudjet va ehtiyojingizga mos telefonni bir necha savol orqali toping.",
  },
  {
    to: "/compare",
    icon: Scale,
    title: "Taqqoslash",
    description: "Bir necha mahsulotni yonma-yon solishtirib, farqlarini ko‘ring.",
  },
  {
    to: "/my-phone",
    icon: Smartphone,
    title: "Mening telefonim",
    description: "Eski telefoningizni topshiring — ma’lumotlarini kiriting, narx taklifini oling.",
  },
];

function Services() {
  return (
    <main className="services-page">
      <div className="services-container">
        <span className="services-label">XIZMATLAR</span>
        <h1 className="services-title">Sizga qanday yordam bera olamiz?</h1>

        <div className="services-grid">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <Link to={service.to} className="service-card" key={service.to}>
                <div className="service-icon">
                  <Icon size={22} />
                </div>

                <h2>{service.title}</h2>
                <p>{service.description}</p>

                <span className="service-arrow">
                  Boshlash
                  <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Services;
