import React, { useEffect, useState } from "react";

import { CartContext } from "./cart-context";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("vibe-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("vibe-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingProduct = prev.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== productId)
    );
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock
              ),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}