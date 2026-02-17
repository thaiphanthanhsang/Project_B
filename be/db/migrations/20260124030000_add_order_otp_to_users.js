/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.string("order_verify_pin", 6).nullable();
        table.datetime("order_verify_expiry").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("order_verify_pin");
        table.dropColumn("order_verify_expiry");
    });
};
