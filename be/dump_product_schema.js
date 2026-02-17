import { pool } from "./db.js";
import fs from 'fs';

async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE products");
        const output = JSON.stringify(rows, null, 2);
        fs.writeFileSync('product_schema_dump.json', output);
        console.log("Product Schema dumped to product_schema_dump.json");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
