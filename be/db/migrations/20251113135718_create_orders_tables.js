/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // This is a dummy migration to fix a corruption issue.
    // The original file was lost but the DB thinks it ran.
    // We do nothing here as the table likely exists or was handled by another migration.
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // Do nothing
}
