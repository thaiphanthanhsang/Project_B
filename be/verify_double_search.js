
import { pool } from "./db.js";

const BASE_URL = 'http://localhost:5000/api';
const TEST_KEYWORD = `test_db_${Date.now()}`;

async function runTest() {
    console.log(`[TEST] Starting Double Search Test with keyword: "${TEST_KEYWORD}"`);

    // 1. Send 3 rapid requests
    try {
        console.log(`[TEST] Sending 3 rapid requests...`);
        await Promise.all([
            fetch(`${BASE_URL}/products/search?q=${TEST_KEYWORD}`),
            fetch(`${BASE_URL}/products/search?q=${TEST_KEYWORD}`),
            fetch(`${BASE_URL}/products/search?q=${TEST_KEYWORD}`)
        ]);

        // Wait 1 second for DB to process
        await new Promise(r => setTimeout(r, 1000));

        // 2. Check DB count
        const [rows] = await pool.query("SELECT COUNT(*) as count FROM search_logs WHERE keyword = ?", [TEST_KEYWORD]);
        const count = rows[0].count;

        console.log(`[CHECK] Database Count for "${TEST_KEYWORD}": ${count}`);

        if (count === 1) {
            console.log(`[PASS] Success! Only 1 log entry created.`);
        } else {
            console.error(`[FAIL] Found ${count} entries. Expected 1.`);
        }

    } catch (err) {
        console.error(`[FAIL] Error: ${err.message}`);
    } finally {
        await pool.end();
    }
}

runTest();
