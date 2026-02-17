/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasShippingAddress = await knex.schema.hasColumn("orders", "shipping_address");
    if (hasShippingAddress) {
        await knex.schema.alterTable("orders", (table) => {
            table.string("shipping_address", 255).nullable().alter();
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Irreversible or no-op regarding data safety
}
