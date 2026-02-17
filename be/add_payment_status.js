import { pool } from "./db.js";

async function addColumn() {
    try {
        console.log("Checking payment_status column...");
        const [columns] = await pool.query("SHOW COLUMNS FROM orders LIKE 'payment_status'");

        if (columns.length === 0) {
            console.log("Adding payment_status column...");
            await pool.query("ALTER TABLE orders ADD COLUMN payment_status ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID' AFTER payment_method");
            console.log("Column added successfully!");
        } else {
            console.log("Column already exists.");
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

addColumn();
