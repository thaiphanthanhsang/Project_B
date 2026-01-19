export async function up(knex) {
    return knex.schema.createTable("admin_notifications", (table) => {
        table.increments("id").primary();

        table
            .integer("order_id")
            .unsigned()
            .references("id")
            .inTable("orders")
            .onDelete("CASCADE");

        table.string("type").notNullable(); // order_cancelled
        table.text("message").notNullable();

        table.boolean("is_read").defaultTo(false);

        table.timestamps(true, true);
    });
}

export async function down(knex) {
    return knex.schema.dropTable("admin_notifications");
}
