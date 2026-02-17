
import { pool } from "./db.js";

async function debug() {
    try {
        // 1. Check Schema
        console.log("--- Checking Schema ---");
        const [columns] = await pool.query("DESCRIBE products");
        console.log(columns.map(c => `${c.Field} (${c.Type})`).join(", "));

        // 2. Test Query
        console.log("\n--- Testing Sort Query ---");
        const query = "SELECT id, name, views, sold_count, (views * 0.3 + sold_count * 0.7) as score FROM products ORDER BY (views * 0.3 + sold_count * 0.7) DESC LIMIT 5";
        const [rows] = await pool.query(query);
        console.log(rows);

    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        await pool.end();
    }
}

debug();
