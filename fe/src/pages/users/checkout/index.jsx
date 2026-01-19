import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import api from "../../../utils/api";
import "./styles.css";

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const cartItems = state?.cartItems || [];

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: "",
    });

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleSubmit = async () => {
        if (!form.fullName || !form.phone || !form.address) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await api.post("/checkout", {
                cartItems,
                customer: form,
            });

            alert("Order placed successfully!");
            navigate("/"); // hoặc navigate("/shopping-cart")
        } catch (err) {
            alert(err.response?.data?.message || "Checkout failed");
        }
    };

    return (
        <div className="cart-container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cart-title"
            >
                Checkout
            </motion.h1>

            <div className="cart-content">
                {/* LEFT – PRODUCT LIST */}
                <motion.div
                    className="cart-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
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
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                            </div>

                            <div className="item-actions">
                                <span className="item-total">
                                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* RIGHT – SUMMARY + FORM */}
                <motion.div
                    className="cart-summary"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="checkout-title">🚚 Shipping Information</h3>

                    <div className="checkout-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="checkout-input"
                                placeholder="Enter your full name"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({ ...form, fullName: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                className="checkout-input"
                                placeholder="e.g. 0987 654 321"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Shipping Address</label>
                            <input
                                className="checkout-input"
                                placeholder="Street, district, city"
                                value={form.address}
                                onChange={(e) =>
                                    setForm({ ...form, address: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Note (optional)</label>
                            <textarea
                                className="checkout-input textarea"
                                placeholder="Note for the seller (optional)"
                                value={form.note}
                                onChange={(e) =>
                                    setForm({ ...form, note: e.target.value })
                                }
                            />
                        </div>
                    </div>


                    <hr />

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

                    <button className="checkout-btn" onClick={handleSubmit}>
                        Place Order
                    </button>

                    {/* 🔙 BACK TO SHOPPING CART */}
                    <button
                        className="btn btn-link mt-2"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Shopping Cart
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default memo(Checkout);
