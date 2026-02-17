/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    // Set a default stock for existing products so they show up
    await knex("products")
        .where("quantity", 0)
        .update({
            quantity: 50,
            status: 'In stock'
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    // No rollback needed for data fix
}
