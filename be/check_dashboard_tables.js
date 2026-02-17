import { pool } from "./db.js";

async function checkSchema() {
    try {
        console.log("--- Checking Products Schema ---");
        const [pColumns] = await pool.query("DESCRIBE products");
        console.log(pColumns.map(c => `${c.Field} (${c.Type})`).join("\n"));

        console.log("\n--- Checking Search Logs Schema ---");
        try {
            const [sColumns] = await pool.query("DESCRIBE search_logs");
            console.log(sColumns.map(c => `${c.Field} (${c.Type})`).join("\n"));
        } catch (e) {
            console.log("search_logs table does not exist.");
        }

    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
