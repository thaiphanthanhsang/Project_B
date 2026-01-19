export async function up(knex) {
  await knex.schema.createTable("categories", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("path").notNullable();
  });

  await knex.schema.createTable("subcategories", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("path").notNullable();

    table.integer("category_id").unsigned().notNullable();
    table
      .foreign("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("subcategories");
  await knex.schema.dropTableIfExists("categories");
}
