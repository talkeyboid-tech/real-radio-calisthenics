const knex = require('../knex');
const VIDEOS_TBL = 'videos';

// バリデーション設定
const { validProps, requiredProps } = require('../util/validation');
const validateProps = validProps([
  'id',
  'title',
  'description',
  'view_count',
  'like_count',
]);
const validateRequired = requiredProps(['id', 'title']);

const videoModel = {
  getAll(limit = 100) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(VIDEOS_TBL)
      .limit(limit)
      .orderBy('id', 'asc');
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
      .from(VIDEOS_TBL)
      .where('id', '=', id)
      .first();
  },

  getByQuery(query) {
    return knex
      .select({
        id: 'id',
        title: 'title',
        description: 'description',
        viewCount: 'view_count',
        likeCount: 'like_count',
      })
      .from(VIDEOS_TBL)
      .where(query)
      .first();
  },

  create(obj) {
    validateRequired(validateProps(obj));
    return new Promise((resolve) => {
      knex(VIDEOS_TBL)
        .insert(obj)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        });
    });
  },

  remove(id) {
    return new Promise((resolve) => {
      knex(VIDEOS_TBL)
        .where('id', '=', id)
        .del()
        .then((res) => {
          resolve(res);
        });
    });
  },

  update(id, obj) {
    validateProps(obj);
    return new Promise((resolve, reject) => {
      knex(VIDEOS_TBL)
        .where('id', '=', id)
        .update(obj)
        .returning('id')
        .then((res) => {
          resolve(res[0].id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

module.exports = { videoModel, VIDEOS_TBL };
