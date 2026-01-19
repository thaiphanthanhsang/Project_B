import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const saveCartToStorage = (cart) => {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []); 

  const addToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.variantKey === productToAdd.variantKey
      );
      let newCart;

      if (existingItem) {
        newCart = prevItems.map((item) =>
          item.variantKey === productToAdd.variantKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevItems, productToAdd];
      }

      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const removeFromCart = (variantKey) => {
    setCartItems((prevItems) => {
      const newCart = prevItems.filter(
        (item) => item.variantKey !== variantKey
      );
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const updateQuantity = (variantKey, amount) => {
    setCartItems((prevItems) => {
      const newCart = prevItems
        .map((item) => {
          if (item.variantKey === variantKey) {
            const newQuantity = item.quantity + amount;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      saveCartToStorage(newCart);
      return newCart;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
