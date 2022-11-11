const knex = require('../knex');
const VIDEOS_TBL = 'videos';

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
    console.log();
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
    return new Promise((resolve) => {
      knex(VIDEOS_TBL)
        .insert(obj)
        .then((res) => {
          resolve(res);
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
    return new Promise((resolve, reject) => {
      knex(VIDEOS_TBL)
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

module.exports = { videoModel, VIDEOS_TBL };

// module.exports = {
//   TABLE,

//   getAll(limit = 100) {
//     return knex
//       .select({
//         id: 'id',
//         title: 'title',
//         description: 'description',
//         viewCount: 'view_count',
//         likeCount: 'like_count',
//       })
//       .from(TABLE)
//       .limit(limit);
//   },

//   getById(id) {
//     return knex
//       .select({
//         id: 'id',
//         title: 'title',
//         description: 'description',
//         viewCount: 'view_count',
//         likeCount: 'like_count',
//       })
//       .from(TABLE)
//       .where('id', '=', id)
//       .first();
//   },

//   create(obj) {
//     return new Promise((resolve) => {
//       knex
//         .insert(obj)
//         .into(TABLE)
//         .returning('id')
//         .then((res) => {
//           resolve(res[0].id);
//         });
//     });
//   },

//   remove(id) {
//     return new Promise((resolve) => {
//       knex(TABLE)
//         .where('id', '=', id)
//         .del()
//         .then((res) => {
//           resolve(res);
//         });
//     });
//   },

//   update(id, obj) {
//     return new Promise((resolve, reject) => {
//       knex(TABLE)
//         .where('id', '=', id)
//         .update(obj)
//         .returning('id')
//         .then((res) => {
//           resolve(res[0]);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };
