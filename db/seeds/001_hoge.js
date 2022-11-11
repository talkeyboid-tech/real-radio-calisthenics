/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('hoge').del();
  await knex('hoge').insert([
    {
      name: 'hoge',
    },
    {
      name: 'fuga',
    },
    {
      name: 'foo',
    },
  ]);
};
