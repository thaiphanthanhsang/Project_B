/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasFullName = await knex.schema.hasColumn("orders", "full_name");
    const hasPhone = await knex.schema.hasColumn("orders", "phone");
    const hasAddress = await knex.schema.hasColumn("orders", "address");
    const hasNote = await knex.schema.hasColumn("orders", "note");

    await knex.schema.alterTable("orders", (table) => {
        if (!hasFullName) {
            table.string("full_name", 100).defaultTo("");
        }
        if (!hasPhone) {
            table.string("phone", 20).defaultTo("");
        }
        if (!hasAddress) {
            table.string("address", 255).defaultTo("");
        }
        if (!hasNote) {
            table.text("note");
        }
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Repair only
}
