import { Menu, Search, Settings, ShoppingBag, User, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useAdmin } from "../hooks/useAdmin";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAdmin } = useAdmin();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();

    navigate(
      trimmed
        ? `/catalog?search=${encodeURIComponent(trimmed)}`
        : "/catalog"
    );
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        B<span>⁴</span> MOBILE
      </Link>

      <ul>
        <li className="cart-nav-item">
          <NavLink to="/cart" aria-label="Savat">
            <ShoppingBag />
            &nbsp;Savat
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
        </li>

        <li>
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <Search />

            <input
              type="text"
              placeholder="Qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit" aria-label="Qidirish">
              <ArrowRight />
            </button>
          </form>
        </li>

        <li>
          <NavLink to="/orders" aria-label="Buyurtmalarim">
            <User />
          </NavLink>
        </li>

        <li>
          <Menu onClick={() => setMenuOpen(!menuOpen)} />
        </li>
      </ul>

      {menuOpen && (
        <div className="dropdown-menu">
          <NavLink to="/" onClick={closeMenu}>
            Asosiy
          </NavLink>

          <NavLink to="/catalog" onClick={closeMenu}>
            Katalog
          </NavLink>

          <NavLink to="/phone-finder" onClick={closeMenu}>
            Telefon tanlash
          </NavLink>

          <NavLink to="/compare" onClick={closeMenu}>
            Solishtirish
          </NavLink>

          <NavLink to="/installment" onClick={closeMenu}>
            Bo‘lib to‘lash
          </NavLink>

          <NavLink to="/my-phone" onClick={closeMenu}>
            Mening telefonim
          </NavLink>

          <NavLink to="/orders" onClick={closeMenu}>
            Buyurtmalarim
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className="admin-menu-link" onClick={closeMenu}>
              <Settings size={15} />
              &nbsp;Admin panel
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
