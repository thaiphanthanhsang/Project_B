
import { pool } from "./db.js";

async function runTest() {
    console.log(`[TEST] Verifying Cancel Fix`);

    // 1. Create a dummy order
    let orderId = null;

    try {
        const [res] = await pool.query(
            "INSERT INTO orders (user_id, full_name, total_price, status, created_at) VALUES (1, 'Test Cancel', 100, 'pending', NOW())"
        );
        orderId = res.insertId;
        console.log(`[SETUP] Order ${orderId} created`);

        // 2. Mock Admin Cancel Call (Simulating the SQL from adminOrder.js)
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            console.log(`[ACTION] Attempting to cancel...`);
            await conn.query(
                `
                UPDATE orders
                SET status = 'cancelled',
                    cancel_request = false,
                    cancel_by = 'admin',
                    cancelled_at = NOW()
                WHERE id = ?
                `,
                [orderId]
            );

            await conn.commit();
            console.log(`[PASS] Cancel Query Success!`);
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }

    } catch (err) {
        console.error(`[FAIL] Error: ${err.message}`);
    } finally {
        await pool.query("DELETE FROM orders WHERE id = ?", [orderId]);
        await pool.end();
    }
}

runTest();
