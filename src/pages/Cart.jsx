import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
} from "lucide-react";

import { useCart } from "../hooks/useCart";
import "./cart.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const formatPrice = (price) => {
    return `${price.toLocaleString("uz-UZ")} so‘m`;
  };

  const deliveryPrice = cartTotal >= 500000 ? 0 : 30000;

  const totalPrice = cartTotal + deliveryPrice;

  if (cart.length === 0) {
    return (
      <main className="cart-page">

        <div className="cart-container">

          <button
            type="button"
            className="cart-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Orqaga
          </button>

          <div className="empty-cart">

            <div className="empty-cart-icon">
              <ShoppingBag size={42} />
            </div>

            <h1>Savatingiz bo‘sh</h1>

            <p>
              Hali hech qanday mahsulot savatga
              qo‘shilmagan.
            </p>

            <Link
              to="/catalog"
              className="continue-shopping"
            >
              Xarid qilishni boshlash
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="cart-header">

          <div>

            <button
              type="button"
              className="cart-back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Orqaga
            </button>

            <div className="cart-title-row">

              <div>
                <span className="cart-overline">
                  VIBE SHOP
                </span>

                <h1>
                  Savat
                </h1>
              </div>

              <span className="cart-count">
                {cartCount} mahsulot
              </span>

            </div>

          </div>

          <button
            type="button"
            className="clear-cart"
            onClick={clearCart}
          >
            <Trash2 size={17} />
            Savatni tozalash
          </button>

        </div>

        {/* =====================================
            CONTENT
        ===================================== */}

        <div className="cart-layout">

          {/* ===================================
              PRODUCTS
          =================================== */}

          <section className="cart-products">

            {cart.map((item) => {

              const itemTotal =
                item.price * item.quantity;

              return (
                <article
                  className="cart-item"
                  key={item.id}
                >

                  {/* IMAGE */}

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-image"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  {/* INFO */}

                  <div className="cart-item-info">

                    <span className="cart-item-brand">
                      {item.brand}
                    </span>

                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>

                    <span className="cart-item-category">
                      {item.category}
                    </span>

                    {/* QUANTITY */}

                    <div className="cart-item-bottom">

                      <div className="cart-quantity">

                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Kamaytirish"
                        >
                          <Minus size={15} />
                        </button>

                        <strong>
                          {item.quantity}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          disabled={
                            item.quantity >= item.stock
                          }
                          aria-label="Ko‘paytirish"
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        <Trash2 size={16} />
                        O‘chirish
                      </button>

                    </div>

                  </div>

                  {/* PRICE */}

                  <div className="cart-item-price">

                    <strong>
                      {formatPrice(itemTotal)}
                    </strong>

                    {item.quantity > 1 && (
                      <span>
                        {formatPrice(item.price)} / dona
                      </span>
                    )}

                  </div>

                </article>
              );
            })}

          </section>

          {/* ===================================
              SUMMARY
          =================================== */}

          <aside className="cart-summary">

            <div className="summary-card">

              <h2>
                Buyurtma
              </h2>

              <div className="summary-row">

                <span>
                  Mahsulotlar
                </span>

                <strong>
                  {formatPrice(cartTotal)}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Yetkazib berish
                </span>

                <strong
                  className={
                    deliveryPrice === 0
                      ? "free-delivery"
                      : ""
                  }
                >
                  {deliveryPrice === 0
                    ? "Bepul"
                    : formatPrice(deliveryPrice)}
                </strong>

              </div>

              <div className="summary-divider" />

              <div className="summary-total">

                <span>
                  Jami
                </span>

                <strong>
                  {formatPrice(totalPrice)}
                </strong>

              </div>

              <button
                type="button"
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Rasmiylashtirish
                <ArrowRight size={19} />
              </button>

              <Link
                to="/catalog"
                className="back-shopping"
              >
                Xaridni davom ettirish
              </Link>

            </div>

            {/* BENEFITS */}

            <div className="cart-benefits">

              <div className="cart-benefit">

                <div className="benefit-icon">
                  <Truck size={19} />
                </div>

                <div>
                  <strong>
                    Tez yetkazib berish
                  </strong>

                  <span>
                    1–2 kun ichida
                  </span>
                </div>

              </div>

              <div className="cart-benefit">

                <div className="benefit-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>
                    Kafolat
                  </strong>

                  <span>
                    Mahsulotga qarab 1 yilgacha
                  </span>
                </div>

              </div>

              <div className="cart-benefit">

                <div className="benefit-icon">
                  <Package size={19} />
                </div>

                <div>
                  <strong>
                    Ishonchli qadoqlash
                  </strong>

                  <span>
                    Mahsulot xavfsiz yetkaziladi
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Cart;
