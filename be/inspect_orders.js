
import { pool } from "./db.js";

async function inspect() {
    try {
        const [rows] = await pool.query("DESCRIBE orders");
        console.log("Current ORDERS table structure:");
        console.table(rows);
    } catch (err) {
        console.error("Error inspecting table:", err);
    } finally {
        process.exit();
    }
}

inspect();
