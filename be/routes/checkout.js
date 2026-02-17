import express from "express";
import { pool } from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Email Transporter
// Initialization uses env vars loaded at the top of index.js
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 🟠 SEND ORDER OTP
router.post("/send-otp", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const [userRows] = await pool.query("SELECT email FROM users WHERE id = ?", [userId]);

        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });
        const email = userRows[0].email;

        if (!email) {
            return res.status(400).json({ message: "Your account does not have an email address." });
        }

        // Generate PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await pool.query("UPDATE users SET order_verify_pin = ?, order_verify_expiry = ? WHERE id = ?", [
            pin,
            expiry,
            userId
        ]);

        // Mail Options
        const mailOptions = {
            from: `"Shop SQB" <${process.env.EMAIL_USER || "no-reply@shopsqb.com"}>`,
            to: email,
            subject: "Your Order Confirmation PIN",
            text: `Your PIN is ${pin}`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Order Confirmation</h2>
                    <p>Please use the PIN below to verify your order:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 10px; background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        ${pin}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire in 5 minutes.</p>
                   </div>`
        };

        // Send Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`[SUCCESS] OTP sent to ${email}`);
        } else {
            console.log(`[DEV MODE] EMAIL_USER/PASS not set. Order PIN for ${email}: ${pin}`);
        }

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (err) {
        console.error("SEND OTP ERROR:", err);
        res.status(500).json({ message: "Failed to send OTP. Please check email configuration." });
    }
});


// 🟢 PROCESS CHECKOUT
router.post("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const { cartItems, customer, otp, paymentMethod = "COD", voucherCode } = req.body;

    if (!otp) {
        return res.status(400).json({ message: "Verification PIN is required." });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customer?.fullName || !customer?.phone || !customer?.address) {
        return res.status(400).json({ message: "Missing shipping information" });
    }

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 0️⃣ VERIFY OTP
        const [users] = await conn.query("SELECT order_verify_pin, order_verify_expiry FROM users WHERE id = ? FOR UPDATE", [userId]);
        const user = users[0];

        if (!user || user.order_verify_pin !== otp) {
            throw new Error("Invalid verification PIN.");
        }
        if (new Date() > new Date(user.order_verify_expiry)) {
            throw new Error("Verification PIN has expired.");
        }

        // Consume OTP
        await conn.query("UPDATE users SET order_verify_pin = NULL, order_verify_expiry = NULL WHERE id = ?", [userId]);

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

        // 1.5️⃣ CALCULATE DISCOUNT
        let discountAmount = 0;
        if (voucherCode === "SQB10") {
            discountAmount = totalPrice * 0.10; // 10% discount
        }

        const finalPrice = totalPrice - discountAmount;

        // 2️⃣ CREATE ORDER
        const [orderResult] = await conn.query(
            `INSERT INTO orders 
       (user_id, full_name, phone, address, note, total_price, status, payment_method, voucher_code, discount_amount)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
            [
                userId,
                customer.fullName,
                customer.phone,
                customer.address,
                customer.note || "",
                finalPrice,
                paymentMethod,
                voucherCode || null,
                discountAmount
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
             sold_count = sold_count + ?,
             status = IF(quantity - ? > 0, 'In stock', 'Out of stock')
         WHERE id = ?`,
                [item.quantity, item.quantity, item.quantity, item.productId]
            );
        }

        await conn.commit();
        res.json({ message: "Checkout successful", orderId });

    } catch (err) {
        await conn.rollback();
        console.error("CHECKOUT ERROR:", err);
        res.status(400).json({ message: err.message || "Checkout failed" });
    } finally {
        conn.release();
    }
});

export default router;
