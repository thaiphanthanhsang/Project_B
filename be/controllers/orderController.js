import { orderService } from '../services/orderService.js';

export const orderController = {
    // 1. Place Order
    async placeOrder(req, res) {
        try {
            const userId = req.userId; // From authMiddleware
            const { cartItems, customer, paymentMethod, voucherCode } = req.body;

            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            if (!customer || !customer.address) {
                return res.status(400).json({ message: "Shipping address is required" });
            }

            const result = await orderService.placeOrder({
                userId,
                cartItems,
                customer,
                paymentMethod,
                voucherCode
            });

            res.status(201).json(result);
        } catch (err) {
            console.error("Place Order Error:", err);
            res.status(400).json({ message: err.message || "Failed to place order" });
        }
    },

    // 2. Cancel Order
    async cancelOrder(req, res) {
        try {
            const userId = req.userId;
            const orderId = req.params.id;

            const result = await orderService.cancelOrder(orderId, userId);
            res.json(result);
        } catch (err) {
            console.error("Cancel Order Error:", err);
            res.status(400).json({ message: err.message || "Failed to cancel order" });
        }
    },

    // 3. Update Payment Status
    async updatePaymentStatus(req, res) {
        try {
            const orderId = req.params.id;
            // In a real app, you might validate status from body, but prompt implies setting to PAID
            const result = await orderService.updatePaymentStatus(orderId);

            res.json(result);
        } catch (err) {
            console.error("Update Payment Error:", err);
            res.status(400).json({ message: err.message || "Failed to update payment status" });
        }
    },

    // 4. Get My Orders
    async getMyOrders(req, res) {
        try {
            const userId = req.userId;
            const orders = await orderService.getMyOrders(userId);
            res.json(orders);
        } catch (err) {
            console.error("Get My Orders Error:", err);
            res.status(500).json({ message: "Failed to fetch orders" });
        }
    },

    // 4b. Get Order Details
    async getOrderDetails(req, res) {
        try {
            const userId = req.userId;
            const orderId = req.params.id;

            const orderDetails = await orderService.getOrderDetails(orderId, userId);
            res.json(orderDetails);
        } catch (err) {
            console.error("Get Order Details Error:", err);
            if (err.message === "Order not found") {
                return res.status(404).json({ message: "Order not found" });
            }
            res.status(500).json({ message: "Failed to fetch order details" });
        }
    }
};
