/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Alter product_id to be a string to support 'p18' format
    await knex.schema.alterTable("product_views", (table) => {
        table.string("product_id", 255).alter();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Irreversible efficiently without data loss if non-integers exist
    // We could try to revert to integer if needed, but it's risky
}
