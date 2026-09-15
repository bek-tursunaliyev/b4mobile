import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart, Star } from "lucide-react";

import { getProducts } from "../lib/api";
import { useCart } from "../hooks/useCart";

function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts().then((all) => setFeatured(all.slice(0, 4)));
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    addToCart(product, 1);

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <div>
            <span className="section-label">TANLANGAN</span>
            <h2>Mashhur mahsulotlar</h2>
          </div>

          <button onClick={() => navigate("/catalog")}>
            Barchasini ko‘rish
          </button>
        </div>

        <div className="products-grid">
          {featured.map((product) => (
            <article
              className="product-card"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <div className="product-rating">
                  <Star size={16} fill="currentColor" />
                  <span>{product.rating}</span>
                  <span className="reviews">
                    ({product.reviews})
                  </span>
                </div>

                <div className="product-bottom">
                  <div>
                    <strong>
                      {product.price.toLocaleString("uz-UZ")} so‘m
                    </strong>
                    {product.oldPrice && (
                      <del>
                        {product.oldPrice.toLocaleString("uz-UZ")} so‘m
                      </del>
                    )}
                  </div>

                  <button
                    className="add-cart"
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label="Savatga qo‘shish"
                  >
                    {addedId === product.id ? (
                      <Check size={19} />
                    ) : (
                      <ShoppingCart size={19} />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
