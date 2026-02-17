/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasTable = await knex.schema.hasTable('product_views');
    if (!hasTable) {
        await knex.schema.createTable('product_views', (table) => {
            table.increments('id').primary();
            table.integer('product_id').unsigned().notNullable();
            table.integer('user_id').unsigned().nullable(); // Nullable for guest views
            table.timestamp('created_at').defaultTo(knex.fn.now());

            // Indexes for performance
            table.index('product_id');
            table.index('created_at');

            // Optional: Foreign key if you want to enforce integrity
            // table.foreign('product_id').references('products.id').onDelete('CASCADE');
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTableIfExists('product_views');
}
