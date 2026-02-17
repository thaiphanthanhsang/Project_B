/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.string("reset_pin", 6).nullable();
        table.datetime("reset_pin_expiry").nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
    return knex.schema.alterTable("users", function (table) {
        table.dropColumn("reset_pin");
        table.dropColumn("reset_pin_expiry");
    });
};
