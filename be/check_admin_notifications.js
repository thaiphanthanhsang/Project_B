import { pool } from "./db.js";

async function checkSchema() {
    try {
        console.log("--- Checking Admin Notifications ---");
        const [columns] = await pool.query("DESCRIBE admin_notifications");
        console.log(columns.map(c => `${c.Field} (${c.Type})`).join("\n"));
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
