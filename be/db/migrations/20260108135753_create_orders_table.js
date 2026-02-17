/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const exists = await knex.schema.hasTable("orders");
    if (!exists) {
        return knex.schema.createTable("orders", (table) => {
            table.increments("id").primary();

            table
                .integer("user_id")
                .unsigned()
                .nullable()
                .references("id")
                .inTable("users")
                .onDelete("SET NULL");

            table.string("full_name", 100).notNullable();
            table.string("phone", 20).notNullable();
            table.string("address", 255).notNullable();
            table.text("note");

            table.decimal("total_price", 12, 2).notNullable();

            table
                .enum("status", [
                    "pending",
                    "confirmed",
                    "shipping",
                    "completed",
                    "cancelled",
                ])
                .defaultTo("pending");

            table.timestamps(true, true);
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable("orders");
}
