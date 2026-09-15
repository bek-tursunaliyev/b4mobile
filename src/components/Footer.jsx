import React from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            B<span>⁴</span> MOBILE
          </Link>

          <p>
            Zamonaviy smartfonlar va aksessuarlar. Sifatli mahsulot, qulay narx.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/b4_mobile.uz/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://t.me/B4_mobile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <FaTelegramPlane />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Bo‘limlar</h3>

          <Link to="/">Asosiy</Link>
          <Link to="/catalog">Katalog</Link>
          <Link to="/xizmatlar">Xizmatlar</Link>
          <Link to="/orders">Buyurtmalarim</Link>
        </div>

        <div className="footer-column footer-contact">
          <h3>Bog‘lanish</h3>

          <a href="tel:+998910012002">
            <Phone />
            <span>+998 91 001 20 02</span>
          </a>

          <a
            href="https://maps.google.com/?q=Farg'ona, O'zbekiston"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin />
            <span>Farg'ona, O‘zbekiston</span>
          </a>

          <a href="tel:+998910012002">
            <span>Biz bilan bog‘lanish</span>
            <ArrowUpRight />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 B⁴ MOBILE. Barcha huquqlar himoyalangan.</p>

        <Link to="/">Maxfiylik siyosati</Link>
      </div>
    </footer>
  );
}

export default Footer;
