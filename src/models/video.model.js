const knex = require('../knex');
const TABLE = 'videos';

module.exports = {
  TABLE,

  getAll(limit = 100) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(TABLE)
      .limit(limit);
  },

  getById(id) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(TABLE)
      .where('id', '=', id)
      .first();
  },

  create(obj) {
    return new Promise((resolve) => {
      knex
        .insert(obj)
        .into(TABLE)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        });
    });
  },

  remove(id) {
    return new Promise((resolve) => {
      knex(TABLE)
        .where('id', '=', id)
        .del()
        .then((res) => {
          resolve(res);
        });
    });
  },

  update(id, obj) {
    return new Promise((resolve, reject) => {
      knex(TABLE)
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
