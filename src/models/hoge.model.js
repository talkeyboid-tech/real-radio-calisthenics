const knex = require('../knex');
const HOGE_TABLE = 'hoge';

module.exports = {
  HOGE_TABLE,

  /**
   * @param {number} limit - The max number of customers to return.
   * @return {Promise<Array>} A promise that resolves to an array of customers.
   */
  getAll(limit = 100) {
    return knex
      .select({
        id: 'id',
        name: 'name',
      })
      .from(HOGE_TABLE)
      .limit(limit);
  },

  getById(id) {
    return knex
      .select({
        id: 'id',
        name: 'name',
      })
      .from(HOGE_TABLE)
      .where('id', '=', id)
      .first();
  },

  create(obj) {
    return new Promise((resolve) => {
      knex
        .insert(obj)
        .into(HOGE_TABLE)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        });
    });
  },

  remove(id) {
    return new Promise((resolve) => {
      knex(HOGE_TABLE)
        .where('id', '=', id)
        .del()
        .then((res) => {
          resolve(res);
        });
    });
  },

  update(id, obj) {
    return new Promise((resolve, reject) => {
      knex(HOGE_TABLE)
        .where('id', '=', id)
        .update(obj)
        .returning('id')
        .then((res) => {
          resolve(res[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
