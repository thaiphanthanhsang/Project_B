
import { pool } from "./db.js";

async function runTest() {
    console.log(`[TEST] Verifying Inventory Aging Logic`);

    // Test Data
    // A: Qty 50, Created 90 days, Never Sold -> EXPECTED (Stagnant)
    // B: Qty 50, Created 10 days, Never Sold -> SKIP (Clean/New)
    // C: Qty 50, Created 90 days, Sold 2 days ago -> SKIP (Active)
    // D: Qty 10, Created 90 days, Never Sold -> SKIP (Low Stock)

    const idA = 'inv_A_' + Date.now();
    const idB = 'inv_B_' + Date.now();
    const idC = 'inv_C_' + Date.now();
    const idD = 'inv_D_' + Date.now();
    let orderIdC = null; // Auto-increment ID container

    // ...
    const insertProd = "INSERT INTO products (id, name, quantity, created_at, updated_at, views, sold_count, price, category, brand) VALUES (?, ?, ?, ?, ?, 0, 0, 100, 'Test', 'Test')";

    try {
        // A: 90 days old
        await pool.query(insertProd, [idA, 'Product A (Stagnant)', 50, new Date(Date.now() - 90 * 86400000), new Date()]);

        // B: 10 days old
        await pool.query(insertProd, [idB, 'Product B (New)', 50, new Date(Date.now() - 10 * 86400000), new Date()]);

        // C: 90 days old but sold recently
        await pool.query(insertProd, [idC, 'Product C (Active)', 50, new Date(Date.now() - 90 * 86400000), new Date()]);
        // Insert Order for C (2 days ago)
        // Insert Order for C (2 days ago)
        const [orderRes] = await pool.query("INSERT INTO orders (user_id, total_price, status, created_at) VALUES (1, 100, 'completed', ?)", [new Date(Date.now() - 2 * 86400000)]);
        orderIdC = orderRes.insertId;
        await pool.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, 1, 100)", [orderIdC, idC]);

        // D: Low stock
        await pool.query(insertProd, [idD, 'Product D (Low Stock)', 10, new Date(Date.now() - 90 * 86400000), new Date()]);


        // Fetch API - Note: Need to implement /dashboard/inventory-health endpoint or verify via service?
        // Wait, the user asked for `GET /api/dashboard/inventory-health`.
        // Let's call the API. Assuming I need to login as admin first?
        // Yes, dashboard routes are protected. I need a token.
        // For simplicity, I will use `dashboardService.getInventoryHealth()` directly in this script OR mock login.
        // It's better to test the API. I'll mock login as Superadmin.

        // 1. Login
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        // 2. Fetch Inventory Health
        const res = await fetch('http://localhost:5000/api/dashboard/inventory-health', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        const data = json.data; // Because dashboardController wraps in successResponse { data: ... }

        console.log(`[CHECK] Inventory Health List:`);
        const foundA = data.find(p => p.id === idA);
        const foundB = data.find(p => p.id === idB);
        const foundC = data.find(p => p.id === idC);
        const foundD = data.find(p => p.id === idD);

        if (foundA) console.log(`[PASS] Product A found (Stagnant)`);
        else console.error(`[FAIL] Product A MISSING`);

        if (!foundB) console.log(`[PASS] Product B skipped (Too New)`);
        else console.error(`[FAIL] Product B FOUND (Should be skipped)`);

        if (!foundC) console.log(`[PASS] Product C skipped (Active Sales)`);
        else console.error(`[FAIL] Product C FOUND (Should be skipped)`);

        if (!foundD) console.log(`[PASS] Product D skipped (Low Stock)`);
        else console.error(`[FAIL] Product D FOUND (Should be skipped)`);

    } catch (err) {
        console.error(err);
    } finally {
        // Cleanup
        await pool.query("DELETE FROM order_items WHERE order_id = ?", [orderIdC]);
        await pool.query("DELETE FROM orders WHERE id = ?", [orderIdC]);
        await pool.query("DELETE FROM products WHERE id IN (?, ?, ?, ?)", [idA, idB, idC, idD]);
        await pool.end();
    }
}

runTest();
