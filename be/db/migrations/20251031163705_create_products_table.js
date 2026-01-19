/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("products", function (table) {
    table.string("id").primary();

    table.string("name").notNullable();
    table.string("category").notNullable().index();
    table.string("brand").notNullable().index();
    table.integer("price").notNullable();
    table.integer("originalPrice");
    table.string("status").defaultTo("Còn hàng");
    table.string("imageUrl");

    table.json("images");
    table.json("sizes");
    table.json("colors");

    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("products");
}
