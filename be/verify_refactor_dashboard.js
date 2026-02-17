import { dashboardService } from "./services/dashboardService.js";
import { pool } from "./db.js";

async function verify() {
    console.log("--- Verifying Dashboard Refactor ---");
    try {
        console.log("1. Testing getLowStockList...");
        const lowStock = await dashboardService.getLowStockList();
        console.log(`   Success! Found ${lowStock.length} items.`);
        if (lowStock.length > 0) console.log("   Sample:", lowStock[0].name);

        console.log("2. Testing getTrendingProducts (Score Formula)...");
        const trending = await dashboardService.getTrendingProducts();
        console.log(`   Success! Found ${trending.length} items.`);
        if (trending.length > 0) console.log(`   Top Item: ${trending[0].name} (Score: ${trending[0].priorityScore})`);

        console.log("3. Testing getInventoryHealth (Days)...");
        const health = await dashboardService.getInventoryHealth();
        console.log(`   Success! Found ${health.length} items.`);
        if (health.length > 0) console.log(`   Sample: ${health[0].name}, Days Created: ${health[0].days_since_created}`);

    } catch (err) {
        console.error("FAIL:", err);
    } finally {
        await pool.end();
    }
}

verify();
