import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { useCart } from "../hooks/useCart";
import { createOrder } from "../lib/api";
import "./checkout.css";

const PAYMENT_METHODS = [
  { id: "cash", label: "Naqd pul", icon: Wallet },
  { id: "installment", label: "Bo‘lib to‘lash (naqd)", icon: Calendar },
];

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    region: "",
    address: "",
    note: location.state?.note || "",
  });

  const [payment, setPayment] = useState("cash");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [order, setOrder] = useState(null);

  const deliveryPrice = cartTotal >= 500000 ? 0 : 30000;
  const totalPrice = cartTotal + deliveryPrice;

  const formatPrice = (price) => `${price.toLocaleString("uz-UZ")} so‘m`;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Ismingizni kiriting";
    }

    if (!/^\+?\d{9,13}$/.test(form.phone.replace(/[\s()-]/g, ""))) {
      nextErrors.phone = "Telefon raqamni to‘g‘ri kiriting";
    }

    if (!form.region.trim()) {
      nextErrors.region = "Shahar / viloyatni kiriting";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Manzilni kiriting";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const paymentLabel =
      PAYMENT_METHODS.find((method) => method.id === payment)?.label || payment;

    try {
      const result = await createOrder({
        fullName: form.fullName,
        phone: form.phone,
        region: form.region,
        address: form.address,
        note: form.note,
        paymentMethod: paymentLabel,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: cartTotal,
        deliveryPrice,
        total: totalPrice,
        isInstallment: payment === "installment",
      });

      setOrder({
        id: result.orderCode,
        phone: form.phone,
        total: totalPrice,
        isInstallment: payment === "installment",
      });
      clearCart();
    } catch (err) {
      setSubmitError(err.message || "Buyurtma yuborilmadi, qayta urinib ko‘ring");
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN

  if (order) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="order-success-icon">
              <Check size={30} />
            </div>

            <h1>Buyurtma qabul qilindi!</h1>

            <p>
              Buyurtmangiz raqami <strong>{order.id}</strong>. Tez orada
              operatorimiz siz bilan <strong>{order.phone}</strong> raqami
              orqali bog‘lanadi.
            </p>

            <div className="order-success-qr">
              <QRCodeSVG value={order.id} size={160} />
              <span className="order-success-code">{order.id}</span>
              <p>Mahsulotni do‘kondan olib ketishda shu QR kodni ko‘rsating.</p>
            </div>

            {order.isInstallment && (
              <p className="order-installment-note">
                Bo‘lib to‘lash so‘rovingiz qabul qilindi — muddat va oylik
                to‘lov summasini administrator tez orada siz bilan
                bog‘lanib belgilaydi. Buyurtmalar bo‘limida ko‘rishingiz mumkin.
              </p>
            )}

            <div className="order-success-total">
              <span>To‘lov summasi</span>
              <strong>{formatPrice(order.total)}</strong>
            </div>

            <div className="order-success-actions">
              <Link to="/catalog" className="continue-shopping">
                Xaridni davom ettirish
                <ArrowRight size={18} />
              </Link>

              <Link to="/" className="back-home">
                Bosh sahifaga qaytish
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // EMPTY CART

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <button
            type="button"
            className="checkout-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Orqaga
          </button>

          <div className="empty-checkout">
            <div className="empty-checkout-icon">
              <ShoppingBag size={42} />
            </div>

            <h1>Savatingiz bo‘sh</h1>

            <p>Buyurtma berish uchun avval savatga mahsulot qo‘shing.</p>

            <Link to="/catalog" className="continue-shopping">
              Xarid qilishni boshlash
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <button
          type="button"
          className="checkout-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Orqaga
        </button>

        <div className="checkout-title-row">
          <span className="checkout-overline">VIBE SHOP</span>
          <h1>Buyurtmani rasmiylashtirish</h1>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
          {/* FORM */}

          <section className="checkout-form">
            <div className="checkout-card">
              <h2>Yetkazib berish ma’lumotlari</h2>

              <div className="form-row">
                <label>
                  <span>To‘liq ism</span>
                  <input
                    type="text"
                    placeholder="Ism Familiya"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                  />
                  {errors.fullName && (
                    <small className="field-error">{errors.fullName}</small>
                  )}
                </label>

                <label>
                  <span>Telefon raqam</span>
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={form.phone}
                    onChange={handleChange("phone")}
                  />
                  {errors.phone && (
                    <small className="field-error">{errors.phone}</small>
                  )}
                </label>
              </div>

              <div className="form-row">
                <label>
                  <span>Shahar / Viloyat</span>
                  <input
                    type="text"
                    placeholder="Farg‘ona"
                    value={form.region}
                    onChange={handleChange("region")}
                  />
                  {errors.region && (
                    <small className="field-error">{errors.region}</small>
                  )}
                </label>

                <label>
                  <span>Manzil</span>
                  <input
                    type="text"
                    placeholder="Ko‘cha, uy raqami"
                    value={form.address}
                    onChange={handleChange("address")}
                  />
                  {errors.address && (
                    <small className="field-error">{errors.address}</small>
                  )}
                </label>
              </div>

              <label className="form-note">
                <span>Izoh (ixtiyoriy)</span>
                <textarea
                  rows={3}
                  placeholder="Qo‘shimcha izoh qoldiring..."
                  value={form.note}
                  onChange={handleChange("note")}
                />
              </label>
            </div>

            <div className="checkout-card">
              <h2>To‘lov usuli</h2>

              <div className="payment-options">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const disabled = method.id === "installment";

                  return (
                    <button
                      type="button"
                      key={method.id}
                      className={`payment-option ${
                        payment === method.id ? "active" : ""
                      } ${disabled ? "disabled" : ""}`}
                      onClick={() => !disabled && setPayment(method.id)}
                      disabled={disabled}
                    >
                      <Icon size={19} />
                      <span>{method.label}</span>
                      {disabled && <small>Tez orada</small>}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SUMMARY */}

          <aside className="checkout-summary">
            <div className="summary-card">
              <h2>Buyurtma tarkibi</h2>

              <div className="checkout-items">
                {cart.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="checkout-item-info">
                      <span>{item.name}</span>
                      <small>{item.quantity} dona</small>
                    </div>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-row">
                <span>Mahsulotlar</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <div className="summary-row">
                <span>Yetkazib berish</span>
                <strong className={deliveryPrice === 0 ? "free-delivery" : ""}>
                  {deliveryPrice === 0 ? "Bepul" : formatPrice(deliveryPrice)}
                </strong>
              </div>

              <div className="summary-divider" />

              <div className="summary-total">
                <span>Jami</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              {submitError && <p className="field-error">{submitError}</p>}

              <button type="submit" className="place-order" disabled={submitting}>
                {submitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
                {!submitting && <ArrowRight size={19} />}
              </button>

              <div className="checkout-benefit">
                <ShieldCheck size={16} />
                <span>Xavfsiz va kafolatlangan xarid</span>
              </div>

              <div className="checkout-benefit">
                <Truck size={16} />
                <span>1–2 kun ichida yetkazib berish</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
