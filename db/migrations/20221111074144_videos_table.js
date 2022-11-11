const TABLE_NAME = 'videos';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('id').primary();
    table.string('title', 255).notNullable();
    table.string('description', 10200);
    table.integer('view_count');
    table.integer('like_count');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.dropTable(TABLE_NAME);
};
