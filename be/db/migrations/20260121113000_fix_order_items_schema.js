/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.alterTable("order_items", (table) => {
        // 1. Add missing 'color' and 'size' columns
        table.string("color", 50).nullable();
        table.string("size", 50).nullable();

        // 2. Make 'product_name' nullable (it is currently Not Null but checkout.js doesn't supply it)
        table.string("product_name", 255).nullable().alter();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Reversing this might cause data loss if we drop columns, so we skip strict down logic for this repair.
}
