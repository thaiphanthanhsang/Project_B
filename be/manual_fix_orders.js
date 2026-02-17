
import { pool } from "./db.js";

async function fix() {
    try {
        const conn = await pool.getConnection();
        console.log("Fixing ORDERS table...");

        try {
            await conn.query("ALTER TABLE orders ADD COLUMN full_name VARCHAR(100) DEFAULT ''");
            console.log("Added full_name");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error("full_name error:", e.message);
        }

        try {
            await conn.query("ALTER TABLE orders ADD COLUMN phone VARCHAR(20) DEFAULT ''");
            console.log("Added phone");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error("phone error:", e.message);
        }

        try {
            await conn.query("ALTER TABLE orders ADD COLUMN address VARCHAR(255) DEFAULT ''");
            console.log("Added address");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error("address error:", e.message);
        }

        try {
            await conn.query("ALTER TABLE orders ADD COLUMN note TEXT");
            console.log("Added note");
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error("note error:", e.message);
        }

        console.log("Fix complete.");
        conn.release();
        process.exit(0);

    } catch (err) {
        console.error("Critical error:", err);
        process.exit(1);
    }
}

fix();
