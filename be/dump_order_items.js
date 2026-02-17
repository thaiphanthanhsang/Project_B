import { pool } from "./db.js";
import fs from 'fs';

async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE order_items");
        const output = JSON.stringify(rows, null, 2);
        fs.writeFileSync('order_items_dump.json', output);
        console.log("Order Items Schema dumped to order_items_dump.json");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
