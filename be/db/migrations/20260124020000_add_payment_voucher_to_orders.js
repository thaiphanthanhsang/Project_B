/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable("orders", function (table) {
        table.string("payment_method", 50).defaultTo("COD");
        table.string("voucher_code", 50).nullable();
        table.decimal("discount_amount", 10, 2).defaultTo(0);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.alterTable("orders", function (table) {
        table.dropColumn("payment_method");
        table.dropColumn("voucher_code");
        table.dropColumn("discount_amount");
    });
};
