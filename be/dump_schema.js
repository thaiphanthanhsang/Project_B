import { pool } from "./db.js";
import fs from 'fs';

async function checkSchema() {
    try {
        const [rows] = await pool.query("DESCRIBE orders");
        const output = JSON.stringify(rows, null, 2);
        fs.writeFileSync('schema_dump.json', output);
        console.log("Schema dumped to schema_dump.json");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
