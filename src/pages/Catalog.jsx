import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  ShoppingCartPlus,
  X,
} from "lucide-react";

import { getProducts } from "../lib/api";
import { useCart } from "../hooks/useCart";

import "./catalog.css";

function Catalog() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setProductsLoading(false));
  }, []);

  // ==============================
  // FILTER STATES
  // ==============================

  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || "Barchasi"
  );

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [sortBy, setSortBy] = useState("popular");

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );

  // Keep filters in sync when arriving via a link that carries
  // ?category= or ?search= (e.g. from the homepage or the navbar search)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");

    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }

    if (urlSearch !== null) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
  });

  // ==============================
  // CATEGORIES
  // ==============================

  const categories = [
    "Barchasi",
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // ==============================
  // BRANDS
  // ==============================

  const brands = [
    ...new Set(
      products.map((product) => product.brand)
    ),
  ];

  // ==============================
  // OPEN / CLOSE FILTER SECTION
  // ==============================

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ==============================
  // BRAND SELECT
  // ==============================

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      if (prev.includes(brand)) {
        return prev.filter((item) => item !== brand);
      }

      return [...prev, brand];
    });
  };

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setSelectedCategory("Barchasi");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("popular");
  };

  // ==============================
  // FILTER + SEARCH + SORT
  // ==============================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY
    if (selectedCategory !== "Barchasi") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    // BRAND
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // MIN PRICE
    if (minPrice) {
      result = result.filter(
        (product) =>
          product.price >= Number(minPrice)
      );
    }

    // MAX PRICE
    if (maxPrice) {
      result = result.filter(
        (product) =>
          product.price <= Number(maxPrice)
      );
    }

    // SEARCH
    if (search.trim()) {
      const query = search
        .trim()
        .toLowerCase();

      result = result.filter((product) => {
        return (
          product.name
            .toLowerCase()
            .includes(query) ||
          product.brand
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query)
        );
      });
    }

    // SORT
    if (sortBy === "cheap") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "expensive") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    sortBy,
    search,
  ]);

  // ==============================
  // ADD TO CART
  // ==============================

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    addToCart(product, 1);
  };

  return (
    <main className="catalog-page">
      <div className="catalog-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="catalog-header">
          <div>
            <span className="catalog-label">
              VIBE SHOP
            </span>

            <h1>Barcha mahsulotlar</h1>

            <p>
              O‘zingizga kerakli mahsulotni toping.
            </p>
          </div>

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() =>
              setMobileFilterOpen(true)
            }
          >
            <Filter size={18} />
            Filter
          </button>
        </header>

        {/* =====================================
            SEARCH
        ===================================== */}

        <div className="catalog-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Mahsulot, brend yoki kategoriya qidiring..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Qidiruvni tozalash"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* =====================================
            MAIN LAYOUT
        ===================================== */}

        <div className="catalog-layout">

          {/* ===================================
              FILTER SIDEBAR
          =================================== */}

          <aside
            className={`catalog-filter ${
              mobileFilterOpen
                ? "filter-open"
                : ""
            }`}
          >

            {/* MOBILE HEADER */}

            <div className="filter-mobile-header">
              <h2>Filter</h2>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(false)
                }
              >
                <X size={21} />
              </button>
            </div>

            {/* DESKTOP HEADER */}

            <div className="filter-top">
              <h2>Filter</h2>

              <button
                type="button"
                onClick={clearFilters}
              >
                Tozalash
              </button>
            </div>

            {/* =================================
                CATEGORY
            ================================= */}

            <div className="filter-section">

              <button
                type="button"
                className="filter-section-title"
                onClick={() =>
                  toggleSection("category")
                }
              >
                <span>Kategoriya</span>

                {openSections.category ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openSections.category && (
                <div className="category-options">

                  {categories.map((category) => {

                    const categoryCount =
                      category === "Barchasi"
                        ? products.length
                        : products.filter(
                            (product) =>
                              product.category ===
                              category
                          ).length;

                    return (
                      <button
                        type="button"
                        key={category}
                        className={
                          selectedCategory ===
                          category
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setSelectedCategory(
                            category
                          )
                        }
                      >
                        <span>
                          {category}
                        </span>

                        <small>
                          {categoryCount}
                        </small>
                      </button>
                    );
                  })}

                </div>
              )}
            </div>

            {/* =================================
                BRAND
            ================================= */}

            <div className="filter-section">

              <button
                type="button"
                className="filter-section-title"
                onClick={() =>
                  toggleSection("brand")
                }
              >
                <span>Brend</span>

                {openSections.brand ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openSections.brand && (
                <div className="brand-options">

                  {brands.map((brand) => (
                    <label
                      className="checkbox-option"
                      key={brand}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(
                          brand
                        )}
                        onChange={() =>
                          toggleBrand(brand)
                        }
                      />

                      <span className="custom-checkbox"></span>

                      <span>{brand}</span>
                    </label>
                  ))}

                </div>
              )}
            </div>

            {/* =================================
                PRICE
            ================================= */}

            <div className="filter-section">

              <button
                type="button"
                className="filter-section-title"
                onClick={() =>
                  toggleSection("price")
                }
              >
                <span>Narx</span>

                {openSections.price ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openSections.price && (
                <div className="price-options">

                  <div className="price-inputs">

                    <input
                      type="number"
                      placeholder="Dan"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value
                        )
                      }
                    />

                    <span>—</span>

                    <input
                      type="number"
                      placeholder="Gacha"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="price-presets">

                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("");
                        setMaxPrice("3000000");
                      }}
                    >
                      3 mln gacha
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("3000000");
                        setMaxPrice("10000000");
                      }}
                    >
                      3–10 mln
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice("10000000");
                        setMaxPrice("");
                      }}
                    >
                      10 mln+
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* MOBILE APPLY */}

            <button
              type="button"
              className="mobile-filter-apply"
              onClick={() =>
                setMobileFilterOpen(false)
              }
            >
              Natijalarni ko‘rsatish
            </button>

          </aside>

          {/* ===================================
              PRODUCTS
          =================================== */}

          <section className="catalog-products">

            {/* TOOLBAR */}

            <div className="products-toolbar">

              <div className="products-count">
                <strong>
                  {filteredProducts.length}
                </strong>{" "}
                mahsulot
              </div>

              <div className="sort-wrapper">
                <span>Saralash:</span>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <option value="popular">
                    Mashhurlik
                  </option>

                  <option value="cheap">
                    Arzon → Qimmat
                  </option>

                  <option value="expensive">
                    Qimmat → Arzon
                  </option>
                </select>
              </div>

            </div>

            {/* PRODUCTS */}

            {productsLoading ? (

              <div className="catalog-loading">Yuklanmoqda...</div>

            ) : filteredProducts.length > 0 ? (

              <div className="catalog-grid">

                {filteredProducts.map(
                  (product) => (
                    <article
                      className="catalog-card"
                      key={product.id}
                      onClick={() =>
                        navigate(
                          `/product/${product.id}`
                        )
                      }
                    >

                      {/* IMAGE */}

                      <div className="catalog-card-image">
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      </div>

                      {/* INFO */}

                      <div className="catalog-card-info">

                        <span className="catalog-card-category">
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        {/* PRICE */}

                        <div className="catalog-card-bottom">

                          <div className="catalog-price">

                            <strong>
                              {product.price.toLocaleString(
                                "uz-UZ"
                              )}{" "}
                              so‘m
                            </strong>

                            {product.oldPrice && (
                              <del>
                                {product.oldPrice.toLocaleString(
                                  "uz-UZ"
                                )}{" "}
                                so‘m
                              </del>
                            )}

                          </div>

                          {/* CART */}

                          <button
                            type="button"
                            className="catalog-cart"
                            title="Savatga qo‘shish"
                            onClick={(e) =>
                              handleAddToCart(
                                e,
                                product
                              )
                            }
                          >
                            <ShoppingCartPlus
                              size={18}
                            />
                          </button>

                        </div>

                      </div>
                    </article>
                  )
                )}

              </div>

            ) : (

              /* =================================
                 EMPTY
              ================================= */

              <div className="empty-catalog">

                <div className="empty-icon">
                  <Search size={28} />
                </div>

                <h2>
                  Mahsulot topilmadi
                </h2>

                <p>
                  Qidiruv yoki filterlarni
                  o‘zgartirib qayta urinib ko‘ring.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Filterlarni tozalash
                </button>

              </div>

            )}

          </section>
        </div>
      </div>
    </main>
  );
}

export default Catalog;