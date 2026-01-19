import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart as CartIcon, Frown, Truck } from "lucide-react";
import "./style.css";
import { useCart } from "../../../context/CartContext";



const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();


  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        from: "cart",
      },
    });
  };




  return (
    <div className="cart-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cart-title"
      >
        <CartIcon size={24} style={{ marginRight: "10px" }} />
        Shopping Cart
      </motion.h1>

      <div className="cart-content">
        <motion.div
          className="cart-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div
                  key={item.variantKey}
                  layout
                  exit={{ opacity: 0, x: 100 }}
                  className="cart-item"
                >
                  <div className="item-info">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-img"
                    />
                    <div className="item-details">
                      <h2>{item.name}</h2>
                      {item.color && item.size && (
                        <p className="text-muted small mb-1">
                          Color: <strong>{item.color}</strong> | Size:{" "}
                          <strong>{item.size}</strong>
                        </p>
                      )}
                      <p>{item.price.toLocaleString("vi-VN")}₫</p>
                      <div className="quantity-control">
                        <button
                          onClick={() => updateQuantity(item.variantKey, -1)}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantKey, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-total">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => removeFromCart(item.variantKey)}
                    >
                      <Trash2 size={20} />
                      <span>Remove</span>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-cart"
              >
                <Frown size={24} style={{ marginBottom: "10px" }} />
                Your cart is empty
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="cart-summary"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="summary-line">
            <span>Shipping Fee</span>
            <span>
              Free <Truck size={16} style={{ marginLeft: "5px" }} />
            </span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
          </div>
          <button disabled={!cartItems.length} className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(ShoppingCart);
