import { pool } from "./db.js";

async function setRandomDiscounts() {
    try {
        const [products] = await pool.query("SELECT id, price, originalPrice FROM products");
        let updatedCount = 0;

        for (const product of products) {
            // If originalPrice is not set, set it to the current price
            const originalPrice = product.originalPrice || product.price;

            // Random discount between 10 and 30
            const discountPercent = Math.floor(Math.random() * (30 - 10 + 1)) + 10;

            // Calculate new price
            const newPrice = Math.round(originalPrice * (1 - discountPercent / 100));

            await pool.query(
                "UPDATE products SET price = ?, originalPrice = ? WHERE id = ?",
                [newPrice, originalPrice, product.id]
            );

            updatedCount++;
        }

        console.log(`Successfully updated ${updatedCount} products with random discounts between 10% and 30%.`);
    } catch (err) {
        console.error("Error updating discounts:", err);
    } finally {
        await pool.end();
    }
}

setRandomDiscounts();
