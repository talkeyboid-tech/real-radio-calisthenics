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

// TODO: selectのオブジェクトは共通化する
const videoModel = {
  getAll(limit = 1000) {
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
    // limitとoffset以外のクエリを取得
    const queryWithoutLimitAndOffset = {};
    Object.assign(queryWithoutLimitAndOffset, query);
    delete queryWithoutLimitAndOffset.limit;
    delete queryWithoutLimitAndOffset.offset;

    // 分岐フラグ
    const existsLimit = !!query.limit;
    const existsOffset = !!query.offset;
    const existsWithoutLimitAndOffset = !!Object.keys(
      queryWithoutLimitAndOffset
    ).length;

    // limitのみ
    if (existsLimit && !existsOffset && !existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .limit(query.limit)
        .orderBy('id', 'asc');
    }

    // offsetのみ
    if (!existsLimit && existsOffset && !existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .offset(query.offset)
        .orderBy('id', 'asc');
    }

    // 他のクエリのみ
    if (!existsLimit && !existsOffset && existsWithoutLimitAndOffset) {
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
    }

    // limitとoffset
    if (existsLimit && existsOffset && !existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('id', 'asc');
    }

    // limitと他のクエリ
    if (existsLimit && !existsOffset && existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .limit(query.limit)
        .where(queryWithoutLimitAndOffset)
        .orderBy('id', 'asc');
    }

    // offsetと他のクエリ
    if (!existsLimit && existsOffset && existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .offset(query.offset)
        .where(queryWithoutLimitAndOffset)
        .orderBy('id', 'asc');
    }

    // 全部
    if (existsLimit && existsOffset && existsWithoutLimitAndOffset) {
      return knex
        .select({
          id: 'id',
          title: 'title',
          description: 'description',
          viewCount: 'view_count',
          likeCount: 'like_count',
        })
        .from(VIDEOS_TBL)
        .limit(query.limit)
        .offset(query.offset)
        .where(queryWithoutLimitAndOffset)
        .orderBy('id', 'asc');
    }
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
