import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { cartItems, customer } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customer?.fullName || !customer?.phone || !customer?.address) {
        return res.status(400).json({ message: "Missing shipping information" });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        let totalPrice = 0;

        // 1️⃣ CHECK & LOCK STOCK
        for (const item of cartItems) {
            const [[product]] = await conn.query(
                "SELECT quantity FROM products WHERE id = ? FOR UPDATE",
                [item.productId]
            );

            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Not enough stock for product ${item.productId}`);
            }

            totalPrice += item.price * item.quantity;
        }

        // 2️⃣ CREATE ORDER (FULL INFO)
        const [orderResult] = await conn.query(
            `INSERT INTO orders 
       (user_id, full_name, phone, address, note, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [
                userId,
                customer.fullName,
                customer.phone,
                customer.address,
                customer.note || "",
                totalPrice,
            ]
        );

        const orderId = orderResult.insertId;

        // 3️⃣ INSERT ORDER ITEMS + UPDATE STOCK
        for (const item of cartItems) {
            await conn.query(
                `INSERT INTO order_items 
         (order_id, product_id, quantity, price, color, size)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price,
                    item.color || null,
                    item.size || null,
                ]
            );

            await conn.query(
                `UPDATE products
         SET quantity = quantity - ?,
             status = IF(quantity - ? > 0, 'In stock', 'Out of stock')
         WHERE id = ?`,
                [item.quantity, item.quantity, item.productId]
            );
        }

        await conn.commit();
        res.json({ message: "Checkout successful", orderId });

    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(400).json({ message: err.message || "Checkout failed" });
    } finally {
        conn.release();
    }
});

export default router;
