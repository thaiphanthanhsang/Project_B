
import { pool } from "./db.js";

async function runTest() {
    console.log(`[TEST] Verifying Stock Deduction`);

    // 1. Setup Validation Data
    const productId = 'stock_test_' + Date.now();
    const userId = 1; // Assuming user ID 1 exists (Superadmin)
    const initialQty = 100;

    try {
        // Create Product
        await pool.query("INSERT INTO products (id, name, quantity, price, category, brand, created_at, updated_at) VALUES (?, 'Stock Test Product', ?, 1000, 'Test', 'Test', NOW(), NOW())", [productId, initialQty]);
        console.log(`[SETUP] Product created with Qty: ${initialQty}`);

        // 2. Mock Checkout Call
        // Login to get token and ID
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        const loggedInUserId = loginData.user.id;

        // Need to set OTP first because checkout verifies it
        const pin = '123456';
        const expiry = new Date(Date.now() + 5 * 60000);
        await pool.query("UPDATE users SET order_verify_pin = ?, order_verify_expiry = ? WHERE id = ?", [pin, expiry, loggedInUserId]);

        // Call Checkout API
        const checkoutRes = await fetch('http://localhost:5000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                cartItems: [{ productId, quantity: 10, price: 1000 }],
                customer: { fullName: 'Test user', phone: '0123', address: 'VN' },
                otp: pin,
                paymentMethod: 'COD'
            })
        });

        if (!checkoutRes.ok) {
            const txt = await checkoutRes.text();
            throw new Error(`Checkout Failed: ${txt}`);
        }

        console.log(`[ACTION] Checkout success (Qty: 10)`);

        // 3. Verify Stock
        const [[prod]] = await pool.query("SELECT quantity FROM products WHERE id = ?", [productId]);
        console.log(`[CHECK] New Qty: ${prod.quantity}`);

        if (prod.quantity === initialQty - 10) {
            console.log(`[PASS] Stock deducted correctly.`);
        } else {
            console.error(`[FAIL] Expected ${initialQty - 10}, got ${prod.quantity}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        // Cleanup
        await pool.query("DELETE FROM products WHERE id = ?", [productId]);
        await pool.end();
    }
}

runTest();
