import { memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingCart as CartIcon, Frown, Truck, ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { ROUTERS } from "../../../utils/router";

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4 shadow-sm">
                    <CartIcon size={24} />
                </div>
                Shopping Cart
                <span className="ml-4 text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    {cartItems.length} items
                </span>
            </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* ======= LEFT: CART ITEMS ======= */}
            <div className="w-full lg:w-3/4">
                <AnimatePresence mode="popLayout">
                    {cartItems.length > 0 ? (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.variantKey}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-200 transition-all"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 mb-4">
                                            {item.color && (
                                                <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                    Color: <span className="font-semibold text-gray-900 ml-1">{item.color}</span>
                                                </span>
                                            )}
                                            {item.size && (
                                                <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                    Size: <span className="font-semibold text-gray-900 ml-1">{item.size}</span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xl font-bold text-blue-600">
                                            {item.price.toLocaleString("vi-VN")}₫
                                        </div>
                                    </div>

                                    {/* Actions (Quantity & Remove) */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                                            <button
                                                onClick={() => updateQuantity(item.variantKey, -1)}
                                                disabled={item.quantity === 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.variantKey, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        
                                        <button
                                            onClick={() => removeFromCart(item.variantKey)}
                                            className="flex items-center text-sm font-medium text-gray-400 hover:text-red-500 transition-colors group/delete"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-2 opacity-0 group-hover/delete:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </div>
                                            Remove Item
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <Frown size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Browse our products and find something you love!</p>
                            <Link 
                                to={`/${ROUTERS.USER.PRODUCTS}`}
                                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                                Start Shopping <ArrowRight size={18} className="ml-2" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ======= RIGHT: SUMMARY ======= */}
            <div className="w-full lg:w-1/4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                        Order Summary
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                         <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">{totalPrice.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-lg text-xs">
                                Free <Truck size={12} className="ml-1" />
                            </span>
                        </div>
                        <div className="h-px bg-gray-100 my-4"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-900 font-bold">Total</span>
                            <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString("vi-VN")}₫</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={!cartItems.length}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 disabled:shadow-none flex items-center justify-center"
                    >
                        Proceed to Checkout
                        <ArrowRight size={18} className="ml-2" />
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Secure Checkout - SSL Encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ShoppingCart);
