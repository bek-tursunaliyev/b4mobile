import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  Check,
  Package,
  Heart,
  Share2,
} from "lucide-react";

import "./products.css";
import { getProductById } from "../lib/api";
import { useCart } from "../hooks/useCart";
import { formatMoney } from "../lib/currency";

function Products() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [quantity, setQuantity] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setQuantity(1);

    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="product-loading">Yuklanmoqda...</main>;
  }

  if (!product) {
    return (
      <main className="product-not-found">
        <div className="not-found-icon">
          <Package size={32} />
        </div>

        <h2>Mahsulot topilmadi</h2>

        <p>
          Bu mahsulot mavjud emas yoki o‘chirilgan.
        </p>

        <button
          type="button"
          onClick={() => navigate("/catalog")}
        >
          <ArrowLeft size={18} />
          Katalogga qaytish
        </button>
      </main>
    );
  }

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const deliveryAvailable = product.deliveryAvailable !== false;

  const deliveryText = deliveryAvailable
    ? product.deliveryPrice
      ? formatMoney(product.deliveryPrice, product.currency)
      : "Bepul"
    : "Mavjud emas";

  const warranty = product.warranty || "Kafolat yo‘q";

  return (
    <main className="product-page">

      {/* =========================================
          TOAST
      ========================================= */}

      {showToast && (
        <div className="product-toast">
          <div className="toast-check">
            <Check size={17} />
          </div>

          <div>
            <strong>Savatga qo‘shildi</strong>
            <span>{product.name}</span>
          </div>
        </div>
      )}

      {/* =========================================
          TOP NAVIGATION
      ========================================= */}

      <div className="product-top">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={19} />
          <span>Orqaga</span>
        </button>

      </div>

      {/* =========================================
          BREADCRUMB
      ========================================= */}

      <div className="breadcrumb">

        <Link to="/">
          Bosh sahifa
        </Link>

        <ChevronRight size={15} />

        <Link to="/catalog">
          Katalog
        </Link>

        <ChevronRight size={15} />

        <span>
          {product.category}
        </span>

        <ChevronRight size={15} />

        <strong>
          {product.name}
        </strong>

      </div>

      {/* =========================================
          PRODUCT DETAIL
      ========================================= */}

      <section className="product-detail">

        {/* =======================================
            IMAGE
        ======================================= */}

        <div className="product-gallery">

          <div className="main-product-image">

            {discount > 0 && (
              <span className="product-discount">
                -{discount}%
              </span>
            )}

            <button
              type="button"
              className={`product-favorite ${
                isFavorite ? "active" : ""
              }`}
              onClick={() =>
                setIsFavorite((prev) => !prev)
              }
              aria-label="Sevimlilarga qo‘shish"
            >
              <Heart
                size={21}
                fill={
                  isFavorite
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <img
              src={product.image}
              alt={product.name}
            />

          </div>

          <div className="gallery-info">

            <div className="gallery-info-item">
              <ShieldCheck size={18} />
              <span>Original mahsulot</span>
            </div>

            <div className="gallery-info-item">
              <Package size={18} />
              <span>Tekshirilgan mahsulot</span>
            </div>

          </div>

        </div>

        {/* =======================================
            PRODUCT INFO
        ======================================= */}

        <div className="product-detail-info">

          {/* BRAND */}

          <span className="detail-brand">
            {product.brand}
          </span>

          {/* NAME */}

          <h1>
            {product.name}
          </h1>

          {/* PRICE */}

          <div className="detail-price">

            <strong>
              {formatMoney(product.price, product.currency)}
            </strong>

            {product.oldPrice && (
              <del>
                {formatMoney(product.oldPrice, product.currency)}
              </del>
            )}

            {discount > 0 && (
              <span className="price-discount">
                -{discount}%
              </span>
            )}

          </div>

          {/* STOCK */}

          <div
            className={`stock ${
              product.stock > 0
                ? "in-stock"
                : "out-of-stock"
            }`}
          >

            <span className="stock-dot" />

            {product.stock > 0 ? (
              <>
                Omborda{" "}
                <strong>
                  {product.stock} dona
                </strong>
              </>
            ) : (
              <strong>
                Hozirda mavjud emas
              </strong>
            )}

          </div>

          {/* DESCRIPTION */}

          <p className="product-description">
            {product.description}
          </p>

          {/* FEATURES */}

          <div className="product-features">

            <div className="feature">

              <div className="feature-icon">
                <Truck size={21} />
              </div>

              <div>
                <strong>
                  Yetkazib berish
                </strong>

                <span className={deliveryAvailable ? "" : "feature-strike"}>
                  {deliveryText}
                </span>
              </div>

            </div>

            <div className="feature">

              <div className="feature-icon">
                <ShieldCheck size={21} />
              </div>

              <div>
                <strong>
                  Kafolat
                </strong>

                <span>
                  {warranty}
                </span>
              </div>

            </div>

          </div>

          {/* QUANTITY */}

          {product.stock > 0 && (
            <div className="quantity-wrapper">

              <span>
                Miqdor
              </span>

              <div className="quantity">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Kamaytirish"
                >
                  <Minus size={17} />
                </button>

                <strong>
                  {quantity}
                </strong>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                  aria-label="Ko‘paytirish"
                >
                  <Plus size={17} />
                </button>

              </div>

            </div>
          )}

          {/* ACTIONS */}

          {product.stock > 0 ? (
            <div className="product-actions">

              <button
                type="button"
                className="add-to-cart"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Savatga qo‘shish
              </button>

              <button
                type="button"
                className="buy-now"
                onClick={handleBuyNow}
              >
                Hozir sotib olish
              </button>

            </div>
          ) : (
            <button
              type="button"
              className="disabled-buy"
              disabled
            >
              Mahsulot mavjud emas
            </button>
          )}

          {/* EXTRA ACTIONS */}

          <div className="product-extra-actions">

            <button
              type="button"
              onClick={() =>
                setIsFavorite((prev) => !prev)
              }
            >
              <Heart
                size={18}
                fill={
                  isFavorite
                    ? "currentColor"
                    : "none"
                }
              />

              {isFavorite
                ? "Sevimlilardan olib tashlash"
                : "Sevimlilarga qo‘shish"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 size={18} />
              Ulashish
            </button>

          </div>

        </div>

      </section>

      {/* =========================================
          SPECIFICATIONS
      ========================================= */}

      <section className="product-specifications">

        <div className="section-heading">

          <div>
            <span>
              MAHSULOT HAQIDA
            </span>

            <h2>
              Xususiyatlari
            </h2>
          </div>

        </div>

        {product.specs?.length > 0 ? (
          <div className="specifications-list">

            {product.specs.map(
              (spec, index) => (
                <div
                  className="spec-row"
                  key={`${spec.label}-${index}`}
                >

                  <span>
                    {spec.label}
                  </span>

                  <strong>
                    {spec.value}
                  </strong>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="no-specifications">
            <Package size={22} />

            <span>
              Ushbu mahsulot uchun
              xususiyatlar kiritilmagan.
            </span>
          </div>
        )}

      </section>

    </main>
  );
}

export default Products;