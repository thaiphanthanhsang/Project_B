
import { pool } from "./db.js";

async function runTest() {
    console.log(`[TEST] Verifying Trending Algorithm`);

    // 1. Manually set product stats
    // Product A: 100 views, 0 sold -> Score = 30
    // Product B: 0 views, 10 sold -> Score = 7
    // Product C: 50 views, 50 sold -> Score = 15 + 35 = 50 (Should be #1)

    const idA = 'trend_A_' + Date.now();
    const idB = 'trend_B_' + Date.now();
    const idC = 'trend_C_' + Date.now();

    try {
        const queryInsert = "INSERT INTO products (id, name, views, sold_count, quantity, price, category, brand, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'Test', 'Test', NOW(), NOW())";

        await pool.query(queryInsert, [idA, 'Product A', 100, 0, 10, 100]);
        await pool.query(queryInsert, [idB, 'Product B', 0, 10, 10, 100]);
        await pool.query(queryInsert, [idC, 'Product C', 50, 50, 10, 100]);

        // 2. Fetch Public API with sort=hot
        const res = await fetch('http://localhost:5000/api/products/public?sort=hot');

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        const products = data.products;

        console.log(`[CHECK] Top 3 Hot Products:`);
        products.slice(0, 3).forEach((p, i) => {
            const score = (p.views * 0.3) + (p.sold_count * 0.7);
            console.log(`#${i + 1} ${p.name} - Views: ${p.views}, Sold: ${p.sold_count} -> Score: ${score}`);
        });

        const topProduct = products[0];
        if (topProduct && topProduct.id === idC) {
            console.log(`[PASS] Logic confirmed: Product C is #1`);
        } else {
            console.error(`[FAIL] Expected Product C (Score 50) to be #1, but got ${topProduct?.name}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        // Cleanup
        await pool.query("DELETE FROM products WHERE id IN (?, ?, ?)", [idA, idB, idC]);
        await pool.end();
    }
}

runTest();
