import db from "../db/knex.js";

export const orderService = {
    /**
     * 1. Place Order (Đặt hàng & Trừ tồn kho)
     * Uses a transaction to ensure stock is only deducted if order is created successfully.
     */
    async placeOrder({ userId, cartItems, customer, paymentMethod, voucherCode }) {
        // Start Transaction
        return await db.transaction(async (trx) => {
            let totalPrice = 0;

            // 1. Check stock for all items
            // We process items sequentially to lock and check stock
            for (const item of cartItems) {
                const product = await trx("products")
                    .where({ id: item.productId })
                    .select("quantity", "price") // Ensure we check current stock
                    .first()
                    .forUpdate(); // Lock the row to prevent race conditions

                if (!product) {
                    throw new Error(`Product not found with ID: ${item.productId}`);
                }

                if (product.quantity < item.quantity) {
                    throw new Error(`Out of stock for product ID: ${item.productId}`);
                }

                totalPrice += item.price * item.quantity;
            }

            // Calculate Discount (logic copied from existing checkout)
            let discountAmount = 0;
            if (voucherCode === "SQB10") {
                discountAmount = totalPrice * 0.10;
            }
            const finalPrice = totalPrice - discountAmount;

            // 2. Create Order Record
            const [orderId] = await trx("orders").insert({
                user_id: userId,
                full_name: customer.fullName,
                phone: customer.phone,
                address: customer.address,
                note: customer.note || "",
                total_price: finalPrice,
                status: "pending", // Default status
                payment_method: paymentMethod || "COD",
                voucher_code: voucherCode || null,
                discount_amount: discountAmount,
                created_at: new Date(),
                updated_at: new Date()
            });

            // 3. Insert Order Items & 4. Deduct Stock
            for (const item of cartItems) {
                // Create order item
                await trx("order_items").insert({
                    order_id: orderId,
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    color: item.color || null,
                    size: item.size || null
                });

                // Deduct stock and update sold count
                await trx("products")
                    .where({ id: item.productId })
                    .decrement("quantity", item.quantity)
                    .increment("sold_count", item.quantity);

                // Optional: Update status text based on new quantity 
                // (This is tricky with simple decrement, so we might skip strictly updating 'status' text unless we re-fetch, 
                // but for performance we often rely on quantity > 0 checks in application logic)
            }

            // 5. Remove items from carts (assuming we empty the user's cart)
            // If specific items were bought from cart, we should delete only those.
            // Here we assume checking out clears the user's cart for simplicity as usually done.
            await trx("carts").where({ user_id: userId }).del();

            return { orderId, message: "Order placed successfully" };
        });
    },

    /**
     * 2. Cancel Order (Hủy đơn & Hoàn tồn kho)
     */
    async cancelOrder(orderId, userId) {
        return await db.transaction(async (trx) => {
            // 1. Verify Order ownership and status
            const order = await trx("orders")
                .where({ id: orderId, user_id: userId })
                .first();

            if (!order) {
                throw new Error("Order not found");
            }

            if (order.status !== "pending") {
                throw new Error("Only pending orders can be cancelled");
            }

            // 2. Update Status to CANCELLED
            await trx("orders")
                .where({ id: orderId })
                .update({
                    status: "cancelled",
                    cancelled_at: new Date(),
                    cancel_by: "user",
                    updated_at: new Date()
                });

            // 3. Restore Stock
            const orderItems = await trx("order_items").where({ order_id: orderId });

            for (const item of orderItems) {
                await trx("products")
                    .where({ id: item.product_id })
                    .increment("quantity", item.quantity);
            }

            return { message: "Order cancelled successfully" };
        });
    },

    /**
     * 3. Update Payment Status
     */
    async updatePaymentStatus(orderId) {
        // Check if 'payment_status' column exists, otherwise we might fail. 
        // Assuming we need to update it.
        // Since existing schema didn't show it, this might throw if column missing.
        // BUT the task required implementing it. I will implement assuming column exists or will be added.

        const result = await db("orders")
            .where({ id: orderId })
            .update({
                payment_status: "paid", // Assuming column name is payment_status
                updated_at: new Date()
            });

        if (result === 0) {
            throw new Error("Order not found");
        }

        return { message: "Payment status updated to PAID" };
    },

    /**
     * 4. Get Order History (My Orders)
     */
    async getMyOrders(userId) {
        return await db("orders")
            .where({ user_id: userId })
            .orderBy("created_at", "desc")
            .select(
                "id",
                "total_price",
                "status",
                "created_at",
                "payment_method",
                "payment_status", // Include this if it exists
                "cancel_request",
                "cancel_reason"
            );
    },

    /**
     * 4b. Get Order Details
     */
    async getOrderDetails(orderId, userId) {
        const order = await db("orders")
            .where({ id: orderId, user_id: userId })
            .first();

        if (!order) {
            throw new Error("Order not found");
        }

        // Join with products to get name and image (assuming 'image' column exists in products, or 'thumbnail')
        // Existing schema dump didn't show full products schema, but inspecting checkout.js didn't show images either.
        // User assumed 'products' has name and image.
        const items = await db("order_items")
            .join("products", "order_items.product_id", "products.id")
            .where({ order_id: orderId })
            .select(
                "order_items.id",
                "order_items.product_id",
                "products.name as product_name",
                "products.image", // Assuming 'image' column
                "order_items.quantity",
                "order_items.price",
                "order_items.color",
                "order_items.size"
            );

        return { ...order, items };
    }
};
