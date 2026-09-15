import React, { useCallback, useEffect, useState } from "react";
import "./home.css";
import Category from "../components/Category";
import FeaturedProducts from "./FeaturedProducts";
import "./FeaturedProduct.css";
import { getBanners } from "../lib/api";

function Home() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getBanners().then(setBanners);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (banners.length ? (prev + 1) % banners.length : 0));
  }, [banners.length]);

  const prevSlide = () => {
    setCurrent((prev) =>
      banners.length ? (prev - 1 + banners.length) % banners.length : 0
    );
  };

  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  return (
    <main className="home">
      {banners.length > 0 && (
        <section className="promo-carousel">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`promo-slide ${current === index ? "active" : ""}`}
              style={{
                backgroundImage: `url(${banner.image})`,
              }}
            >
              <div className="promo-overlay"></div>

              <div className="promo-content">
                {banner.title && <h2>{banner.title}</h2>}
                {banner.text && <p>{banner.text}</p>}
              </div>
            </div>
          ))}

          {banners.length > 1 && (
            <>
              <button className="promo-arrow promo-prev" onClick={prevSlide}>
                ←
              </button>

              <button className="promo-arrow promo-next" onClick={nextSlide}>
                →
              </button>

              <div className="promo-dots">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    className={current === index ? "active" : ""}
                    onClick={() => setCurrent(index)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <Category />

      <FeaturedProducts />
    </main>
  );
}

export default Home;
