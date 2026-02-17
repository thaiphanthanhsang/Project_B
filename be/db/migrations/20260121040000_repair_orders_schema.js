/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    const hasFullName = await knex.schema.hasColumn("orders", "full_name");
    const hasPhone = await knex.schema.hasColumn("orders", "phone");
    const hasAddress = await knex.schema.hasColumn("orders", "address");
    const hasNote = await knex.schema.hasColumn("orders", "note");
    const hasTotalPrice = await knex.schema.hasColumn("orders", "total_price");
    const hasStatus = await knex.schema.hasColumn("orders", "status");

    await knex.schema.alterTable("orders", (table) => {
        if (!hasFullName) {
            table.string("full_name", 100).nullable();
        }
        if (!hasPhone) {
            table.string("phone", 20).nullable();
        }
        if (!hasAddress) {
            table.string("address", 255).nullable();
        }
        if (!hasNote) {
            table.text("note");
        }
        if (!hasTotalPrice) {
            table.decimal("total_price", 12, 2).defaultTo(0);
        }
        if (!hasStatus) {
            table.enum("status", [
                "pending",
                "confirmed",
                "shipping",
                "completed",
                "cancelled",
            ]).defaultTo("pending");
        }
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Safe to ignore down for repair
}
