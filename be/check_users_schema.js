import { pool } from "./db.js";

async function checkSchema() {
    try {
        console.log("--- Checking Users Schema ---");
        const [columns] = await pool.query("DESCRIBE users");
        console.log(columns.map(c => `${c.Field} (${c.Type})`).join("\n"));
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
