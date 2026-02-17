/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Add views and sold_count to products
    const hasViews = await knex.schema.hasColumn("products", "views");
    if (!hasViews) {
        await knex.schema.alterTable("products", (table) => {
            table.integer("views").defaultTo(0);
            table.integer("sold_count").defaultTo(0);
        });
    }

    // Create search_logs table
    const hasSearchLogs = await knex.schema.hasTable("search_logs");
    if (!hasSearchLogs) {
        await knex.schema.createTable("search_logs", (table) => {
            table.increments("id").primary();
            table.string("keyword").notNullable();
            table.integer("user_id").unsigned().nullable(); // Can be null for guest
            table.timestamp("created_at").defaultTo(knex.fn.now());
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("products", (table) => {
        table.dropColumn("views");
        table.dropColumn("sold_count");
    });
    await knex.schema.dropTable("search_logs");
}
