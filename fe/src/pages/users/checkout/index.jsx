import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CreditCard, Banknote, MapPin, Phone, User, FileText, ArrowLeft, Ticket, Loader2 } from "lucide-react";
import api from "../../../utils/api";
import NeuToast from "../../../component/common/NeuToast";

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const cartItems = state?.cartItems || [];
    
    // Toast State
    const [toast, setToast] = useState(null); // { message, type }
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Form State
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | BANKING | MOMO
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null); // { code: 'SQB10', discount: 10000 }
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate Totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discount = appliedVoucher ? (subtotal * 0.10) : 0; // Mock 10% for SQB10
    const finalTotal = subtotal - discount;

    const [otp, setOtp] = useState("");
    const [isOtpOpen, setIsOtpOpen] = useState(false);

    const handleApplyVoucher = () => {
        if (!voucherCode.trim()) {
            showToast("Please enter a voucher code", "warning");
            return;
        }

        if (voucherCode.toUpperCase() === "SQB10") {
            setAppliedVoucher({ code: "SQB10", discount: subtotal * 0.10 });
            showToast("Voucher 'SQB10' applied: 10% Discount!", "success");
        } else {
            showToast("Invalid voucher code. Please try again.", "error");
            setAppliedVoucher(null);
        }
    };

    // 1️⃣ REQUEST OTP
    const handleRequestOrder = async () => {
        if (!form.fullName || !form.phone || !form.address) {
            showToast("Please fill all shipping information", "warning");
            return;
        }

        try {
            setIsSubmitting(true);
            // Send OTP
            await api.post("/checkout/send-otp");
            setIsOtpOpen(true);
            showToast("Confirmation code sent to your email", "success");
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Failed to send OTP.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 2️⃣ SUBMIT ORDER WITH OTP
    const handleVerifyAndOrder = async () => {
        if (!otp || otp.length < 6) {
            showToast("Please enter a valid 6-digit PIN", "warning");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post("/checkout", {
                cartItems,
                customer: form,
                paymentMethod,
                voucherCode: appliedVoucher ? appliedVoucher.code : null,
                otp // 🔑 Pass OTP here
            });

            showToast("Order placed successfully! Redirecting...", "success");
            setTimeout(() => {
                setIsOtpOpen(false);
                navigate("/"); 
            }, 2000);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Invalid OTP or Checkout Failed", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (cartItems.length === 0) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h2>
                    <button onClick={() => navigate("/")} className="text-blue-600 font-medium hover:underline">
                        Return to Shop
                    </button>
                </div>
             </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
            {toast && (
                <NeuToast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            <div className="max-w-7xl mx-auto">
                 {/* Header */}
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 mr-4 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN - FORMS */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        
                        {/* 1. SHIPPING INFO */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 text-sm">1</span>
                                Shipping Information
                             </h2>
                             
                             <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="e.g. 0987 654 321"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Street, Ward, District, City"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Note (Optional)</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="note"
                                            value={form.note}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Special instructions for delivery..."
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* 2. PAYMENT METHOD */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 text-sm">2</span>
                                Payment Method
                             </h2>
                             
                             <div className="space-y-4">
                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="COD" 
                                        checked={paymentMethod === 'COD'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-4 flex items-center">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600 mr-3">
                                            <Banknote size={24} />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-gray-900">Cash on Delivery (COD)</span>
                                            <span className="block text-sm text-gray-500">Pay when you receive your order</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'BANKING' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value="BANKING" 
                                        checked={paymentMethod === 'BANKING'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-4 flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mr-3">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <span className="block font-medium text-gray-900">Bank Transfer / QR Code</span>
                                            <span className="block text-sm text-gray-500">Fast and secure bank transfer</span>
                                        </div>
                                    </div>
                                </label>
                             </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - SUMMARY */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                            
                            {/* Products */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Qty: {item.quantity} {item.color && `• ${item.color}`} {item.size && `• ${item.size}`}
                                            </div>
                                            <div className="text-sm font-bold text-blue-600 mt-1">
                                                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100 my-4"/>

                            {/* Voucher */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Code</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Ticket className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            value={voucherCode}
                                            onChange={(e) => setVoucherCode(e.target.value)}
                                            placeholder="Try 'SQB10'"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none uppercase transition-all placeholder:text-gray-300 font-medium tracking-wide"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleApplyVoucher}
                                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black hover:shadow-lg active:scale-95 transition-all flex-shrink-0"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedVoucher && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                                            <div>
                                                <p className="text-xs font-bold text-green-700">Code {appliedVoucher.code} Active</p>
                                                <p className="text-[10px] text-green-600">You saved {appliedVoucher.discount.toLocaleString("vi-VN")}₫</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => { setAppliedVoucher(null); showToast("Voucher removed", "info"); }}
                                            className="text-[10px] font-bold text-green-700 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <hr className="border-gray-100 my-4"/>

                             {/* Totals */}
                             <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                {appliedVoucher && (
                                    <div className="flex justify-between text-green-600 text-sm">
                                        <span>Discount</span>
                                        <span>-{discount.toLocaleString("vi-VN")}₫</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>{finalTotal.toLocaleString("vi-VN")}₫</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleRequestOrder}
                                disabled={isSubmitting}
                                className={`w-full relative bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group/btn`}
                            >
                                <span className={`transition-all duration-300 ${isSubmitting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                                    Confirm Support Order
                                </span>
                                {isSubmitting && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>

                             <p className="text-xs text-gray-400 text-center mt-4">
                                <Truck size={12} className="inline mr-1" />
                                Free shipping on all orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🔢 OTP MODAL */}
                <AnimatePresence>
                    {isOtpOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                                onClick={() => setIsOtpOpen(false)}
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white rounded-2xl p-8 shadow-2xl z-50 border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Order</h2>
                                <p className="text-gray-500 text-center mb-6">
                                    We've sent a 6-digit confirmation code to your email. Please enter it below.
                                </p>

                                <div className="flex justify-center mb-8">
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-48 text-center text-3xl font-bold tracking-[0.5em] py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors"
                                        placeholder="······"
                                    />
                                </div>

                                <button 
                                    onClick={handleVerifyAndOrder}
                                    disabled={isSubmitting || otp.length < 6}
                                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Verifying..." : "Verify & Complete Order"}
                                </button>
                                
                                <button 
                                    onClick={() => setIsOtpOpen(false)}
                                    className="w-full mt-4 text-gray-500 font-medium hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default memo(Checkout);
