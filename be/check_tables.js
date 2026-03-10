import { pool } from "./db.js";

async function checkSchema() {
    try {
        console.log("--- Checking Tables ---");
        const [tables] = await pool.query("SHOW TABLES");
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log("Tables:", tableNames);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
