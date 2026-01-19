/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable("order_items", (table) => {
        table.increments("id").primary();

        table
            .integer("order_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("orders")
            .onDelete("CASCADE");

        table
            .string("product_id")
            .notNullable()
            .references("id")
            .inTable("products")
            .onDelete("RESTRICT");

        table.integer("quantity").notNullable();
        table.decimal("price", 12, 2).notNullable();

        table.string("color", 50);
        table.string("size", 50);

        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("order_items");
}
