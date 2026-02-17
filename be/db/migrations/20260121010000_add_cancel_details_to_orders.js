/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasCancelRequest = await knex.schema.hasColumn("orders", "cancel_request");
    const hasCancelBy = await knex.schema.hasColumn("orders", "cancel_by");
    const hasCancelReason = await knex.schema.hasColumn("orders", "cancel_reason");

    await knex.schema.alterTable("orders", (table) => {
        if (!hasCancelRequest) {
            table.boolean("cancel_request").defaultTo(false);
        }
        if (!hasCancelBy) {
            table.string("cancel_by", 50).nullable(); // 'user' or 'admin'
        }
        if (!hasCancelReason) {
            table.text("cancel_reason").nullable();
        }
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable("orders", (table) => {
        table.dropColumn("cancel_by");
        table.dropColumn("cancel_reason");
        // We do not drop 'cancel_request' here as it might have been created by another migration
    });
}
