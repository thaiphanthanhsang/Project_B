/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasPriceAtPurchase = await knex.schema.hasColumn("order_items", "price_at_purchase");
    const hasPrice = await knex.schema.hasColumn("order_items", "price");

    await knex.schema.alterTable("order_items", (table) => {
        if (hasPriceAtPurchase && !hasPrice) {
            table.renameColumn("price_at_purchase", "price");
        } else if (!hasPrice) {
            // Fallback if neither exists (unlikely given previous dumping)
            table.decimal("price", 12, 2).notNullable().defaultTo(0);
        }
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Irreversible for safety or manual rollback
}
