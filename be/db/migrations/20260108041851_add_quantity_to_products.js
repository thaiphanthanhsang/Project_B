/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.table("products", (table) => {
        table
            .integer("quantity")
            .notNullable()
            .defaultTo(0);
    });
}

export async function down(knex) {
    await knex.schema.table("products", (table) => {
        table.dropColumn("quantity");
    });
}
