const TABLE_NAME = 'videos';
const INSERT_DATA = require('../../.dev/videosTable.json');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex(TABLE_NAME).del();
  await knex(TABLE_NAME).insert(INSERT_DATA);
};
