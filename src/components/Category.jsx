import React from "react";
import {
  Smartphone,
  Watch,
  Laptop,
  Cable,
  Headphones,
  SmartphoneIcon,
  Mouse,
  Glasses,
  BatteryCharging,
} from "lucide-react";
import "./category.css";
import { NavLink, useNavigate } from "react-router-dom";

function Category() {
  const navigate = useNavigate();

  // `filter` maps to the exact `category` value stored in the products table
  const categories = [
    {
      name: "Telefonlar",
      subtitle: "Smartfonlar",
      icon: Smartphone,
      filter: "Smartfon",
    },
    {
      name: "Smart soatlar",
      subtitle: "Soat va aksessuarlar",
      icon: Watch,
      filter: "Smart soat",
    },
    {
      name: "Kompyuterlar",
      subtitle: "Noutbuk va PC",
      icon: Laptop,
      filter: "Kompyuter",
    },
    {
      name: "Zaryadniklar",
      subtitle: "Zaryadlovchi va kabel",
      icon: Cable,
      filter: "Zaryadnik",
    },
    {
      name: "Naushniklar",
      subtitle: "Audio qurilmalar",
      icon: Headphones,
      filter: "Naushnik",
    },
    {
      name: "Telefon g‘iloflari",
      subtitle: "Chexol va himoya",
      icon: SmartphoneIcon,
      filter: "Telefon g‘ilofi",
    },
    {
      name: "PC aksessuarlari",
      subtitle: "Sichqoncha va boshqalar",
      icon: Mouse,
      filter: "PC aksessuari",
    },
    {
      name: "Ko‘zoynaklar",
      subtitle: "Stil va himoya",
      icon: Glasses,
      filter: "Ko‘zoynak",
    },
    {
      name: "Powerbank",
      subtitle: "Portativ quvvat",
      icon: BatteryCharging,
      filter: "Powerbank",
    },
  ];

  return (
    <section className="category" id="category">
      <div className="category-header">
        <div>
          <span className="category-label">Mahsulotlar</span>
          <h2>Kategoriyalar</h2>
        </div>

        <NavLink to="/catalog" className="category-all">
          Barchasini ko‘rish →
        </NavLink>
      </div>

      <div className="category-list">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              className="category-card"
              key={category.name}
              onClick={() =>
                navigate(
                  `/catalog?category=${encodeURIComponent(category.filter)}`
                )
              }
            >
              <div className="category-image">
                <Icon size={34} strokeWidth={1.7} />
              </div>

              <div className="category-info">
                <span>{category.name}</span>
                <small>{category.subtitle}</small>
              </div>

              <span className="category-arrow">→</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default Category;
