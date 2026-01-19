export async function up(knex) {
    return knex.schema.alterTable("orders", (table) => {
        table.boolean("cancel_request").defaultTo(false);
    });
}

export async function down(knex) {
    return knex.schema.alterTable("orders", (table) => {
        table.dropColumn("cancel_request");
    });
}
