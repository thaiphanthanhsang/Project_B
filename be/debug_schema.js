import { pool } from "./db.js";

async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE orders");
        console.log("Orders Table Schema:");
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
