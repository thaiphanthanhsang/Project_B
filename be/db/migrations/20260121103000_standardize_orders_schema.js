/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // 1. Make legacy columns nullable to prevent insert errors
    const hasShippingPhone = await knex.schema.hasColumn("orders", "shipping_phone");
    const hasShippingAddress = await knex.schema.hasColumn("orders", "shipping_address");

    await knex.schema.alterTable("orders", (table) => {
        if (hasShippingPhone) {
            table.string("shipping_phone", 255).nullable().alter();
        }
        // shipping_address handled in previous migration, but good to ensure
        if (hasShippingAddress) {
            table.string("shipping_address", 255).nullable().alter();
        }
    });

    // 2. Data Migration: Copy legacy data to new standard columns if new ones are empty
    await knex.raw(`
    UPDATE orders 
    SET address = shipping_address 
    WHERE (address IS NULL OR address = '') AND shipping_address IS NOT NULL
  `);

    await knex.raw(`
    UPDATE orders 
    SET phone = shipping_phone 
    WHERE (phone IS NULL OR phone = '') AND shipping_phone IS NOT NULL
  `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // No rollback needed for data cleanup
}
