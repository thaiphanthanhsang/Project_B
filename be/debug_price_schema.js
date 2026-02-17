import { pool } from "./db.js";

async function checkSchema() {
    try {
        const [products] = await pool.query("DESCRIBE products");
        console.log("--- Products Table ---");
        console.table(products);

        const [orderItems] = await pool.query("DESCRIBE order_items");
        console.log("--- Order Items Table ---");
        console.table(orderItems);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
