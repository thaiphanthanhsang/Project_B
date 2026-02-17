/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("orders", async (table) => {
        // Drop legacy columns if they exist
        const hasShippingAddress = await knex.schema.hasColumn("orders", "shipping_address");
        if (hasShippingAddress) {
            table.dropColumn("shipping_address");
        }

        const hasShippingPhone = await knex.schema.hasColumn("orders", "shipping_phone");
        if (hasShippingPhone) {
            table.dropColumn("shipping_phone");
        }

        // Also check for 'payment_method' if it causes issues, but for now focus on the error reported.
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Irreversible cleanup
}
