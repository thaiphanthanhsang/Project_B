/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // 1. Fix Products Table
    await knex.schema.alterTable("products", async (table) => {
        const hasQuantity = await knex.schema.hasColumn("products", "quantity");
        if (!hasQuantity) {
            table.integer("quantity").notNullable().defaultTo(0);
        }

        const hasViews = await knex.schema.hasColumn("products", "views");
        if (!hasViews) {
            table.integer("views").defaultTo(0);
        }

        const hasSoldCount = await knex.schema.hasColumn("products", "sold_count");
        if (!hasSoldCount) {
            table.integer("sold_count").defaultTo(0);
        }
    });

    // 2. Fix Orders Table
    await knex.schema.alterTable("orders", async (table) => {
        const hasCancelRequest = await knex.schema.hasColumn("orders", "cancel_request");
        if (!hasCancelRequest) {
            table.boolean("cancel_request").defaultTo(false);
        }

        const hasCancelBy = await knex.schema.hasColumn("orders", "cancel_by");
        if (!hasCancelBy) {
            table.string("cancel_by", 50).nullable();
        }

        const hasCancelReason = await knex.schema.hasColumn("orders", "cancel_reason");
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
    // We don't remove columns in a repair migration to avoid data loss
}
